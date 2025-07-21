// Payment Configuration - Update with your actual credentials
export const PAYMENT_CONFIG = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51OmV9wBbHqWb9XlUryvSYodzzXK6Eh60CS3qK0pVNniX8SfvC6eFWwFTSEBMRnl96XZcESR5LtfvWnnGmZ6u3lAt00tDz4LChs',
    merchantId: import.meta.env.VITE_STRIPE_MERCHANT_ID || 'acct_1OmV9wBbHqWb9XlU',
  },
  
  // PayPal Configuration
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AeHaUBXkVaFKF8FGKTdvhgTr7QI7AvGjHU7dF2QI7AvGjHU7dF2QI7AvGjHU7dF2QI',
    clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || 'your_paypal_secret',
    merchantEmail: import.meta.env.VITE_PAYPAL_MERCHANT_EMAIL || 'sb-merchant@business.example.com',
    environment: 'sandbox', // Change to 'live' for production
  },
  
  // Cash App Configuration
  cashapp: {
    cashtag: import.meta.env.VITE_CASHAPP_CASHTAG || '$YourCashTag',
    apiKey: import.meta.env.VITE_CASHAPP_API_KEY || 'your_cashapp_api_key',
    webhookSecret: import.meta.env.VITE_CASHAPP_WEBHOOK_SECRET || 'your_webhook_secret',
  },
  
  // Venmo Configuration
  venmo: {
    username: import.meta.env.VITE_VENMO_USERNAME || '@YourVenmoHandle',
    apiKey: import.meta.env.VITE_VENMO_API_KEY || 'your_venmo_api_key',
    webhookSecret: import.meta.env.VITE_VENMO_WEBHOOK_SECRET || 'your_webhook_secret',
  },
  
  // Chime Configuration
  chime: {
    email: import.meta.env.VITE_CHIME_EMAIL || 'your-chime@email.com',
    apiKey: import.meta.env.VITE_CHIME_API_KEY || 'your_chime_api_key',
    webhookSecret: import.meta.env.VITE_CHIME_WEBHOOK_SECRET || 'your_webhook_secret',
  },
  
  // Google Pay Configuration
  googlepay: {
    merchantId: import.meta.env.VITE_GOOGLEPAY_MERCHANT_ID || 'your_merchant_id',
    gatewayMerchantId: import.meta.env.VITE_GOOGLEPAY_GATEWAY_MERCHANT_ID || 'your_gateway_merchant_id',
  },
  
  // API Base URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
};

// Payment method configurations with fees and processing times
export const PAYMENT_METHODS = {
  stripe: {
    name: 'Stripe',
    type: 'card_and_bank',
    processingTime: 'Instant',
    fees: '2.9% + $0.30 (cards) or 0.8% (bank)',
    description: 'Pay with credit card, debit card, or bank account',
    icon: '💳',
  },
  
  paypal: {
    name: 'PayPal',
    type: 'digital_wallet',
    processingTime: 'Instant',
    fees: '2.9% + $0.30',
    description: 'Pay with your PayPal balance or linked accounts',
    icon: '🅿️',
  },
  
  cashapp: {
    name: 'Cash App',
    type: 'p2p_direct',
    processingTime: 'Instant',
    fees: 'Free',
    description: 'Direct payment from your Cash App account',
    icon: '💰',
  },
  
  venmo: {
    name: 'Venmo',
    type: 'p2p_direct',
    processingTime: 'Instant',
    fees: 'Free',
    description: 'Direct payment from your Venmo account',
    icon: '💸',
  },
  
  chime: {
    name: 'Chime',
    type: 'bank_direct',
    processingTime: 'Instant',
    fees: 'Free',
    description: 'Direct transfer from your Chime account',
    icon: '🏦',
  },
  
  googlepay: {
    name: 'Google Pay',
    type: 'digital_wallet',
    processingTime: 'Instant',
    fees: '2.9% + $0.30',
    description: 'Pay with Google Pay using saved methods',
    icon: '📱',
  },
};