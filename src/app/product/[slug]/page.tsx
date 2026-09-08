import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StrengthSelector from "@/components/StrengthSelector";
import { formatCents, getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = product.image_urls?.[0];
  const strengths = product.metadata?.strengths;

  return (
    <>
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl bg-silver-100">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium uppercase tracking-widest text-navy-400">
                Photo coming soon
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
              {product.categories?.name ?? "Peptides"}
              {product.metadata?.code ? ` · Code ${product.metadata.code}` : ""}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-navy-950">{product.name}</h1>
            {product.short_description && (
              <p className="mt-3 text-navy-800/70">{product.short_description}</p>
            )}

            <div className="mt-6">
              {strengths?.length ? (
                <StrengthSelector strengths={strengths} fallbackPrice={product.price_cents} />
              ) : (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-navy-950">
                      {formatCents(product.price_cents)}
                    </span>
                    {product.compare_at_price_cents && (
                      <span className="text-navy-500 line-through">
                        {formatCents(product.compare_at_price_cents)}
                      </span>
                    )}
                  </div>
                  <button
                    disabled={product.stock_quantity <= 0}
                    className="mt-6 w-full rounded-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-300"
                  >
                    {product.stock_quantity > 0 ? "Add to cart" : "Out of stock"}
                  </button>
                </>
              )}
            </div>

            {product.description && (
              <div className="mt-10 border-t border-navy-800/10 pt-6">
                <h2 className="mb-2 font-semibold text-navy-950">Description</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-navy-800/70">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-8 rounded-xl bg-navy-100 px-4 py-3 text-xs text-navy-800/70">
              For laboratory research use only. Not for human or veterinary use.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
