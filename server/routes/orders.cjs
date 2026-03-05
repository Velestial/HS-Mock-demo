'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');

router.post('/create-order', async (req, res) => {
  const response = await api.post('orders', req.body);
  res.status(201).json(response.data);
});

router.post('/update-order', async (req, res) => {
  const { orderId, ...updateData } = req.body;
  const response = await api.put(`orders/${orderId}`, updateData);
  res.json(response.data);
});

module.exports = router;
