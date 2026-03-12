import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'Sovereign Pro Platform',
    version: '0.1.0',
  },
});
