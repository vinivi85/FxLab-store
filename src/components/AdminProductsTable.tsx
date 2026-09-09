"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  is_active: boolean;
  metadata: { box_spec?: string };
};

export default function AdminProductsTable() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
        return;
      }
      setChecking(false);
      loadProducts();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, price_cents, compare_at_price_cents, stock_quantity, is_active, metadata")
      .order("name", { ascending: true });
    if (error) {
      setLoadError(error.message);
      return;
    }
    setProducts(data ?? []);
  }

  function updateLocal(id: string, patch: Partial<AdminProduct>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function saveRow(product: AdminProduct) {
    setSavingId(product.id);
    setSavedId(null);
    const { error } = await supabase
      .from("products")
      .update({
        price_cents: product.price_cents,
        compare_at_price_cents: product.compare_at_price_cents,
        stock_quantity: product.stock_quantity,
        is_active: product.is_active,
      })
      .eq("id", product.id);
    setSavingId(null);
    if (error) {
      alert("Failed to save: " + error.message);
      return;
    }
    setSavedId(product.id);
    setTimeout(() => setSavedId(null), 1500);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking) {
    return <div className="p-10 text-navy-800/60">Checking session…</div>;
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Product prices &amp; stock</h1>
          <p className="mt-1 text-sm text-navy-800/60">
            Prices are per vial (1 unit = 1 vial, not per box). Edit and hit Save on each row.
          </p>
        </div>
        <button
          onClick={signOut}
          className="rounded-full border border-navy-800/20 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-100"
        >
          Sign out
        </button>
      </div>

      {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}

      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-full border border-navy-800/20 px-4 py-2 text-sm"
      />

      <p className="mb-2 text-xs text-navy-800/50">{filtered.length} products</p>

      <div className="overflow-x-auto rounded-2xl border border-navy-800/10">
        <table className="w-full text-sm">
          <thead className="bg-navy-100 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price / vial ($)</th>
              <th className="px-4 py-3">Compare-at ($)</th>
              <th className="px-4 py-3">Stock (vials)</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-navy-800/10">
                <td className="px-4 py-2">
                  <div className="font-medium text-navy-950">{p.name}</div>
                  <div className="text-xs text-navy-800/50">
                    {p.metadata?.box_spec ?? p.slug}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={(p.price_cents / 100).toFixed(2)}
                    onChange={(e) =>
                      updateLocal(p.id, {
                        price_cents: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                    className="w-24 rounded-lg border border-navy-800/20 px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={
                      p.compare_at_price_cents != null
                        ? (p.compare_at_price_cents / 100).toFixed(2)
                        : ""
                    }
                    placeholder="—"
                    onChange={(e) =>
                      updateLocal(p.id, {
                        compare_at_price_cents: e.target.value
                          ? Math.round(parseFloat(e.target.value) * 100)
                          : null,
                      })
                    }
                    className="w-24 rounded-lg border border-navy-800/20 px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="1"
                    value={p.stock_quantity}
                    onChange={(e) =>
                      updateLocal(p.id, {
                        stock_quantity: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-20 rounded-lg border border-navy-800/20 px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={p.is_active}
                    onChange={(e) => updateLocal(p.id, { is_active: e.target.checked })}
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => saveRow(p)}
                    disabled={savingId === p.id}
                    className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-paper hover:bg-navy-800 disabled:opacity-50"
                  >
                    {savingId === p.id ? "Saving…" : savedId === p.id ? "Saved ✓" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
