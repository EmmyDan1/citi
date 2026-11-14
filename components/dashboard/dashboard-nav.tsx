import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav
      className="flex gap-6 overflow-x-auto border-b border-white/10 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Banking navigation"
    >
      <Link
        href="/"
        className="shrink-0 border-b-2 border-white pb-2 text-sm font-semibold text-white"
      >
        My Banking
      </Link>

      <Link
        href="/accounts"
        className="shrink-0 border-b-2 border-transparent pb-2 text-sm text-white/65 transition-colors hover:border-white/40 hover:text-white"
      >
        Accounts
      </Link>

      <Link
        href="/transfers"
        className="shrink-0 border-b-2 border-transparent pb-2 text-sm text-white/65 transition-colors hover:border-white/40 hover:text-white"
      >
        Payments
      </Link>

      <Link
        href="/transactions"
        className="shrink-0 border-b-2 border-transparent pb-2 text-sm text-white/65 transition-colors hover:border-white/40 hover:text-white"
      >
        Activity
      </Link>

      <Link
        href="/profile"
        className="shrink-0 border-b-2 border-transparent pb-2 text-sm text-white/65 transition-colors hover:border-white/40 hover:text-white"
      >
        Services
      </Link>
    </nav>
  );
}