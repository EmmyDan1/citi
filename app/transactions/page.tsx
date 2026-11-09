import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactions } = user
    ? await supabase
        .from("transactions")
        .select(
          "id, description, type, amount, status, transaction_date"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
    : { data: [] };

  const formatAmount = (amount: number, type: string) => {
    const isCredit = type === "deposit";

    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

    return isCredit ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (date: string) => {
    const transactionDate = new Date(date);
    const now = new Date();

    const sameDay =
      transactionDate.toDateString() === now.toDateString();

    if (sameDay) {
      return `Today, ${transactionDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (
      transactionDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return `Yesterday, ${transactionDate.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;
    }

    return transactionDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDescription = (type: string) => {
    switch (type) {
      case "deposit":
        return "Direct deposit";

      case "payment":
        return "Debit card purchase";

      case "transfer":
        return "External transfer";

      case "withdrawal":
        return "Cash withdrawal";

      default:
        return "Account transaction";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="py-6">
          <p className="text-xs font-medium text-slate-500">
            Activity
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search transactions"
            className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-12"
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Filter transactions"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent activity
          </p>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  const isCredit = transaction.type === "deposit";

                  return (
                   <Link
  key={transaction.id}
  href={`/transactions/${transaction.id}`}
  className="block ..."
>
                      <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            {isCredit ? (
                              <ArrowDownLeft className="h-4 w-4 text-slate-700" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-slate-700" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {transaction.description}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {getDescription(transaction.type)}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                {formatDate(
                                  transaction.transaction_date
                                )}
                              </span>

                              <span className="text-[11px] text-slate-300">
                                •
                              </span>

                              <span className="text-[11px] capitalize text-slate-400">
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p
                          className={`ml-3 whitespace-nowrap text-sm font-semibold ${
                            isCredit
                              ? "text-emerald-700"
                              : "text-slate-900"
                          }`}
                        >
                          {formatAmount(
                            Number(transaction.amount),
                            transaction.type
                          )}
                        </p>
                      </div>

                      {index < transactions.length - 1 && (
                        <Separator />
                      )}
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-medium">
                    No transactions yet
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your account activity will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}