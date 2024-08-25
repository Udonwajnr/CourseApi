const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
} = require('../controller/paymentController'); // Adjust path as needed

// Route to create a checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Route to handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
