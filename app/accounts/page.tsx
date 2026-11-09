import {
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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <p className="text-xs font-medium text-slate-500">
            Banking
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Accounts
          </h1>
        </header>

        <Card className="rounded-2xl border-0 bg-slate-950 text-white shadow-lg">
          <CardContent className="p-5">
            <p className="text-sm text-slate-400">
              Total balance
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {formatCurrency(totalBalance)}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Available to use
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatCurrency(totalAvailable)}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-2.5">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">
              All accounts
            </h2>

            <span className="text-xs text-slate-500">
              {accounts?.length ?? 0} accounts
            </span>
          </div>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              {accounts && accounts.length > 0 ? (
                accounts.map((account, index) => {
                  const Icon = getIcon(account.type);

                  return (
                    <div key={account.id}>
                      <button className="flex w-full items-center gap-3 px-4 py-5 text-left transition hover:bg-slate-50">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                          <Icon className="h-5 w-5 text-slate-700" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {account.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {maskAccountNumber(account.account_number)}
                          </p>

                          <p className="mt-2 text-xs text-slate-400">
                            Available{" "}
                            {formatCurrency(
                              Number(account.available_balance)
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatCurrency(Number(account.balance))}
                          </p>

                          <ChevronRight className="ml-auto mt-2 h-4 w-4 text-slate-400" />
                        </div>
                      </button>

                      {index < accounts.length - 1 && (
                        <div className="mx-4 border-t border-slate-100" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm font-medium">
                    No accounts found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
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