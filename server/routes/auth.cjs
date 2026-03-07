'use strict';
const router = require('express').Router();

// Decode JWT payload without verifying signature (WC is authoritative issuer)
function decodeJwtPayload(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
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

router.post('/auth/login', async (req, res) => {
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
  const payload = decodeJwtPayload(accessToken);
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
  const payload = decodeJwtPayload(newAccessToken);
  const user = buildUser(payload);

  setRefreshCookie(res, newAccessToken);
  res.json({ success: true, accessToken: newAccessToken, user });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('hs_refresh', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
  });
  res.json({ success: true });
});

router.post('/auth/register', async (req, res) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ error: true, code: 'MISSING_FIELDS', message: 'First name, email, and password are required' });
  }

  // Step 1: Create WC user via Simple JWT Login
  const regRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, first_name: firstName }),
  });
  const regData = await regRes.json();

  if (!regRes.ok || !regData.success) {
    // Detect duplicate email — WC/Simple JWT Login returns specific codes or message text
    const msg = (regData.message || regData.data?.message || '').toLowerCase();
    const isDuplicate = regData.code === 'registration-error-email-exists'
      || msg.includes('already registered')
      || msg.includes('email address is already registered');
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

  const accessToken = authData.data.jwt;
  const payload = decodeJwtPayload(accessToken);
  const user = buildUser(payload);

  setRefreshCookie(res, accessToken);
  res.status(201).json({ success: true, accessToken, user });
});

module.exports = router;
