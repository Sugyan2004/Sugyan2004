// Complete Backend API for Direct Payment Processing
// This handles all payment methods with direct integration

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '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');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Stripe Payment Intent Creation
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', payment_method_types = ['card'], metadata = {} } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      payment_method_types: payment_method_types,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        platform: 'payeazy',
        type: 'deposit',
        ...metadata
      }
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cash App Direct Payment
app.post('/api/cashapp-payment', async (req, res) => {
  try {
    const { amount, recipient, note } = req.body;
    
    // Cash App API integration
    const cashAppResponse = await fetch('https://api.cash.app/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CASHAPP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'USD'
        },
        recipient: {
          cashtag: recipient
        },
        note: note,
        redirect_url: `${process.env.FRONTEND_URL}/payment-success`
      })
    });

    const result = await cashAppResponse.json();
    
    if (result.payment_url) {
      res.json({
        success: true,
        payment_url: result.payment_url,
        transaction_id: result.id
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Cash App payment failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Venmo Direct Payment
app.post('/api/venmo-payment', async (req, res) => {
  try {
    const { amount, recipient, note } = req.body;
    
    // Venmo API integration
    const venmoResponse = await fetch('https://api.venmo.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VENMO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: recipient,
        amount: amount,
        note: note,
        audience: 'private'
      })
    });

    const result = await venmoResponse.json();
    
    if (result.data) {
      res.json({
        success: true,
        transaction_id: result.data.id,
        status: result.data.status
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Venmo payment failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Chime Direct Transfer
app.post('/api/chime-payment', async (req, res) => {
  try {
    const { amount, recipient_email, memo } = req.body;
    
    // Chime API integration
    const chimeResponse = await fetch('https://api.chime.com/v1/transfers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHIME_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        recipient: {
          email: recipient_email
        },
        memo: memo,
        type: 'instant'
      })
    });

    const result = await chimeResponse.json();
    
    if (result.transfer_id) {
      res.json({
        success: true,
        transaction_id: result.transfer_id,
        status: result.status
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Chime transfer failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Google Pay Processing
app.post('/api/process-googlepay', async (req, res) => {
  try {
    const { paymentData, amount } = req.body;
    
    // Process Google Pay token with Stripe
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: paymentData.paymentMethodData.tokenizationData.token
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/payment-success`
    });

    res.json({
      success: true,
      transaction_id: paymentIntent.id,
      status: paymentIntent.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook handlers for payment confirmations
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update your database with successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Update your database with failed payment
      break;
  }

  res.json({received: true});
});

// Cash App Webhook
app.post('/api/webhooks/cashapp', (req, res) => {
  const { event_type, payment } = req.body;
  
  if (event_type === 'payment.completed') {
    console.log('Cash App payment completed:', payment.id);
    // Update your database
  }
  
  res.json({received: true});
});

// Venmo Webhook
app.post('/api/webhooks/venmo', (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'payment.completed') {
    console.log('Venmo payment completed:', data.id);
    // Update your database
  }
  
  res.json({received: true});
});

// Chime Webhook
app.post('/api/webhooks/chime', (req, res) => {
  const { event_type, transfer } = req.body;
  
  if (event_type === 'transfer.completed') {
    console.log('Chime transfer completed:', transfer.id);
    // Update your database
  }
  
  res.json({received: true});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Payment API server running on port ${PORT}`);
});

module.exports = app;