import Link from "next/link";

const BADGES = [
  "Lot-specific documentation",
  "Third-party purity data on file",
  "Same-day dispatch, tracked",
];

export function Hero() {
  return (
    <section className="border-b border-graphite-900/10 bg-graphite-950 text-porcelain-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <p className="text-sm font-medium text-amber-400">Research-use-only · US catalog</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            A peptide inventory built to be checked, not just trusted.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-porcelain-100/75">
            155 catalogued compounds, organized by research area — with the spec, unit count, and lot
            handling researchers actually need before they order.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-graphite-950 hover:bg-amber-400"
            >
              Browse the catalog
            </Link>
            <Link
              href="/shop#rewards"
              className="rounded-full border border-porcelain-50/30 px-6 py-3 text-sm font-semibold text-porcelain-50 hover:border-amber-400 hover:text-amber-400"
            >
              How rewards work
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-porcelain-50/10 pt-6 text-sm">
            {BADGES.map((b) => (
              <div key={b} className="text-porcelain-100/70">
                {b}
              </div>
            ))}
          </dl>
        </div>

        {/* Inventory-card visual — an original data-sheet motif, not a product photo */}
        <div className="self-center rounded-2xl border border-porcelain-50/10 bg-graphite-900 p-6 font-mono text-xs text-porcelain-100/80 shadow-2xl">
          <div className="flex items-center justify-between border-b border-porcelain-50/10 pb-3">
            <span className="text-amber-400">LOT RECORD</span>
            <span>FX-2026-0417</span>
          </div>
          <dl className="mt-4 space-y-3">
            <Row k="Compound" v="BPC-157" />
            <Row k="Spec" v="5mg · 10 vials/box" />
            <Row k="Category" v="Regenerative & Repair" />
            <Row k="Unit price" v="calculated per vial" />
            <Row k="Disclaimer" v="RUO — lab use only" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-porcelain-100/50">{k}</dt>
      <dd className="text-right text-porcelain-50">{v}</dd>
    </div>
  );
}
