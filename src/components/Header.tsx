import Link from "next/link";

const NAV = [
  { href: "/shop", label: "Catalog" },
  { href: "/shop#rewards", label: "Rewards" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-900/10 bg-porcelain-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink-900">
          FXLabs
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-graphite-700 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-amber-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/shop"
          className="rounded-full bg-graphite-900 px-4 py-2 text-sm font-medium text-porcelain-50 hover:bg-amber-600"
        >
          Browse catalog
        </Link>
      </div>
    </header>
  );
}
