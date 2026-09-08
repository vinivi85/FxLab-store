import { createClient } from "@/lib/supabase/server";

export type { Category, Product, ProductMetadata } from "@/lib/catalog-types";
export { formatCents, discountPercent } from "@/lib/catalog-types";

import type { Category, Product } from "@/lib/catalog-types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getCategories error", error);
    return [];
  }
  return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug, description, sort_order)")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) {
    console.error("getProducts error", error);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug, description, sort_order)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) {
    console.error("getProductBySlug error", error);
    return null;
  }
  return data;
}
