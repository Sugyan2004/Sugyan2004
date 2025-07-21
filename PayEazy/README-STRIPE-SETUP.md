# Stripe Account-to-Account Payment Setup

## Overview
This setup allows customers to pay directly from their Stripe account, linked bank account, or using Stripe Link instead of entering card details.

## Setup Steps

### 1. Stripe Dashboard Configuration

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Go to Developers → API Keys
   - Copy your Publishable Key and Secret Key
3. **Enable Payment Methods**:
   - Go to Settings → Payment Methods
   - Enable "US Bank Account" payments
   - Enable "Link" for instant bank payments
4. **Set up Webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 2. Environment Variables

```bash
# Add to your .env file
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
REACT_APP_STRIPE_SECRET_KEY=sk_test_your_secret_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Backend Setup

You'll need a backend server to handle:
- Creating Payment Intents
- Managing customers
- Handling webhooks

See `backend-example.js` for a complete Node.js implementation.

### 4. Payment Flow

1. **Customer selects Stripe Account payment**
2. **System creates Payment Intent** with account payment methods
3. **Stripe shows payment options**:
   - Pay from Stripe account balance
   - Link bank account for instant payment
   - Use Stripe Link (if available)
   - Card as fallback option
4. **Payment processes automatically**
5. **Webhook confirms success/failure**

### 5. Benefits of Account Payments

- **Lower fees**: 0.8% for bank account vs 2.9% + $0.30 for cards
- **Higher success rates**: Direct bank payments have fewer declines
- **Better user experience**: No need to enter card details
- **Instant payments**: With Stripe Link
- **Recurring capability**: Save payment methods for future use

### 6. Testing

Use Stripe's test mode with these test bank accounts:
- **Routing Number**: 110000000
- **Account Number**: 000123456789
- **Account Type**: Checking

### 7. Going Live

1. Activate your Stripe account
2. Switch to live API keys
3. Update webhook endpoints to production URLs
4. Test with real bank account (small amount first)

## Security Notes

- Never expose secret keys in frontend code
- Always validate webhooks with signature verification
- Use HTTPS for all webhook endpoints
- Store sensitive data securely on your backend