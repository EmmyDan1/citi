import Link from "next/link";
import {
  ChevronRight,
  Landmark,
  WalletCards,
} from "lucide-react";

import type { Account } from "../../lib/dashboard/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatAccountNumber(value: string) {
  return `•••• ${value.slice(-4)}`;
}

export default function AccountCard({
  account,
}: {
  account: Account;
}) {
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