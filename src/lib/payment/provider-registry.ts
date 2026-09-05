import { PaymentProvider } from "./types";
import { NotConfiguredProvider } from "./providers/not-configured";

// To add a real gateway later (Stripe, NMI, Authorize.net, PaymentCloud, etc.):
// 1. Create src/lib/payment/providers/<name>.ts implementing PaymentProvider
// 2. Register it in the switch below
// 3. Set PAYMENT_PROVIDER=<name> in .env.local / Vercel env vars
// Nothing in the checkout flow or API routes needs to change.

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER;

  switch (provider) {
    // case "stripe":
    //   return new StripeProvider();
    // case "nmi":
    //   return new NmiProvider();
    // case "authorize_net":
    //   return new AuthorizeNetProvider();
    default:
      return new NotConfiguredProvider();
  }
}
