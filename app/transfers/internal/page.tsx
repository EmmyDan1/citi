"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Info,
  Landmark,
  Repeat2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function InternalTransferPage() {
  const supabase = createClient();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const [state, setState] = useState<TransferState>("form");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    async function loadAccounts() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to transfer money.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("accounts")
        .select("id, name, type, account_number, balance, available_balance")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setAccounts(data ?? []);
      setLoading(false);
    }

    loadAccounts();
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

  function getAccount(accountId: string) {
    return accounts.find((account) => account.id === accountId) ?? null;
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

    const fromAccount = getAccount(fromAccountId);
    const toAccount = getAccount(toAccountId);

    if (!fromAccount) {
      setError("Select the account you want to transfer money from.");
      return false;
    }

    if (!toAccount) {
      setError("Select the account you want to transfer money to.");
      return false;
    }

    if (fromAccount.id === toAccount.id) {
      setError("Your source and destination accounts must be different.");
      return false;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid transfer amount.");
      return false;
    }

    if (numericAmount > Number(fromAccount.available_balance)) {
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
    const fromAccount = getAccount(fromAccountId);
    const toAccount = getAccount(toAccountId);

    if (!fromAccount || !toAccount) {
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

    const { data, error } = await supabase.rpc("create_internal_transfer", {
      p_user_id: user.id,
      p_from_account_id: fromAccount.id,
      p_to_account_id: toAccount.id,
      p_amount: Number(amount),
      p_memo: memo.trim() || null,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    setTransactionId(data ?? "");
    setState("success");
    setProcessing(false);
  }

  function handleStartOver() {
    setFromAccountId("");
    setToAccountId("");
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

          <div className="mt-6 h-8 w-72 animate-pulse rounded bg-muted" />

          <Card className="mt-8">
            <CardContent className="space-y-5 p-6">
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (state === "success") {
    const fromAccount = getAccount(fromAccountId);
    const toAccount = getAccount(toAccountId);

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
                Your money has been transferred between your accounts.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl border bg-muted/40 p-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Amount</span>

                  <span className="font-semibold">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">From</span>

                  <span className="text-right text-sm font-medium">
                    {fromAccount?.name}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {fromAccount &&
                        formatAccountNumber(fromAccount.account_number)}
                    </span>
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">To</span>

                  <span className="text-right text-sm font-medium">
                    {toAccount?.name}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {toAccount &&
                        formatAccountNumber(toAccount.account_number)}
                    </span>
                  </span>
                </div>
              </div>

              {transactionId && (
                <p className="mt-5 text-xs text-muted-foreground">
                  Transaction ID: {transactionId}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline">
                  <Link href="/transactions">View transactions</Link>
                </Button>

                <Button onClick={handleStartOver}>Make another transfer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (state === "review") {
    const fromAccount = getAccount(fromAccountId);
    const toAccount = getAccount(toAccountId);

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
              <Repeat2 className="h-4 w-4" />
              Between my accounts
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Review your transfer
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Make sure everything looks right before confirming.
            </p>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">Transfer details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{fromAccount?.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {fromAccount &&
                        formatAccountNumber(fromAccount.account_number)}
                    </p>
                  </div>

                  <ArrowRight className="mx-1 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{toAccount?.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {toAccount &&
                        formatAccountNumber(toAccount.account_number)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(Number(amount))}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Transfer type</p>
                  <p className="mt-1 text-sm font-medium">Internal transfer</p>
                </div>
              </div>

              {memo.trim() && (
                <div>
                  <p className="text-xs text-muted-foreground">Memo</p>
                  <p className="mt-1 text-sm">{memo}</p>
                </div>
              )}

              {error && (
                <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={processing}
                  onClick={() => {
                    setError("");
                    setState("form");
                  }}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  disabled={processing}
                  onClick={handleConfirm}
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
            <Repeat2 className="h-4 w-4" />
            Between my accounts
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Transfer between accounts
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Move money between your checking and savings accounts.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold">
                  Choose your accounts
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select where the money is coming from and where it is going.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-account">From</Label>

                <Select
                  value={fromAccountId}
                  onValueChange={(value) => {
                    setFromAccountId(value);

                    if (value === toAccountId) {
                      setToAccountId("");
                    }

                    setError("");
                  }}
                >
                  <SelectTrigger id="from-account" className="h-auto min-h-14">
                    <SelectValue placeholder="Select source account">
                      {fromAccountId && getAccount(fromAccountId) ? (
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Landmark className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium">
                              {getAccount(fromAccountId)?.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {formatAccountNumber(
                                getAccount(fromAccountId)?.account_number ?? "",
                              )}
                              {" · "}
                              {formatCurrency(
                                Number(
                                  getAccount(fromAccountId)
                                    ?.available_balance ?? 0,
                                ),
                              )}{" "}
                              available
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        disabled={account.id === toAccountId}
                        className="py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Landmark className="h-4 w-4" />
                          </div>

                          <div className="text-left">
                            <p className="font-medium">{account.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatAccountNumber(account.account_number)}
                              {" · "}
                              {formatCurrency(
                                Number(account.available_balance),
                              )}{" "}
                              available
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fromAccountId && (
                  <p className="text-xs text-muted-foreground">
                    Available:{" "}
                    {formatCurrency(
                      Number(getAccount(fromAccountId)?.available_balance ?? 0),
                    )}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm">
                  <ArrowDownIcon />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-account">To</Label>

                <Select
                  value={toAccountId}
                  onValueChange={(value) => {
                    setToAccountId(value);
                    setError("");
                  }}
                >
                  <SelectTrigger id="to-account" className="h-auto min-h-14">
                    <SelectValue placeholder="Select destination account">
                      {toAccountId && getAccount(toAccountId) ? (
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Landmark className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium">
                              {getAccount(toAccountId)?.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {formatAccountNumber(
                                getAccount(toAccountId)?.account_number ?? "",
                              )}
                              {" · "}
                              {formatCurrency(
                                Number(
                                  getAccount(toAccountId)?.available_balance ??
                                    0,
                                ),
                              )}{" "}
                              available
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        disabled={account.id === fromAccountId}
                        className="py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Landmark className="h-4 w-4" />
                          </div>

                          <div className="text-left">
                            <p className="font-medium">{account.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatAccountNumber(account.account_number)}
                              {" · "}
                              {formatCurrency(
                                Number(account.available_balance),
                              )}{" "}
                              available
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t" />

              <div className="space-y-2">
                <Label htmlFor="internal-amount">Amount</Label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>

                  <Input
                    id="internal-amount"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="h-12 pl-7 text-lg font-medium"
                    value={amount}
                    onChange={(event) => handleAmountChange(event.target.value)}
                  />
                </div>

                {fromAccountId && (
                  <p className="text-xs text-muted-foreground">
                    Available to transfer:{" "}
                    {formatCurrency(
                      Number(getAccount(fromAccountId)?.available_balance ?? 0),
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="internal-memo">
                  Memo{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <Input
                  id="internal-memo"
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
                  <p className="text-sm font-medium">
                    Review before transferring
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your balances will update after the transfer is confirmed.
                    You will have an opportunity to review everything first.
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
              size="lg"
              className="mt-6 w-full"
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

function ArrowDownIcon() {
  return <ChevronDown className="h-4 w-4" />;
}
