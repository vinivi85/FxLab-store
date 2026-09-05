import { PaymentProvider, ChargeRequest, ChargeResult, RefundRequest, RefundResult } from "../types";

// Placeholder used while no real gateway (Stripe, NMI, Authorize.net, etc.)
// has been configured yet. Keeps checkout UI functional in dev/test without
// crashing, and makes the "not configured" state explicit and loud.
export class NotConfiguredProvider implements PaymentProvider {
  name = "not_configured";

  async charge(_req: ChargeRequest): Promise<ChargeResult> {
    return {
      success: false,
      errorMessage:
        "No payment gateway is configured yet. Set PAYMENT_PROVIDER in env and implement it in provider-registry.ts.",
    };
  }

  async refund(_req: RefundRequest): Promise<RefundResult> {
    return {
      success: false,
      errorMessage: "No payment gateway is configured yet.",
    };
  }
}
