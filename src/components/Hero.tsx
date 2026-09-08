import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--color-navy-500) 0%, transparent 45%), radial-gradient(circle at 80% 0%, var(--color-navy-600) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <span className="mb-5 inline-block rounded-full border border-navy-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
          Research use only · not for human consumption
        </span>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-paper sm:text-5xl">
          Research peptides, verified to the batch.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-navy-300">
          99%+ purity, HPLC + mass spec verified, with a Certificate of Analysis on every lot.
          Built for labs that need consistency they can put a number on.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-navy-100"
          >
            Browse catalog
          </Link>
          <Link
            href="/coa"
            className="rounded-full border border-navy-600 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-navy-900"
          >
            View certificates
          </Link>
        </div>

        <dl className="mt-14 grid max-w-xl grid-cols-2 gap-8 sm:grid-cols-3">
          <Stat value="99%+" label="Purity, every batch" />
          <Stat value="HPLC" label="+ Mass Spec verified" />
          <Stat value="1:1" label="COA per lot" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-2xl font-bold text-paper">{value}</dt>
      <dd className="text-sm text-navy-400">{label}</dd>
    </div>
  );
}
