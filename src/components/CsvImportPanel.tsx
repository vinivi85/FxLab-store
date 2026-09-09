"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { parseCsv, slugify } from "@/lib/admin-utils";

type ExistingProduct = {
  id: string;
  name: string;
  slug: string;
  metadata: Record<string, unknown>;
};

type ImportResult = {
  updated: string[];
  unmatched: string[];
};

export default function CsvImportPanel({
  products,
  onImported,
}: {
  products: ExistingProduct[];
  onImported: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function findMatch(nameOrSlug: string): ExistingProduct | undefined {
    const bySlug = products.find((p) => p.slug === nameOrSlug);
    if (bySlug) return bySlug;
    const targetSlug = slugify(nameOrSlug);
    const bySlugified = products.find((p) => p.slug === targetSlug);
    if (bySlugified) return bySlugified;
    const byName = products.find(
      (p) => p.name.trim().toLowerCase() === nameOrSlug.trim().toLowerCase()
    );
    return byName;
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) {
      setError("Couldn't find any rows in that file.");
      return;
    }

    const nameKey = ["name", "product", "slug"].find((k) =>
      Object.keys(rows[0]).includes(k)
    );
    const boxPriceKey = ["box_price", "box price", "boxprice", "price"].find((k) =>
      Object.keys(rows[0]).includes(k)
    );
    const unitsKey = ["units_per_box", "units", "units per box", "qty"].find((k) =>
      Object.keys(rows[0]).includes(k)
    );

    if (!nameKey || !boxPriceKey) {
      setError(
        `CSV needs a "name" (or "slug") column and a "box_price" column. Found columns: ${Object.keys(
          rows[0]
        ).join(", ")}`
      );
      return;
    }

    setImporting(true);
    const supabase = createClient();
    const updated: string[] = [];
    const unmatched: string[] = [];

    for (const row of rows) {
      const identifier = row[nameKey];
      const boxPriceRaw = row[boxPriceKey];
      if (!identifier || !boxPriceRaw) continue;

      const boxPrice = parseFloat(boxPriceRaw.replace(/[^0-9.]/g, ""));
      if (isNaN(boxPrice)) continue;

      const match = findMatch(identifier);
      if (!match) {
        unmatched.push(identifier);
        continue;
      }

      const unitsFromCsv = unitsKey && row[unitsKey] ? parseInt(row[unitsKey], 10) : undefined;
      const existingUnits = (match.metadata?.units_per_box as number | undefined) ?? 10;
      const newMetadata = {
        ...match.metadata,
        box_cost_usd: boxPrice,
        units_per_box: unitsFromCsv || existingUnits,
      };

      const { error: updateError } = await supabase
        .from("products")
        .update({ metadata: newMetadata })
        .eq("id", match.id);

      if (updateError) {
        unmatched.push(`${identifier} (save failed: ${updateError.message})`);
      } else {
        updated.push(match.name);
      }
    }

    setImporting(false);
    setResult({ updated, unmatched });
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (updated.length > 0) onImported();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 ml-3 rounded-full border border-navy-800/20 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-100"
      >
        Import supplier prices (CSV)
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-navy-800/15 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-navy-950">Import supplier box prices</h2>
        <button
          onClick={() => {
            setOpen(false);
            setResult(null);
            setError(null);
          }}
          className="text-sm text-navy-800/50 hover:text-navy-800"
        >
          Close
        </button>
      </div>

      <p className="mb-3 text-sm text-navy-800/60">
        CSV with columns <code className="rounded bg-navy-100 px-1">name</code> (matches
        against existing product names/slugs) and{" "}
        <code className="rounded bg-navy-100 px-1">box_price</code> — optionally{" "}
        <code className="rounded bg-navy-100 px-1">units_per_box</code>. This updates the box
        price on matching products only; it does not create new ones.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="mb-3 text-sm"
      />

      {importing && <p className="text-sm text-navy-800/60">Importing…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 space-y-2 text-sm">
          <p className="font-medium text-emerald-700">
            ✓ Updated {result.updated.length} product{result.updated.length === 1 ? "" : "s"}
          </p>
          {result.unmatched.length > 0 && (
            <div>
              <p className="font-medium text-red-600">
                Couldn&apos;t match {result.unmatched.length}:
              </p>
              <ul className="ml-4 list-disc text-navy-800/70">
                {result.unmatched.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
