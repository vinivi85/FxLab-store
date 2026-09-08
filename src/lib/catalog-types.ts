export type ProductMetadata = {
  code?: string; // e.g. "RT-30"
  strengths?: { label: string; price_cents: number; compare_at_price_cents?: number }[];
  form?: string; // "lyophilized" | "liquid"
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  sku: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  is_active: boolean;
  image_urls: string[];
  metadata: ProductMetadata;
  categories?: Category | null;
};

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function discountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
