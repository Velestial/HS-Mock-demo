'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');
const requireAuth = require('../middleware/requireAuth.cjs');

router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const response = await api.post('orders', req.body);
    res.status(201).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json(data);
  }
});

router.post('/update-order', requireAuth, async (req, res) => {
  try {
    const { orderId, ...updateData } = req.body;
    const response = await api.put(`orders/${orderId}`, updateData);
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json(data);
  }
});

module.exports = router;
