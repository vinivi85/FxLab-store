import Header from "@/components/Header";
import LiveTicker from "@/components/LiveTicker";
import Footer from "@/components/Footer";
import CatalogGrid from "@/components/CatalogGrid";
import { getCategories, getProducts } from "@/lib/products";
import Link from "next/link";

export const metadata = {
  title: "Shop All Research Peptides & Compounds | FXlabs",
  description:
    "Browse the full FXlabs catalog: research peptides, blends and lab supplies, all 99%+ pure and third-party COA-tested. Research use only.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const avgDiscount = products.length
    ? Math.round(
        products.reduce((sum, p) => {
          if (!p.compare_at_price_cents) return sum;
          return (
            sum + ((p.compare_at_price_cents - p.price_cents) / p.compare_at_price_cents) * 100
          );
        }, 0) / products.filter((p) => p.compare_at_price_cents).length || 0
      )
    : 0;

  return (
    <>
      <Header />
      <LiveTicker products={products} />

      <section className="border-b border-navy-800/10 bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h1 className="text-3xl font-bold text-paper sm:text-4xl">Catalog</h1>
          <p className="mt-2 max-w-2xl text-navy-300">
            99%+ purity, HPLC + Mass Spec verified, CoA per batch. Every card shows current
            pricing and available strengths at a glance.
          </p>
          <dl className="mt-8 flex flex-wrap gap-10">
            <div>
              <dt className="text-2xl font-bold text-paper">{products.length}</dt>
              <dd className="text-sm text-navy-400">catalog SKUs</dd>
            </div>
            {avgDiscount > 0 && (
              <div>
                <dt className="text-2xl font-bold text-paper">{avgDiscount}%</dt>
                <dd className="text-sm text-navy-400">avg. below list price</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <CatalogGrid products={products} categories={categories} />
      </section>

      <section className="border-y border-navy-800/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h2 className="text-xl font-bold text-navy-950">
            Ordering for a lab? Volume pricing kicks in at 10+ vials.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-navy-800/70">
            Per-vial cost drops further at volume. Send a quote request with your compound list
            and target quantities.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-paper hover:bg-navy-800"
          >
            Request a volume quote →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
