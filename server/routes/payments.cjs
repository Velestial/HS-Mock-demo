'use strict';
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd', metadata = {} } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,        // Amount in cents (e.g. 1099 = $10.99)
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

module.exports = router;
