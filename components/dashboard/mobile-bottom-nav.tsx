import Link from "next/link";
import {
  ArrowUpRight,
  Landmark,
  Settings,
  WalletCards,
} from "lucide-react";

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061a32]/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <BottomNavItem
          href="/"
          icon={Landmark}
          label="Accounts"
          active
        />

        <BottomNavItem
          href="/transfers"
          icon={ArrowUpRight}
          label="Payments"
        />

        <BottomNavItem
          href="/transactions"
          icon={WalletCards}
          label="Activity"
        />

        <BottomNavItem
          href="/profile"
          icon={Settings}
          label="Profile"
        />
      </div>
    </nav>
  );
}

function BottomNavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: typeof Landmark;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] ${
        active
          ? "text-white"
          : "text-white/45 transition-colors hover:text-white/80"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}