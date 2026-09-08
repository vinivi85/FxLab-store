export type PaymentProviderId = "stripe" | "nmi" | "authorize_net";

export type ChargeRequest = {
  amountCents: number;
  currency: string;
  orderId: string;
  metadata?: Record<string, string>;
};

export type ChargeResult = {
  success: boolean;
  reference?: string;
  error?: string;
};

export interface PaymentProvider {
  id: PaymentProviderId | "not_configured";
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
