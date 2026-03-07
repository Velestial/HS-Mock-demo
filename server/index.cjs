'use strict';

// Startup env guard — MUST run before any other code
const REQUIRED_ENV = ['WC_URL', 'WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET', 'STRIPE_SECRET_KEY', 'FRONTEND_URL', 'NODE_ENV'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('STARTUP ERROR: Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler.cjs');

const app = express();
const port = process.env.PORT || 3000;

// CORS allowlist — dynamic origin callback, NOT open wildcard
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_STAGING_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Required for Phase 2 httpOnly cookie auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Morgan request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parser
app.use(express.json());
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

app.listen(port, () => {
  console.log(`HeySkipper Express server running at http://localhost:${port}`);
});
