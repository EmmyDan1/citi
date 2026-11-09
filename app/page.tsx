import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  Landmark,
  Menu,
  Search,
  Settings,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type Account = {
  id: string;
  name: string;
  type: string;
  account_number: string;
  balance: number;
  available_balance: number;
};

type Transaction = {
  id: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  transaction_date: string;
};

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("first_name, last_name, display_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: accounts } = user
    ? await supabase
        .from("accounts")
        .select(
          "id, name, type, account_number, balance, available_balance"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const { data: transactions } = user
    ? await supabase
        .from("transactions")
        .select(
          "id, description, type, amount, status, transaction_date"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .limit(5)
    : { data: [] };

  const accountList = (accounts ?? []) as Account[];
  const transactionList = (transactions ?? []) as Transaction[];

  const firstName =
    profile?.first_name ||
    profile?.display_name?.split(" ")[0] ||
    "Customer";

  const checkingAccounts = accountList.filter(
    (account) => account.type === "checking"
  );

  const savingsAccounts = accountList.filter(
    (account) => account.type === "savings"
  );

  const otherAccounts = accountList.filter(
    (account) =>
      account.type !== "checking" && account.type !== "savings"
  );

  const totalAvailable = accountList.reduce(
    (total, account) => total + Number(account.available_balance),
    0
  );

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  function formatAccountNumber(value: string) {
    return `•••• ${value.slice(-4)}`;
  }

  function formatTransactionDate(value: string) {
    const date = new Date(value);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function isCredit(transaction: Transaction) {
    return (
      transaction.type === "deposit" ||
      transaction.type === "credit" ||
      transaction.type === "refund"
    );
  }

  function getTransactionIcon(transaction: Transaction) {
    if (isCredit(transaction)) {
      return ArrowDownLeft;
    }

    if (transaction.type === "transfer") {
      return ArrowUpRight;
    }

    return CreditCard;
  }

  function getTransactionDescription(transaction: Transaction) {
    if (transaction.description) {
      return transaction.description;
    }

    if (transaction.type === "deposit") {
      return "Deposit";
    }

    if (transaction.type === "transfer") {
      return "Transfer";
    }

    return "Account transaction";
  }

  function AccountCard({ account }: { account: Account }) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#075eaa] via-[#07549b] to-[#063f78] shadow-[0_12px_35px_rgba(0,25,65,0.28)]">
        <div className="relative p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                {account.type === "savings" ? (
                  <WalletCards className="h-5 w-5 text-white" />
                ) : (
                  <Landmark className="h-5 w-5 text-white" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {account.name}
                </p>

                <p className="mt-0.5 text-xs text-white/65">
                  {formatAccountNumber(account.account_number)}
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-white/55" />
          </div>

          <div className="relative mt-8">
            <p className="text-xs text-white/65">Available now</p>

            <p className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {formatCurrency(Number(account.available_balance))}
            </p>
          </div>
        </div>

        <div className="flex border-t border-white/10 bg-black/10">
          <Link
            href={`/accounts/${account.id}`}
            className="flex flex-1 items-center justify-center border-r border-white/10 py-3 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            Details
          </Link>

          <Link
            href="/transfers/internal"
            className="flex flex-1 items-center justify-center py-3 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            Transfer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#061a32]">
      {/* Top banking shell */}
      <section className="bg-gradient-to-b from-[#063b70] via-[#064b8c] to-[#075da8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
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
                className="flex items-center gap-2 text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                  <Landmark className="h-4 w-4" />
                </div>

                <span className="text-base font-semibold tracking-tight">
                  Northstar
                </span>
              </Link>
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              <Link
                href="/"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white"
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
            </div>

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
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white"
              >
                {firstName.slice(0, 1).toUpperCase()}
              </Link>
            </div>
          </header>

          {/* Category navigation */}
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

          {/* Welcome */}
          <div className="pb-7 pt-7 sm:pb-9 sm:pt-9">
            <p className="text-sm text-white/65">Welcome</p>

            <div className="mt-1 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {firstName}
                </h1>

                <p className="mt-2 text-sm text-white/65">
                  Your banking at a glance.
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs text-white/60">
                  Total available
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {formatCurrency(totalAvailable)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#061a32]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Accounts */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                  Accounts
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Your money
                </h2>
              </div>

              <Link
                href="/accounts"
                className="flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-200"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {checkingAccounts.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                    Checking
                  </p>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {checkingAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
            )}

            {savingsAccounts.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                    Savings
                  </p>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {savingsAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
            )}

            {otherAccounts.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                    Other accounts
                  </p>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {otherAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-8">
            <div className="mb-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                Quick actions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link
                href="/transfers"
                className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]"
              >
                <ArrowUpRight className="h-5 w-5 text-blue-300" />

                <p className="mt-4 text-sm font-medium text-white">
                  Transfer
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Move money
                </p>
              </Link>

              <Link
                href="/transactions"
                className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]"
              >
                <ArrowDownLeft className="h-5 w-5 text-blue-300" />

                <p className="mt-4 text-sm font-medium text-white">
                  Activity
                </p>

                <p className="mt-1 text-xs text-white/45">
                  View transactions
                </p>
              </Link>

              <Link
                href="/accounts"
                className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]"
              >
                <WalletCards className="h-5 w-5 text-blue-300" />

                <p className="mt-4 text-sm font-medium text-white">
                  Accounts
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Manage accounts
                </p>
              </Link>

              <Link
                href="/profile"
                className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]"
              >
                <Settings className="h-5 w-5 text-blue-300" />

                <p className="mt-4 text-sm font-medium text-white">
                  Services
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Account settings
                </p>
              </Link>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  Recent activity
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Transactions
                </h2>
              </div>

              <Link
                href="/transactions"
                className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                See all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {transactionList.length > 0 ? (
              <div>
                {transactionList.map((transaction, index) => {
                  const Icon = getTransactionIcon(transaction);
                  const credit = isCredit(transaction);

                  return (
                    <Link
                      key={transaction.id}
                      href={`/transactions/${transaction.id}`}
                      className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6 ${
                        index !== transactionList.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          credit
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {getTransactionDescription(transaction)}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatTransactionDate(
                            transaction.transaction_date
                          )}
                          {" · "}
                          {transaction.status}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            credit
                              ? "text-emerald-600"
                              : "text-slate-900"
                          }`}
                        >
                          {credit ? "+" : "-"}
                          {formatCurrency(Number(transaction.amount))}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <Building2 className="mx-auto h-7 w-7 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-900">
                  No recent transactions
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your recent account activity will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061a32]/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-around">
              <BottomNavItem
                href="/"
                icon={Landmark}
                label="Accounts"
                active
              />

              <BottomNavItem
                href="/transfers"
                icon={ArrowUpRight}
                label="Payments"
              />

              <BottomNavItem
                href="/transactions"
                icon={WalletCards}
                label="Activity"
              />

              <BottomNavItem
                href="/profile"
                icon={Settings}
                label="Profile"
              />
            </div>
          </nav>

          <div className="h-20 lg:hidden" />
        </div>
      </section>
    </main>
  );
}

function BottomNavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: typeof Landmark;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] ${
        active
          ? "text-white"
          : "text-white/45 transition-colors hover:text-white/80"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}