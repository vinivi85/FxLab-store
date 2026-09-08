import Link from "next/link";
import { discountPercent, formatCents, type Product } from "@/lib/catalog-types";

export default function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product.price_cents, product.compare_at_price_cents);
  const strengths = product.metadata?.strengths;
  const inStock = product.stock_quantity > 0;
  const image = product.image_urls?.[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800/10 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-900/5">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-silver-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-widest text-navy-400">
            Photo coming soon
          </div>
        )}
        {pct && (
          <span className="absolute left-3 top-3 rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-bold text-paper">
            {pct}% OFF
          </span>
        )}
        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-navy-500/90 px-2.5 py-1 text-[11px] font-semibold text-paper">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500">
          {product.categories?.name ?? "Peptides"}
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-navy-950 group-hover:text-navy-700">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="line-clamp-2 text-sm text-navy-800/70">{product.short_description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-navy-950">
              {strengths?.length
                ? `${formatCents(strengths[0].price_cents)}+`
                : formatCents(product.price_cents)}
            </span>
            {product.compare_at_price_cents && !strengths?.length && (
              <span className="text-sm text-navy-500 line-through">
                {formatCents(product.compare_at_price_cents)}
              </span>
            )}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full border border-navy-900 px-3 py-1.5 text-xs font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-paper"
          >
            {strengths?.length ? "Select" : inStock ? "Add" : "View"}
          </Link>
        </div>
      </div>
    </div>
  );
}
