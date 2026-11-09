import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { Account } from "../../lib/dashboard/types";

import AccountCard from "./account-card";

export default function AccountsSection({
  accounts,
}: {
  accounts: Account[];
}) {
  const checkingAccounts = accounts.filter(
    (account) => account.type === "checking"
  );

  const savingsAccounts = accounts.filter(
    (account) => account.type === "savings"
  );

  const otherAccounts = accounts.filter(
    (account) =>
      account.type !== "checking" &&
      account.type !== "savings"
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
            Accounts
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Your money
          </h2>
        </div>

        <Link
          href="/accounts"
          className="flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-200"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <AccountGroup
        title="Checking"
        accounts={checkingAccounts}
      />

      <AccountGroup
        title="Savings"
        accounts={savingsAccounts}
        className="mt-7"
      />

      <AccountGroup
        title="Other accounts"
        accounts={otherAccounts}
        className="mt-7"
      />
    </div>
  );
}

function AccountGroup({
  title,
  accounts,
  className = "",
}: {
  title: string;
  accounts: Account[];
  className?: string;
}) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
          {title}
        </p>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
          />
        ))}
      </div>
    </div>
  );
}