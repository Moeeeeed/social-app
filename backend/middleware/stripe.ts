import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('CRITICAL: STRIPE_SECRET_KEY is not defined in environment variables');
}
const stripe = new Stripe(stripeSecretKey);

export const validateStripeWebhook = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  if (!signature) {
    return res.status(401).json({ error: 'Invalid request: Missing signature' });
  }

  try {
    const rawBody = (req as any).rawBody || req.body;
    
    const event = stripe.webhooks.constructEvent(
      typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody),
      signature,
      endpointSecret
    );

    (req as any).stripeEvent = event;
    next();
  } catch (error: any) {
    return res.status(400).json({ error: 'Webhook Error: Invalid signature' });
  }
};