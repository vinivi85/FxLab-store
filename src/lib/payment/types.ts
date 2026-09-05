// Payment gateway abstraction.
// Add a new provider by implementing this interface and registering it
// in provider-registry.ts — no changes needed to checkout flow itself.

export interface ChargeRequest {
  amountCents: number;
  currency: string; // e.g. 'usd'
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface ChargeResult {
  success: boolean;
  providerReference?: string; // transaction/charge id from the gateway
  errorMessage?: string;
  requiresAction?: boolean; // e.g. 3DS redirect needed
  actionUrl?: string;
}

export interface RefundRequest {
  providerReference: string;
  amountCents?: number; // omit for full refund
}

export interface RefundResult {
  success: boolean;
  errorMessage?: string;
}

export interface PaymentProvider {
  name: string; // 'stripe' | 'nmi' | 'authorize_net' | ...
  charge(req: ChargeRequest): Promise<ChargeResult>;
  refund(req: RefundRequest): Promise<RefundResult>;
}
