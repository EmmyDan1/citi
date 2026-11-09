import { Suspense } from "react";

import AccountsPage from "../../components/account/accounts-page";
import AccountsSkeleton from "../../components/account/accounts-skeleton";

export default function AccountsRoute() {
  return (
    <Suspense fallback={<AccountsSkeleton />}>
      <AccountsPage />
    </Suspense>
  );
}