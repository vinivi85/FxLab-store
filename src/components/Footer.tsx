import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-navy-950 text-navy-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-paper">
            FX<span className="font-light">labs</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-navy-400">
            peptides
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <FooterColumn
            title="Shop"
            links={[
              ["Full catalog", "/shop"],
              ["FXlabs Promise", "/promise"],
              ["Wholesale", "/wholesale"],
              ["Cart", "/cart"],
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              ["Rewards", "/rewards"],
              ["Certificate archive", "/coa"],
              ["Quality process", "/quality"],
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              ["Contact us", "/contact"],
              ["FAQ", "/faq"],
              ["Shipping", "/shipping"],
              ["Returns", "/returns"],
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Research-use only", "/research-use-only"],
              ["FDA disclaimer", "/fda-disclaimer"],
            ]}
          />
        </div>

        <div className="mt-12 border-t border-navy-800 pt-8 text-xs leading-relaxed text-navy-400">
          <p className="mb-4">
            Statements made regarding these products have not been evaluated by the U.S. Food and
            Drug Administration. The efficacy of these products has not been confirmed by
            FDA-approved research. These products are not intended to diagnose, treat, cure, or
            prevent any disease. All products are sold strictly for laboratory research use only
            and are not intended for human or veterinary use. Information on this site is not a
            substitute for advice from a qualified healthcare practitioner.
          </p>
          <p>© {new Date().getFullYear()} FXlabs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-paper">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="transition hover:text-paper">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
