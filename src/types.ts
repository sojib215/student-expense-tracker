export type ExpenseCategory =
  | 'Food & Mess'
  | 'Study & Books'
  | 'Rent & Utilities'
  | 'Transport'
  | 'Snacks & Hangout'
  | 'Mobile & Internet'
  | 'Health & Personal'
  | 'Shopping'
  | 'Entertainment'
  | 'Others';

export type IncomeSource =
  | 'Pocket Money / Allowance'
  | 'Part-time Job'
  | 'Tuition Income'
  | 'Scholarship'
  | 'Freelancing'
  | 'Gift / Others';

export type PaymentMethod =
  | 'Cash'
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'Bank Transfer'
  | 'Card';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string; // ExpenseCategory or IncomeSource
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecurring?: boolean;
  tag?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
}

export interface MessMealRecord {
  id: string;
  date: string;
  sokalCount: number; // Breakfast count
  dupurCount: number; // Lunch count
  raatCount: number;  // Dinner count
  notes?: string;
}

export interface MessBazarExpense {
  id: string;
  date: string;
  shopperName: string;
  amount: number;
  items: string;
}

export interface MessUtilityBill {
  id: string;
  title: string; // e.g. Rent, Electricity, Wifi, Gas, Maid
  amount: number;
  dueDate: string;
  isPaid: boolean;
  totalMembers: number;
}

export interface DebtItem {
  id: string;
  personName: string;
  type: 'owe' | 'owed'; // owe = I owe them, owed = They owe me
  amount: number;
  dueDate?: string;
  notes?: string;
  isSettled: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  iconName: string;
}

export type CurrencyCode = 'BDT' | 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export type Language = 'bn' | 'en';
