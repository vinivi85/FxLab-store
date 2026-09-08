export function Footer() {
  return (
    <footer className="mt-auto border-t border-graphite-900/10 bg-graphite-950 text-porcelain-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-porcelain-50">FXLabs</p>
            <p className="mt-3 max-w-xs text-sm text-porcelain-100/70">
              Reference-grade research compounds, documented lot by lot. For laboratory research use only.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-porcelain-50">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-porcelain-100/70">
              <li>Catalog</li>
              <li>Rewards</li>
              <li>Bulk orders</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-porcelain-50">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-porcelain-100/70">
              <li>About</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-porcelain-50">Research use only</p>
            <p className="mt-3 text-sm text-porcelain-100/70">
              Not for human or animal consumption, ingestion, or injection.
            </p>
          </div>
        </div>
        <p className="mt-10 max-w-4xl text-xs leading-relaxed text-porcelain-100/50">
          FOR RESEARCH USE ONLY. Products offered on this site are intended solely for in-vitro laboratory
          research and development. These statements have not been evaluated by the FDA. These products are not
          drugs, foods, dietary supplements, or cosmetics, and are not intended to diagnose, treat, cure, or
          prevent any disease. By purchasing from FXLabs you confirm you are a qualified researcher or
          institution and will handle, store, and dispose of materials in accordance with applicable laws and
          institutional safety protocols.
        </p>
        <p className="mt-6 text-xs text-porcelain-100/40">© {new Date().getFullYear()} FXLabs. All rights reserved.</p>
      </div>
    </footer>
  );
}
