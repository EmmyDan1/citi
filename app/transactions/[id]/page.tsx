import { ArrowLeft, CheckCircle2, Clock3, Landmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type Transaction = {
  id: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  transaction_date: string;
  account_id: string;
};

type Account = {
  name: string;
  account_number: string;
  type: string;
};

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="flex items-center gap-3 py-6">
          <Button
            // asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            <Link href="/transactions" aria-label="Back to transactions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Transactions
            </p>

            <h1 className="text-xl font-semibold tracking-tight">
              Transaction details
            </h1>
          </div>
        </header>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                {transaction.status === "posted" ? (
                  <CheckCircle2 className="h-6 w-6 text-slate-700" />
                ) : (
                  <Clock3 className="h-6 w-6 text-slate-700" />
                )}
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {getTypeLabel(transaction.type)}
              </p>

              <p
                className={`mt-1 text-3xl font-semibold tracking-tight ${
                  isCredit ? "text-emerald-700" : "text-slate-950"
                }`}
              >
                {formatCurrency(transaction.amount, transaction.type)}
              </p>

              <p className="mt-2 text-sm font-medium">
                {transaction.description}
              </p>

              <span className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                {transaction.status}
              </span>
            </div>

            <div className="mt-7 border-t border-slate-200 pt-5">
              <div className="space-y-5">
                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Date
                  </span>

                  <span className="text-right text-sm font-medium">
                    {formatDate(transaction.transaction_date)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Account
                  </span>

                  <span className="text-right text-sm font-medium">
                    {account.name}
                    <br />
                    {maskAccountNumber(account.account_number)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Transaction type
                  </span>

                  <span className="text-right text-sm font-medium">
                    {getTypeLabel(transaction.type)}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span className="text-right text-sm font-medium capitalize">
                    {transaction.status}
                  </span>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-sm text-slate-500">
                    Transaction ID
                  </span>

                  <span className="max-w-[190px] break-all text-right text-xs font-medium text-slate-600">
                    {transaction.id}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

              <p className="text-xs leading-5 text-slate-500">
                This transaction was posted to your {account.name}{" "}
                account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}