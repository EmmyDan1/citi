import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { CitibankLogo } from "../../components/brand/citibank-logo";

export default function DashboardHeader({
  firstName,
}: {
  firstName: string;
}) {
  return (
    <header className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/"
          className="flex items-center"
          aria-label="Citibank home"
        >
          <CitibankLogo
            width={110}
            height={36}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <nav
        className="hidden items-center gap-1 lg:flex"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="rounded-lg bg-white/12 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
        >
          Banking
        </Link>

        <Link
          href="/accounts"
          className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Accounts
        </Link>

        <Link
          href="/transfers"
          className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Transfers
        </Link>

        <Link
          href="/transactions"
          className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Transactions
        </Link>
      </nav>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:flex"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <Link
          href="/profile"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white transition-colors hover:bg-white/15"
          aria-label="Open profile"
        >
          {firstName.slice(0, 1).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}