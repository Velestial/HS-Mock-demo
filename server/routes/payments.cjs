'use strict';
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res, next) => {
  try {
    const { amount, currency = 'usd', wcOrderId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: wcOrderId ? { wc_order_id: String(wcOrderId) } : {},
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) { next(err); }
});

router.post('/stripe-webhook', require('express').raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set — skipping webhook verification');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const wcOrderId = paymentIntent.metadata?.wc_order_id;

    if (wcOrderId) {
      try {
        const api = require('../woocommerce.cjs');
        await api.put(`orders/${wcOrderId}`, {
          status: 'processing',
          transaction_id: paymentIntent.id,
        });
        console.log(`[webhook] Order ${wcOrderId} marked processing`);
      } catch (err) {
        console.error(`[webhook] Failed to update order ${wcOrderId}:`, err.message);
        // Still return 200 so Stripe doesn't retry
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const wcOrderId = paymentIntent.metadata?.wc_order_id;
    if (wcOrderId) {
      try {
        const api = require('../woocommerce.cjs');
        await api.put(`orders/${wcOrderId}`, { status: 'cancelled' });
        console.log(`[webhook] Order ${wcOrderId} cancelled after payment failure`);
      } catch (err) {
        console.error(`[webhook] Failed to cancel order ${wcOrderId}:`, err.message);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
