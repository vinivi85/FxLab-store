import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveTicker from "@/components/LiveTicker";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      <Header />
      <LiveTicker products={products} />
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Popular right now</h2>
            <p className="mt-1 text-navy-800/60">Best sellers across the full catalog.</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-navy-700 hover:text-navy-500"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {featured.length === 0 && (
          <div className="rounded-2xl border border-dashed border-navy-800/20 py-16 text-center text-navy-800/60">
            Catalog syncing — check back shortly, or configure Supabase env vars.
          </div>
        )}
      </section>

      <section className="border-y border-navy-800/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3">
          <Promise
            title="COA on every batch"
            body="Third-party HPLC + mass spec testing, published for every lot we ship."
          />
          <Promise
            title="Cold-chain shipping"
            body="Insulated, tracked, and shipped fast so potency holds from lab to lab."
          />
          <Promise
            title="Research use only"
            body="Every product is sold strictly for laboratory research — not for human use."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

function Promise({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-navy-950">{title}</h3>
      <p className="text-sm text-navy-800/70">{body}</p>
    </div>
  );
}
