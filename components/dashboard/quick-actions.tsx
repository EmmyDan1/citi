import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
  WalletCards,
} from "lucide-react";

export default function QuickActions() {
  return (
    <div className="mt-8">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
          Quick actions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction
          href="/transfers"
          icon={ArrowUpRight}
          title="Transfer"
          description="Move money"
        />

        <QuickAction
          href="/transactions"
          icon={ArrowDownLeft}
          title="Activity"
          description="View transactions"
        />

        <QuickAction
          href="/accounts"
          icon={WalletCards}
          title="Accounts"
          description="Manage accounts"
        />

        <QuickAction
          href="/profile"
          icon={Settings}
          title="Services"
          description="Account settings"
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof ArrowUpRight;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]"
    >
      <Icon className="h-5 w-5 text-blue-300" />

      <p className="mt-4 text-sm font-medium text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-white/45">
        {description}
      </p>
    </Link>
  );
}