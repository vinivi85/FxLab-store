import type { PaymentProvider } from "./types";
import { notConfiguredProvider } from "./providers/not-configured";

export function getActiveProvider(): PaymentProvider {
  const configured = process.env.PAYMENT_PROVIDER;
  // Plug real providers (stripe, nmi, authorize_net) here as they're implemented.
  if (!configured) return notConfiguredProvider;
  return notConfiguredProvider;
}
