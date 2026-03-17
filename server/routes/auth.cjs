'use strict';
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const wcApi = require('../woocommerce.cjs');

// 5 attempts per 15 minutes per IP on login and register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, code: 'TOO_MANY_REQUESTS', message: 'Too many attempts. Please try again in 15 minutes.' },
});

// Verify JWT signature against our shared secret and return the payload.
// Throws if the token is tampered, expired, or signed with a different key.
function verifyAndDecodeJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
}

// Set the hs_refresh httpOnly session cookie (session-only = no maxAge)
function setRefreshCookie(res, token) {
  res.cookie('hs_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: use 'None' in production (cross-domain: Vercel + TitanHostingHub),
    // 'Strict' in dev (Vite proxies through same origin)
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    // No maxAge — session cookie expires when browser closes (user decision)
  });
}

// Build trimmed user identity object from decoded payload
function buildUser(payload) {
  return {
    id: payload.id,
    email: payload.email,
    first_name: payload.user?.first_name || payload.first_name || '',
    last_name: payload.user?.last_name || payload.last_name || '',
  };
}

router.post('/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: true, code: 'MISSING_FIELDS', message: 'Email and password are required' });
  }

  const wcRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const wcData = await wcRes.json();

  if (!wcRes.ok || !wcData.success) {
    // Generic error — do NOT forward WC message (may reveal account existence)
    return res.status(401).json({ error: true, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
  }

  const accessToken = wcData.data.jwt;
  const payload = verifyAndDecodeJwt(accessToken);
  const user = buildUser(payload);

  setRefreshCookie(res, accessToken);
  res.json({ success: true, accessToken, user });
});

router.post('/auth/refresh', async (req, res) => {
  const existingToken = req.cookies?.hs_refresh;
  if (!existingToken) {
    return res.status(401).json({ error: true, code: 'NO_SESSION', message: 'No session' });
  }

  const wcRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ JWT: existingToken }),
  });
  const wcData = await wcRes.json();

  if (!wcRes.ok || !wcData.success) {
    res.clearCookie('hs_refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    });
    return res.status(401).json({ error: true, code: 'SESSION_EXPIRED', message: 'Session expired' });
  }

  const newAccessToken = wcData.data.jwt;
  const payload = verifyAndDecodeJwt(newAccessToken);
  const user = buildUser(payload);

  setRefreshCookie(res, newAccessToken);
  res.json({ success: true, accessToken: newAccessToken, user });
});

router.post('/auth/logout', (_req, res) => {
  res.clearCookie('hs_refresh', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
  });
  res.json({ success: true });
});

router.post('/auth/register', authLimiter, async (req, res) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ error: true, code: 'MISSING_FIELDS', message: 'First name, email, and password are required' });
  }

  // Step 1: Create WooCommerce customer via POST /wc/v3/customers
  let wcCustomer;
  try {
    const response = await wcApi.post('customers', {
      first_name: firstName,
      email,
      password,
    });
    wcCustomer = response.data;
  } catch (err) {
    // WooCommerce REST API wraps errors in err.response.data
    const wcErr = err?.response?.data;
    const code = wcErr?.code || '';
    const msg = (wcErr?.message || '').toLowerCase();
    const isDuplicate = code === 'registration-error-email-exists'
      || code === 'woocommerce_rest_customer_invalid_email'
      || msg.includes('already registered')
      || msg.includes('already exists');
    if (isDuplicate) {
      return res.status(409).json({
        error: true,
        code: 'EMAIL_EXISTS',
        message: 'An account with this email already exists. Log in instead?',
      });
    }
    return res.status(400).json({ error: true, code: 'REGISTRATION_FAILED', message: 'Registration failed. Please try again.' });
  }

  // Step 2: Auto-login — issue JWT immediately so user lands on Account page
  const authRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const authData = await authRes.json();

  if (!authRes.ok || !authData.success) {
    // Account created but auto-login failed — tell client to log in manually
    return res.status(201).json({ success: true, requiresLogin: true, message: 'Account created. Please log in.' });
  }

  // Build user from WC customer record (more reliable than JWT payload for new accounts)
  const accessToken = authData.data.jwt;
  const user = {
    id: wcCustomer.id,
    email: wcCustomer.email,
    first_name: wcCustomer.first_name,
    last_name: wcCustomer.last_name || '',
  };

  setRefreshCookie(res, accessToken);
  res.status(201).json({ success: true, accessToken, user });
});

module.exports = router;
