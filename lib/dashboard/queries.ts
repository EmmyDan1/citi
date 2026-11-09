import { createClient } from "@/lib/supabase/server";

import type {
  Account,
  DashboardData,
  Transaction,
} from "./types";

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      firstName: "Customer",
      accounts: [],
      transactions: [],
      totalAvailable: 0,
    };
  }

  const [{ data: profile }, { data: accounts }, { data: transactions }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("first_name, last_name, display_name")
        .eq("id", user.id)
        .maybeSingle(),

      supabase
        .from("accounts")
        .select(
          "id, name, type, account_number, balance, available_balance"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("transactions")
        .select(
          "id, description, type, amount, status, transaction_date"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .limit(5),
    ]);

  const accountList = (accounts ?? []) as Account[];
  const transactionList = (transactions ?? []) as Transaction[];

  const firstName =
    profile?.first_name ||
    profile?.display_name?.split(" ")[0] ||
    "Customer";

  const totalAvailable = accountList.reduce(
    (total, account) =>
      total + Number(account.available_balance),
    0
  );

  return {
    firstName,
    accounts: accountList,
    transactions: transactionList,
    totalAvailable,
  };
}