import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

function formatUsd(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeSlug } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  let query = supabase
    .from("products")
    .select("id, name, slug, sku, short_description, price_cents, categories(name, slug)")
    .eq("is_active", true)
    .order("name");

  if (activeSlug) {
    const cat = categories?.find((c) => c.slug === activeSlug);
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data: products } = await query;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-medium text-amber-600">Full catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 md:text-4xl">
          {products?.length ?? 0} research compounds, sold by the unit
        </h1>
        <p className="mt-3 max-w-2xl text-graphite-700">
          Prices shown are the current per-vial cost basis and will be updated with final pricing and product
          photos.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterPill href="/shop" active={!activeSlug} label="All" />
          {categories?.map((c) => (
            <FilterPill key={c.id} href={`/shop?category=${c.slug}`} active={activeSlug === c.slug} label={c.name} />
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-graphite-900/10 bg-porcelain-50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-graphite-900/10 bg-porcelain-100 text-xs uppercase tracking-wide text-graphite-700/70">
                <th className="px-5 py-3 font-medium">Compound</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Spec</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Category</th>
                <th className="px-5 py-3 text-right font-medium">Unit price</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => {
                const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
                return (
                  <tr key={p.id} className="border-b border-graphite-900/5 last:border-0 hover:bg-porcelain-100/60">
                    <td className="px-5 py-3 font-medium text-ink-900">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-graphite-700">{p.sku}</td>
                    <td className="hidden px-5 py-3 text-graphite-700 sm:table-cell">{p.short_description}</td>
                    <td className="hidden px-5 py-3 text-graphite-700 md:table-cell">{cat?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-medium text-ink-900">{formatUsd(p.price_cents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-graphite-900 bg-graphite-900 text-porcelain-50"
          : "border-graphite-900/15 text-graphite-700 hover:border-amber-500 hover:text-amber-600"
      }`}
    >
      {label}
    </Link>
  );
}
