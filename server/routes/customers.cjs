'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');
const requireAuth = require('../middleware/requireAuth.cjs');

// Ownership guard — authenticated user may only access their own customer record
function requireOwnership(req, res, next) {
  if (String(req.user.id) !== String(req.params.id)) {
    return res.status(403).json({ error: true, code: 'FORBIDDEN', message: 'Access denied' });
  }
  next();
}

router.get('/customer/:id', requireAuth, requireOwnership, async (req, res, next) => {
  try {
    const response = await api.get(`customers/${req.params.id}`);
    const c = response.data;
    // Strip PII — return identity fields only per AUTH-06
    res.json({ id: c.id, email: c.email, first_name: c.first_name, last_name: c.last_name });
  } catch (err) { next(err); }
});

router.get('/customer/:id/orders', requireAuth, requireOwnership, async (req, res, next) => {
  try {
    const response = await api.get('orders', { customer: req.params.id });
    res.json(response.data);
  } catch (err) { next(err); }
});

router.get('/customer/:id/downloads', requireAuth, requireOwnership, async (req, res, next) => {
  try {
    const response = await api.get(`customers/${req.params.id}/downloads`);
    res.json(response.data);
  } catch (err) { next(err); }
});

router.put('/customer/:id', requireAuth, requireOwnership, async (req, res, next) => {
  try {
    const response = await api.put(`customers/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) { next(err); }
});

module.exports = router;
