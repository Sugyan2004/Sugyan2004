// Backend API Example for Stripe Account-to-Account Payments
// This would be your Node.js/Express backend

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Create Payment Intent for Account-to-Account Payment
app.post('/api/create-stripe-account-payment', async (req, res) => {
  try {
    const { amount, customer_email } = req.body;

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customer_email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customer_email,
      });
    }

    // Create ephemeral key for customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    // Create Payment Intent with account payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      customer: customer.id,
      payment_method_types: [
        'us_bank_account',  // Direct bank account payments
        'link',             // Stripe Link (instant bank payments)
        'card'              // Fallback to card if needed
      ],
      setup_future_usage: 'off_session', // For future payments
      metadata: {
        type: 'deposit',
        platform: 'eazypay'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update your database with successful payment
      // updateDepositStatus(paymentIntent.metadata.user_id, 'completed');
      
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update your database with failed payment
      // updateDepositStatus(failedPayment.metadata.user_id, 'failed');
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

module.exports = app;