'use strict';
const router = require('express').Router();
const api = require('../woocommerce.cjs');

router.post('/create-order', async (req, res) => {
  try {
    const response = await api.post('orders', req.body);
    res.status(201).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    console.error('[create-order] WooCommerce error:', JSON.stringify(data));
    res.status(status).json(data);
  }
});

router.post('/update-order', async (req, res) => {
  try {
    const { orderId, ...updateData } = req.body;
    const response = await api.put(`orders/${orderId}`, updateData);
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    console.error('[update-order] WooCommerce error:', JSON.stringify(data));
    res.status(status).json(data);
  }
});

module.exports = router;
