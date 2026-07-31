import {
  Transaction,
  CategoryBudget,
  MessMealRecord,
  MessBazarExpense,
  MessUtilityBill,
  DebtItem,
  SavingsGoal,
  Language,
  CurrencyCode
} from '../types';
import {
  initialTransactions,
  initialCategoryBudgets,
  initialMessMeals,
  initialMessBazar,
  initialMessUtilities,
  initialDebts,
  initialSavingsGoals
} from '../data/initialData';

const KEYS = {
  TRANSACTIONS: 'student_et_transactions',
  BUDGETS: 'student_et_budgets',
  MESS_MEALS: 'student_et_mess_meals',
  MESS_BAZAR: 'student_et_mess_bazar',
  MESS_UTILITIES: 'student_et_mess_utilities',
  DEBTS: 'student_et_debts',
  SAVINGS: 'student_et_savings',
  LANG: 'student_et_lang',
  CURRENCY: 'student_et_currency',
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error loading key from storage:', key, e);
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to storage:', key, e);
  }
};

export const getStoredTransactions = (): Transaction[] =>
  loadFromStorage(KEYS.TRANSACTIONS, initialTransactions);

export const getStoredBudgets = (): CategoryBudget[] =>
  loadFromStorage(KEYS.BUDGETS, initialCategoryBudgets);

export const getStoredMessMeals = (): MessMealRecord[] =>
  loadFromStorage(KEYS.MESS_MEALS, initialMessMeals);

export const getStoredMessBazar = (): MessBazarExpense[] =>
  loadFromStorage(KEYS.MESS_BAZAR, initialMessBazar);

export const getStoredMessUtilities = (): MessUtilityBill[] =>
  loadFromStorage(KEYS.MESS_UTILITIES, initialMessUtilities);

export const getStoredDebts = (): DebtItem[] =>
  loadFromStorage(KEYS.DEBTS, initialDebts);

export const getStoredSavings = (): SavingsGoal[] =>
  loadFromStorage(KEYS.SAVINGS, initialSavingsGoals);

export const getStoredLanguage = (): Language =>
  loadFromStorage(KEYS.LANG, 'bn');

export const getStoredCurrency = (): CurrencyCode =>
  loadFromStorage(KEYS.CURRENCY, 'BDT');

export const exportAppStateAsJSON = () => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    transactions: getStoredTransactions(),
    budgets: getStoredBudgets(),
    messMeals: getStoredMessMeals(),
    messBazar: getStoredMessBazar(),
    messUtilities: getStoredMessUtilities(),
    debts: getStoredDebts(),
    savings: getStoredSavings(),
    language: getStoredLanguage(),
    currency: getStoredCurrency(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `student-expense-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportTransactionsToCSV = (transactions: Transaction[], currencySymbol: string) => {
  const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Payment Method', 'Notes', 'Tag'];
  const rows = transactions.map(t => [
    t.id,
    t.type.toUpperCase(),
    `${currencySymbol}${t.amount}`,
    `"${t.category}"`,
    t.date,
    t.paymentMethod,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    `"${t.tag || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `student-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const resetAllAppData = () => {
  localStorage.clear();
  window.location.reload();
};
