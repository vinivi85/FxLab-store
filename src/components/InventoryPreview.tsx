import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatUsd(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export async function InventoryPreview() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, short_description, price_cents, categories(name)")
    .eq("is_active", true)
    .order("name")
    .limit(8);

  if (!products || products.length === 0) return null;

  return (
    <section className="border-y border-graphite-900/10 bg-porcelain-100">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-ink-900 md:text-3xl">
          Sample of the inventory
        </h2>
        <p className="mt-2 max-w-xl text-graphite-700">
          Sold as single vials, not full boxes — every line below is what one unit costs.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-graphite-900/10 bg-porcelain-50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-graphite-900/10 text-xs uppercase tracking-wide text-graphite-700/70">
                <th className="px-5 py-3 font-medium">Compound</th>
                <th className="px-5 py-3 font-medium">Spec</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
                <th className="px-5 py-3 text-right font-medium">Unit price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
                return (
                  <tr key={p.id} className="border-b border-graphite-900/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink-900">{p.name}</td>
                    <td className="px-5 py-3 text-graphite-700">{p.short_description}</td>
                    <td className="hidden px-5 py-3 text-graphite-700 sm:table-cell">
                      {category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-ink-900">
                      {formatUsd(p.price_cents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Link
          href="/shop"
          className="mt-6 inline-block text-sm font-medium text-amber-600 hover:text-amber-500"
        >
          See the full 155-compound catalog →
        </Link>
      </div>
    </section>
  );
}
