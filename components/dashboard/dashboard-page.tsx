import { ArrowUpRight, Landmark } from "lucide-react";

import { getDashboardData } from "../../lib/dashboard/queries";

import DashboardHeader from "./dashboard-header";
import DashboardNav from "./dashboard-nav";
import WelcomeSummary from "./welcome-summary";
import AccountsSection from "./accounts-section";
import QuickActions from "./quick-actions";
import RecentTransactions from "./recent-transactions";
import MobileBottomNav from "./mobile-bottom-nav";

export default async function DashboardPage() {
  const {
    firstName,
    accounts,
    transactions,
    totalAvailable,
  } = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#061a32]">
      <section className="bg-gradient-to-b from-[#063b70] via-[#064b8c] to-[#075da8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <DashboardHeader firstName={firstName} />

          <DashboardNav />

          <WelcomeSummary
            firstName={firstName}
            totalAvailable={totalAvailable}
          />
        </div>
      </section>

      <section className="bg-[#061a32]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <AccountsSection accounts={accounts} />

          <QuickActions />

          <RecentTransactions transactions={transactions} />

          <MobileBottomNav />

          <div className="h-20 lg:hidden" />
        </div>
      </section>
    </main>
  );
}