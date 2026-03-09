# 03-04 Summary: Cancel WC Order on Failed Payment (Gap Closure)

**Status**: Complete
**Date**: 2026-03-09

## What was done
- Webhook now handles payment_intent.payment_failed: cancels WC order via api.put
- CheckoutPage catch block cancels WC order (client-side fallback) before showing error

## Files changed
- server/routes/payments.cjs — payment_intent.payment_failed handler in webhook
- components/CheckoutPage.tsx — order cancellation in catch block
