const STEPS = [
  { step: "Spend", detail: "Every order earns 1 point per $10 spent, credited automatically once paid." },
  { step: "Accumulate", detail: "Points sit in your account with no expiration pressure — no purchase required to keep them." },
  { step: "Redeem", detail: "Once you hit the minimum balance, apply points as credit toward any order at checkout." },
];

export function RewardsSection() {
  return (
    <section id="rewards" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-sm font-medium text-amber-600">FXLabs Rewards</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 md:text-3xl">
            Credit that builds while you order — no separate purchase needed.
          </h2>
          <p className="mt-4 text-graphite-700">
            Unlike a prepaid points package, FXLabs rewards accrue from what you already spend. No extra
            step, no bonus tier to buy into — just credit toward your next order.
          </p>
        </div>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li
              key={s.step}
              className="flex gap-4 rounded-xl border border-graphite-900/10 bg-porcelain-100 p-5"
            >
              <span className="font-display text-lg font-semibold text-amber-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-ink-900">{s.step}</p>
                <p className="mt-1 text-sm text-graphite-700">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
