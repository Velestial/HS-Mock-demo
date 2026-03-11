'use strict';

// Startup env guard — MUST run before any other code
const REQUIRED_ENV = ['WC_URL', 'WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET', 'STRIPE_SECRET_KEY', 'FRONTEND_URL', 'NODE_ENV', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('STARTUP ERROR: Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler.cjs');

const app = express();
const port = process.env.PORT || 3000;

// Security headers — must be before CORS and routes
app.use(helmet({
  // Allow Tailwind CDN, Google Fonts, Stamped, Stripe, GA4 in CSP
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://cdn1.stamped.io', 'https://js.stripe.com', 'https://www.googletagmanager.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.tailwindcss.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      frameSrc: ['https://js.stripe.com', 'https://emotivecdn.io'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://api.stamped.io'],
    },
  } : false, // Disabled in dev to avoid blocking Vite HMR
  crossOriginEmbedderPolicy: false, // Required for Stripe/Emotive iframes
}));

// CORS allowlist — dynamic origin callback, NOT open wildcard
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_STAGING_URL,
  process.env.FRONTEND_PRODUCTION_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Railway healthcheck, server-to-server, curl)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Required for Phase 2 httpOnly cookie auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Morgan request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parser — 10kb limit prevents oversized payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Route mounting — all under /api
app.use('/api', require('./routes/health.cjs'));
app.use('/api', require('./routes/products.cjs'));
app.use('/api', require('./routes/orders.cjs'));
app.use('/api', require('./routes/customers.cjs'));
app.use('/api', require('./routes/payments.cjs'));
app.use('/api', require('./routes/auth.cjs'));

// Normalized error handler — MUST be last (4-param signature)
app.use(errorHandler);

// Serve Vite-built frontend — must be after API routes and error handler
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
// SPA fallback — all non-API routes return index.html
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`HeySkipper Express server running at http://localhost:${port}`);
});
