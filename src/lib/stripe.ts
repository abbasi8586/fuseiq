import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    agents: 3,
    apiCalls: 10000,
    storage: 5,
    features: ["Basic agents", "Community support", "Standard analytics"],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 99,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
    agents: 25,
    apiCalls: 100000,
    storage: 50,
    features: ["All agent frameworks", "Priority support", "Advanced analytics", "BYOK", "Custom workflows"],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 499,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    agents: Infinity,
    apiCalls: 1000000,
    storage: 500,
    features: ["SSO/SAML", "SOC 2 compliance", "Dedicated infrastructure", "White-label", "SLA guarantee"],
  },
};
