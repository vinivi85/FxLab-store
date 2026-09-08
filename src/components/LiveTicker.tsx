import Link from "next/link";
import { formatCents, type Product } from "@/lib/catalog-types";

export default function LiveTicker({ products }: { products: Product[] }) {
  if (!products.length) return null;
  const loop = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-navy-800/10 bg-navy-950 text-paper">
      <div className="flex items-center gap-3 py-2 pl-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy-300">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-500" />
          Live
        </span>
      </div>
      <div className="flex w-max ticker-track">
        {loop.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/product/${p.slug}`}
            className="flex shrink-0 items-center gap-2 border-r border-navy-800/40 px-5 py-2 text-sm hover:bg-navy-900"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-navy-400">{formatCents(p.price_cents)}</span>
            {p.compare_at_price_cents && (
              <span className="text-navy-500 line-through">
                {formatCents(p.compare_at_price_cents)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
