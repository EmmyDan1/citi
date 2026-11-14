import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Landmark,
  PiggyBank,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AccountsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts } = user
    ? await supabase
        .from("accounts")
        .select(
          "id, name, type, account_number, balance, available_balance"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const maskAccountNumber = (accountNumber: string) =>
    `•••• ${accountNumber.slice(-4)}`;

  const getIcon = (type: string) => {
    if (type === "savings") {
      return PiggyBank;
    }

    if (type === "credit_card") {
      return CreditCard;
    }

    return Landmark;
  };

  const totalBalance =
    accounts?.reduce(
      (total, account) => total + Number(account.balance),
      0
    ) ?? 0;

  const totalAvailable =
    accounts?.reduce(
      (total, account) => total + Number(account.available_balance),
      0
    ) ?? 0;

  return (
    <main className="min-h-screen bg-northstar-background text-northstar-text">
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <header className="py-6 sm:py-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-northstar-text-muted transition-colors hover:text-northstar-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-northstar-text-muted">
            Banking
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-northstar-text sm:text-3xl">
            Accounts
          </h1>

          <p className="mt-1.5 text-sm text-northstar-text-muted">
            View your balances and account details.
          </p>
        </header>

        <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-northstar-deep-blue via-northstar-blue to-northstar-bright-blue text-white shadow-[0_18px_40px_-20px_rgba(3,43,85,0.55)]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Total balance
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {formatCurrency(totalBalance)}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <Landmark className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-4">
              <p className="text-xs text-blue-100">
                Available to use
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {formatCurrency(totalAvailable)}
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-northstar-text">
                All accounts
              </h2>

              <p className="mt-0.5 text-xs text-northstar-text-muted">
                Your connected banking accounts
              </p>
            </div>

            <span className="shrink-0 text-xs font-medium text-northstar-text-muted">
              {accounts?.length ?? 0}{" "}
              {accounts?.length === 1 ? "account" : "accounts"}
            </span>
          </div>

          <Card className="rounded-2xl border-northstar-border bg-white shadow-sm">
            <CardContent className="p-0">
              {accounts && accounts.length > 0 ? (
                accounts.map((account, index) => {
                  const Icon = getIcon(account.type);

                  return (
                    <div key={account.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-5 text-left transition-colors hover:bg-northstar-surface-muted active:bg-northstar-soft-blue/60 sm:px-5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-northstar-soft-blue">
                          <Icon className="h-5 w-5 text-northstar-blue" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-northstar-text">
                            {account.name}
                          </p>

                          <p className="mt-1 text-xs text-northstar-text-muted">
                            {maskAccountNumber(account.account_number)}
                          </p>

                          <p className="mt-2 text-xs text-northstar-text-subtle">
                            Available{" "}
                            {formatCurrency(
                              Number(account.available_balance)
                            )}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-northstar-text">
                            {formatCurrency(Number(account.balance))}
                          </p>

                          <ChevronRight className="ml-auto mt-2 h-4 w-4 text-northstar-text-subtle" />
                        </div>
                      </button>

                      {index < accounts.length - 1 && (
                        <div className="mx-4 border-t border-northstar-border sm:mx-5" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-northstar-text">
                    No accounts found
                  </p>

                  <p className="mt-1 text-xs text-northstar-text-muted">
                    Your accounts will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}