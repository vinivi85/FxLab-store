import type { PaymentProvider } from "../types";

export const notConfiguredProvider: PaymentProvider = {
  id: "not_configured",
  async charge() {
    return {
      success: false,
      error:
        "No payment gateway is configured yet. Set PAYMENT_PROVIDER in .env.local once a high-risk-friendly processor is chosen.",
    };
  },
};
