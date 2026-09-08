import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function CategoryGrid() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, products(count)")
    .order("sort_order");

  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink-900 md:text-3xl">
          Find your research area
        </h2>
        <Link href="/shop" className="text-sm font-medium text-amber-600 hover:text-amber-500">
          View all →
        </Link>
      </div>
      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-graphite-900/10 bg-graphite-900/10 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const count = Array.isArray(c.products) ? c.products[0]?.count ?? 0 : 0;
          return (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex flex-col justify-between bg-porcelain-50 p-6 transition-colors hover:bg-graphite-900"
            >
              <div>
                <p className="font-display text-lg font-semibold text-ink-900 group-hover:text-porcelain-50">
                  {c.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-graphite-700 group-hover:text-porcelain-100/70">
                  {c.description}
                </p>
              </div>
              <p className="mt-6 text-sm font-medium text-amber-600 group-hover:text-amber-400">
                {count} compound{count === 1 ? "" : "s"} →
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
