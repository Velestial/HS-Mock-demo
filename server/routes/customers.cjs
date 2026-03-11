'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');

router.get('/customer/:id', async (req, res, next) => {
  try {
    const response = await api.get(`customers/${req.params.id}`);
    const c = response.data;
    // Strip PII — return identity fields only per AUTH-06
    res.json({ id: c.id, email: c.email, first_name: c.first_name, last_name: c.last_name });
  } catch (err) { next(err); }
});

router.get('/customer/:id/orders', async (req, res, next) => {
  try {
    const response = await api.get('orders', { customer: req.params.id });
    res.json(response.data);
  } catch (err) { next(err); }
});

router.get('/customer/:id/downloads', async (req, res, next) => {
  try {
    const response = await api.get(`customers/${req.params.id}/downloads`);
    res.json(response.data);
  } catch (err) { next(err); }
});

router.put('/customer/:id', async (req, res, next) => {
  try {
    const response = await api.put(`customers/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) { next(err); }
});

module.exports = router;
