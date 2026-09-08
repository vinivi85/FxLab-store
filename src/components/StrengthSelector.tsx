"use client";

import { useState } from "react";
import { formatCents, type ProductMetadata } from "@/lib/catalog-types";

export default function StrengthSelector({
  strengths,
  fallbackPrice,
}: {
  strengths: NonNullable<ProductMetadata["strengths"]>;
  fallbackPrice: number;
}) {
  const [selected, setSelected] = useState(0);
  const current = strengths[selected] ?? { label: "", price_cents: fallbackPrice };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {strengths.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setSelected(i)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              i === selected
                ? "border-navy-900 bg-navy-900 text-paper"
                : "border-navy-800/20 text-navy-900 hover:border-navy-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-navy-950">
          {formatCents(current.price_cents)}
        </span>
        {current.compare_at_price_cents && (
          <span className="text-navy-500 line-through">
            {formatCents(current.compare_at_price_cents)}
          </span>
        )}
      </div>
      <button className="mt-6 w-full rounded-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-navy-800">
        Add to cart
      </button>
    </div>
  );
}
