import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className="flex gap-6 overflow-x-auto border-b border-white/10 py-3 scrollbar-none">
      <Link
        href="/"
        className="shrink-0 border-b-2 border-white pb-2 text-sm font-semibold text-white"
      >
        My Banking
      </Link>

      <Link
        href="/accounts"
        className="shrink-0 pb-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        Accounts
      </Link>

      <Link
        href="/transfers"
        className="shrink-0 pb-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        Payments
      </Link>

      <Link
        href="/transactions"
        className="shrink-0 pb-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        Activity
      </Link>

      <Link
        href="/profile"
        className="shrink-0 pb-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        Services
      </Link>
    </nav>
  );
}