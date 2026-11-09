import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  CreditCard,
} from "lucide-react";

import type { Transaction } from "../../lib/dashboard/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatTransactionDate(value: string) {
  const date = new Date(value);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
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

export default function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
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

      {transactions.length > 0 ? (
        <div>
          {transactions.map((transaction, index) => {
            const Icon = getTransactionIcon(transaction);
            const credit = isCredit(transaction);

            return (
              <Link
                key={transaction.id}
                href={`/transactions/${transaction.id}`}
                className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6 ${
                  index !== transactions.length - 1
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
  );
}