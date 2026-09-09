"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/admin-utils";

type Category = { id: string; name: string };

export default function AddProductForm({
  categories,
  onCreated,
}: {
  categories: Category[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [boxCost, setBoxCost] = useState("");
  const [unitsPerBox, setUnitsPerBox] = useState("10");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [shortDescription, setShortDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setCategoryId("");
    setBoxCost("");
    setUnitsPerBox("10");
    setSellPrice("");
    setStock("0");
    setShortDescription("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    const supabase = createClient();
    const slug = slugify(name) + "-" + Math.random().toString(36).slice(2, 6);
    const boxCostNum = boxCost ? parseFloat(boxCost) : undefined;
    const unitsNum = unitsPerBox ? parseInt(unitsPerBox, 10) : undefined;
    const priceCents = sellPrice
      ? Math.round(parseFloat(sellPrice) * 100)
      : boxCostNum && unitsNum
      ? Math.round((boxCostNum / unitsNum) * 100)
      : 0;

    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: name.trim(),
      slug,
      category_id: categoryId || null,
      short_description: shortDescription || null,
      price_cents: priceCents,
      stock_quantity: stock ? parseInt(stock, 10) : 0,
      is_active: true,
      metadata: {
        box_cost_usd: boxCostNum,
        units_per_box: unitsNum,
        box_spec: boxCostNum && unitsNum ? `box of ${unitsNum}` : undefined,
      },
    });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    reset();
    setOpen(false);
    onCreated();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-paper hover:bg-navy-800"
      >
        + Add product
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-navy-800/15 bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-navy-950">Add product</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-navy-800/50 hover:text-navy-800"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
            placeholder="e.g. Semaglutide 10mg"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Box price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={boxCost}
            onChange={(e) => setBoxCost(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Units / box
          </label>
          <input
            type="number"
            step="1"
            value={unitsPerBox}
            onChange={(e) => setUnitsPerBox(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Selling price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="auto from box price if empty"
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Stock (vials)
          </label>
          <input
            type="number"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-800/60">
            Short description
          </label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full rounded-lg border border-navy-800/20 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-paper hover:bg-navy-800 disabled:opacity-50"
      >
        {saving ? "Creating…" : "Create product"}
      </button>
    </form>
  );
}
