import Link from "next/link";

const NAV_LINKS = [
  { href: "/shop", label: "Catalog" },
  { href: "/coa", label: "Certificates" },
  { href: "/promise", label: "FXlabs Promise" },
  { href: "/rewards", label: "Rewards" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-1.5 shrink-0">
          <span className="text-2xl font-bold tracking-tight text-navy-900">
            FX<span className="font-light">labs</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-navy-500">
            peptides
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-navy-800 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-navy-500">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className="hidden text-sm font-medium text-navy-800 hover:text-navy-500 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-paper transition hover:bg-navy-800"
          >
            Cart
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-500 text-xs">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
