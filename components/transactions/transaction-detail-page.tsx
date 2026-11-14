import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

function formatCurrency(amount: number, type: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(Number(amount)));

  return type === "deposit" ? `+${formatted}` : `-${formatted}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getTypeLabel(type: string) {
  switch (type) {
    case "deposit":
      return "Deposit";
    case "payment":
      return "Debit card purchase";
    case "transfer":
      return "Transfer";
    case "withdrawal":
      return "Cash withdrawal";
    default:
      return "Account transaction";
  }
}

function maskAccountNumber(accountNumber: string) {
  return `•••• ${accountNumber.slice(-4)}`;
}

function getStatusStyle(status: string) {
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
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: transaction } = await supabase
    .from("transactions")
    .select(
      "id, description, type, amount, status, transaction_date, account_id"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!transaction) {
    notFound();
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("name, account_number, type")
    .eq("id", transaction.account_id)
    .eq("user_id", user.id)
    .single();

  if (!account) {
    notFound();
  }

  const isCredit = transaction.type === "deposit";
  const isPosted =
    transaction.status === "posted" ||
    transaction.status === "completed";

  return (
    <main className="min-h-screen bg-northstar-background text-northstar-text">
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <header className="flex items-center gap-3 py-6 sm:py-8">
<Link
  href="/transactions"
  aria-label="Back to transactions"
  className="flex h-10 w-10 items-center justify-center rounded-full text-northstar-text-muted transition-colors hover:bg-northstar-soft-blue hover:text-northstar-blue"
>
  <ArrowLeft className="h-5 w-5" />
</Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-northstar-text-muted">
              Activity
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-northstar-text sm:text-2xl">
              Transaction details
            </h1>
          </div>
        </header>

        <Card className="overflow-hidden rounded-2xl border-northstar-border bg-white shadow-sm">
          <CardContent className="p-5 sm:p-7">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isPosted
                    ? "bg-[#eaf8f2]"
                    : "bg-[#fff8e8]"
                }`}
              >
                {isPosted ? (
                  <CheckCircle2 className="h-6 w-6 text-[#16845b]" />
                ) : (
                  <Clock3 className="h-6 w-6 text-[#a66a00]" />
                )}
              </div>

              <p className="mt-5 text-sm text-northstar-text-muted">
                {getTypeLabel(transaction.type)}
              </p>

              <p
                className={`mt-1 text-3xl font-semibold tracking-tight sm:text-4xl ${
                  isCredit
                    ? "text-[#16845b]"
                    : "text-northstar-text"
                }`}
              >
                {formatCurrency(transaction.amount, transaction.type)}
              </p>

              <p className="mt-2 max-w-full break-words text-sm font-medium text-northstar-text">
                {transaction.description}
              </p>

              <span
                className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="mt-7 border-t border-northstar-border pt-5">
              <div className="space-y-5">
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-northstar-text-muted">
                    Date
                  </span>
                  <span className="text-right text-sm font-medium text-northstar-text">
                    {formatDate(transaction.transaction_date)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-northstar-text-muted">
                    Account
                  </span>
                  <span className="text-right text-sm font-medium text-northstar-text">
                    {account.name}
                    <br />
                    {maskAccountNumber(account.account_number)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-northstar-text-muted">
                    Transaction type
                  </span>
                  <span className="text-right text-sm font-medium text-northstar-text">
                    {getTypeLabel(transaction.type)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-northstar-text-muted">
                    Status
                  </span>
                  <span className="text-right text-sm font-medium capitalize text-northstar-text">
                    {transaction.status}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-northstar-text-muted">
                    Transaction ID
                  </span>
                  <span className="max-w-[190px] break-all text-right text-xs font-medium text-northstar-text-secondary">
                    {transaction.id}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-2xl border-northstar-border bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-northstar-blue" />
              <p className="text-xs leading-5 text-northstar-text-muted">
                This transaction was posted to your {account.name} account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}