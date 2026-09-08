"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/catalog-types";

export default function CatalogGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("name");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categories?.slug === activeCategory);
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "price-desc") sorted.sort((a, b) => b.price_cents - a.price_cents);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, activeCategory, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-navy-800/10 pb-6">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
            />
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-navy-800/20 bg-white px-4 py-2 text-sm font-medium text-navy-900"
        >
          <option value="name">Name A–Z</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="mb-6 text-sm text-navy-800/60">
        <span className="font-semibold text-navy-950">{filtered.length}</span> catalog SKUs
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-navy-800/20 py-16 text-center text-navy-800/60">
          No products in this category yet.
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-navy-900 text-paper"
          : "bg-white text-navy-800 hover:bg-navy-100 border border-navy-800/15"
      }`}
    >
      {label}
    </button>
  );
}
