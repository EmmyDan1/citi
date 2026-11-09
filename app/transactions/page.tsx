import { Suspense } from "react";

import TransactionsPage from "../../components/transactions/transactions-page";
import TransactionsSkeleton from "../../components/transactions/transactions-skeleton"
export const instant = false;
export default function TransactionsRoute() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsPage />
    </Suspense>
  );
}