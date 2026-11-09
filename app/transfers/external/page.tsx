"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Info,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Account = {
  id: string;
  name: string;
  type: string;
  account_number: string;
  balance: number;
  available_balance: number;
};

type TransferState = "form" | "review" | "success";

export default function ExternalTransferPage() {
  const supabase = createClient();

  const [account, setAccount] = useState<Account | null>(null);

  const [recipientName, setRecipientName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const [state, setState] = useState<TransferState>("form");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    async function loadAccount() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to make a transfer.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("accounts")
        .select(
          "id, name, type, account_number, balance, available_balance"
        )
        .eq("user_id", user.id)
        .eq("type", "checking")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setAccount(data);
      }

      setLoading(false);
    }

    loadAccount();
  }, [supabase]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  function formatAccountNumber(value: string) {
    return `•••• ${value.slice(-4)}`;
  }

  function handleRoutingNumberChange(value: string) {
    setRoutingNumber(value.replace(/\D/g, "").slice(0, 9));
  }

  function handleAccountNumberChange(value: string) {
    setRecipientAccountNumber(value.replace(/\D/g, ""));
  }

  function handleAmountChange(value: string) {
    if (value === "") {
      setAmount("");
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    setAmount(value);
  }

  function validateForm() {
    setError("");

    if (!account) {
      setError("Your checking account could not be loaded.");
      return false;
    }

    if (!recipientName.trim()) {
      setError("Enter the recipient name.");
      return false;
    }

    if (routingNumber.length !== 9) {
      setError("Enter a valid 9-digit routing number.");
      return false;
    }

    if (!recipientAccountNumber.trim()) {
      setError("Enter the recipient account number.");
      return false;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid transfer amount.");
      return false;
    }

    if (numericAmount > Number(account.available_balance)) {
      setError("The transfer amount exceeds your available balance.");
      return false;
    }

    return true;
  }

  function handleContinue() {
    if (!validateForm()) {
      return;
    }

    setState("review");
  }

  async function handleConfirm() {
    if (!account) {
      return;
    }

    setProcessing(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session has expired. Please sign in again.");
      setProcessing(false);
      return;
    }

    const { data, error } = await supabase.rpc("create_transfer", {
      p_user_id: user.id,
      p_account_id: account.id,
      p_recipient_name: recipientName.trim(),
      p_routing_number: routingNumber,
      p_recipient_account_number: recipientAccountNumber.trim(),
      p_amount: Number(amount),
      p_memo: memo.trim() || null,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    setTransactionId(data);
    setState("success");
    setProcessing(false);
  }

  function handleStartOver() {
    setRecipientName("");
    setRoutingNumber("");
    setRecipientAccountNumber("");
    setAmount("");
    setMemo("");
    setError("");
    setTransactionId("");
    setState("form");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-8 w-64 animate-pulse rounded bg-muted" />

          <Card className="mt-8">
            <CardContent className="space-y-5 p-6">
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (state === "success") {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-2xl items-center px-4 py-8 sm:px-6">
          <Card className="w-full">
            <CardContent className="p-6 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>

              <h1 className="mt-6 text-2xl font-semibold tracking-tight">
                Transfer completed
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Your transfer has been submitted successfully.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl border bg-muted/40 p-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Amount
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Recipient
                  </span>
                  <span className="text-right text-sm font-medium">
                    {recipientName}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    From
                  </span>
                  <span className="text-sm font-medium">
                    {account?.name}{" "}
                    {account && formatAccountNumber(account.account_number)}
                  </span>
                </div>
              </div>

              {transactionId && (
                <p className="mt-5 text-xs text-muted-foreground">
                  Transaction ID: {transactionId}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button  variant="outline">
                  <Link href="/transactions">View transactions</Link>
                </Button>

                <Button onClick={handleStartOver}>
                  Make another transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (state === "review") {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/transfers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Transfers
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-primary">Review transfer</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Confirm your transfer
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review the details below before submitting the transfer.
            </p>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">Transfer details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {account?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account &&
                        formatAccountNumber(account.account_number)}
                    </p>
                  </div>

                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Recipient</p>
                  <p className="mt-1 text-sm font-medium">
                    {recipientName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Amount
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(Number(amount))}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Routing number
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {routingNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Account number
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    •••• {recipientAccountNumber.slice(-4)}
                  </p>
                </div>
              </div>

              {memo.trim() && (
                <div>
                  <p className="text-xs text-muted-foreground">Memo</p>
                  <p className="mt-1 text-sm">{memo}</p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setError("");
                    setState("form");
                  }}
                  disabled={processing}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Confirm transfer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/transfers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Transfers
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Building2 className="h-4 w-4" />
            External transfer
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Send money to another bank
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter the recipient's bank details and the amount you want to
            transfer.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-5 sm:p-6">
            <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {account?.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {account &&
                          formatAccountNumber(account.account_number)}
                      </p>
                    </div>

                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      Available balance
                    </span>
                    <span className="text-sm font-semibold">
                      {account
                        ? formatCurrency(Number(account.available_balance))
                        : "$0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-7 border-t" />

            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold">
                  Recipient information
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the details exactly as provided by the recipient.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-name">Recipient name</Label>
                <Input
                  id="recipient-name"
                  placeholder="Full name or business name"
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="routing-number">Routing number</Label>
                  <Input
                    id="routing-number"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="9 digits"
                    value={routingNumber}
                    onChange={(event) =>
                      handleRoutingNumberChange(event.target.value)
                    }
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the recipient bank's 9-digit routing number.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-account">
                    Account number
                  </Label>
                  <Input
                    id="recipient-account"
                    inputMode="numeric"
                    placeholder="Account number"
                    value={recipientAccountNumber}
                    onChange={(event) =>
                      handleAccountNumberChange(event.target.value)
                    }
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>

                  <Input
                    id="amount"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="pl-7 text-lg font-medium"
                    value={amount}
                    onChange={(event) =>
                      handleAmountChange(event.target.value)
                    }
                  />
                </div>

                {account && (
                  <p className="text-xs text-muted-foreground">
                    Available to transfer:{" "}
                    {formatCurrency(Number(account.available_balance))}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">
                  Memo <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>

                <Input
                  id="memo"
                  placeholder="Add a note"
                  maxLength={100}
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-7 rounded-xl border bg-muted/20 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">Review before sending</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Verify the recipient and account details carefully. You
                    will have an opportunity to review the transfer before it
                    is submitted.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="button"
              className="mt-6 w-full"
              size="lg"
              onClick={handleContinue}
            >
              Continue to review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}