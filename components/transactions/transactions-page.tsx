import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ReceiptText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

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
        return "Transfer";
      case "withdrawal":
        return "Cash withdrawal";
      default:
        return "Account transaction";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "posted":
      case "completed":
        return "bg-[#eaf8f2] text-[#16845b]";
      case "pending":
        return "bg-[#fff8e8] text-[#a66a00]";
      case "failed":
      case "cancelled":
        return "bg-[#fff0f0] text-[#c53b3b]";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <main className="min-h-screen bg-northstar-background text-northstar-text">
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <header className="py-6 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-northstar-text-muted">
            Banking
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-northstar-text sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1.5 text-sm text-northstar-text-muted">
            Review your recent account activity.
          </p>
        </header>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-northstar-text-subtle" />

          <Input
            placeholder="Search transactions"
            className="h-12 rounded-xl border-northstar-border bg-white pl-10 pr-12 text-sm shadow-sm placeholder:text-northstar-text-subtle focus-visible:border-northstar-bright-blue focus-visible:ring-northstar-bright-blue/15"
            aria-label="Search transactions"
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-northstar-text-muted transition-colors hover:bg-northstar-soft-blue hover:text-northstar-blue"
            aria-label="Filter transactions"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-northstar-text">
                Recent activity
              </h2>
              <p className="mt-0.5 text-xs text-northstar-text-muted">
                Your latest transactions
              </p>
            </div>

            <span className="text-xs font-medium text-northstar-text-muted">
              {transactions?.length ?? 0} transactions
            </span>
          </div>

          <Card className="overflow-hidden rounded-2xl border-northstar-border bg-white shadow-sm">
            <CardContent className="p-0">
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  const isCredit = transaction.type === "deposit";

                  return (
                    <div key={transaction.id}>
                      <Link
                        href={`/transactions/${transaction.id}`}
                        className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-northstar-surface-muted active:bg-northstar-soft-blue/50 sm:px-5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isCredit
                                ? "bg-[#eaf8f2]"
                                : "bg-northstar-soft-blue"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft className="h-5 w-5 text-[#16845b]" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 text-northstar-blue" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-northstar-text">
                              {transaction.description}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-northstar-text-muted">
                              {getDescription(transaction.type)}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="text-[11px] text-northstar-text-subtle">
                                {formatDate(transaction.transaction_date)}
                              </span>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusStyle(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <p
                            className={`whitespace-nowrap text-sm font-semibold ${
                              isCredit
                                ? "text-[#16845b]"
                                : "text-northstar-text"
                            }`}
                          >
                            {formatAmount(
                              Number(transaction.amount),
                              transaction.type
                            )}
                          </p>
                        </div>
                      </Link>

                      {index < transactions.length - 1 && (
                        <div className="mx-4 border-t border-northstar-border sm:mx-5" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-northstar-soft-blue">
                    <ReceiptText className="h-5 w-5 text-northstar-blue" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-northstar-text">
                    No transactions yet
                  </p>

                  <p className="mt-1 text-xs text-northstar-text-muted">
                    Your account activity will appear here.
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