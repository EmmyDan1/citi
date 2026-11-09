export type Account = {
  id: string;
  name: string;
  type: string;
  account_number: string;
  balance: number;
  available_balance: number;
};

export type Transaction = {
  id: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  transaction_date: string;
};

export type DashboardData = {
  firstName: string;
  accounts: Account[];
  transactions: Transaction[];
  totalAvailable: number;
};