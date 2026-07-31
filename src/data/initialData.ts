import {
  Transaction,
  CategoryBudget,
  MessMealRecord,
  MessBazarExpense,
  MessUtilityBill,
  DebtItem,
  SavingsGoal
} from '../types';

const today = new Date().toISOString().split('T')[0];

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 8500,
    category: 'Pocket Money / Allowance',
    date: getPastDate(15),
    paymentMethod: 'bKash',
    notes: 'Monthly allowance from home',
    tag: 'Allowance'
  },
  {
    id: 'tx-2',
    type: 'income',
    amount: 3000,
    category: 'Tuition Income',
    date: getPastDate(10),
    paymentMethod: 'Cash',
    notes: 'Classes 9th & 10th Math Tuition fee',
    tag: 'Tuition'
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 1500,
    category: 'Food & Mess',
    date: getPastDate(14),
    paymentMethod: 'bKash',
    notes: 'Advance Mess Meal Deposit',
    tag: 'Mess'
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 650,
    category: 'Study & Books',
    date: getPastDate(12),
    paymentMethod: 'Cash',
    notes: 'Nilkhet book purchase (Algorithms & DS)',
    tag: 'Academic'
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 500,
    category: 'Mobile & Internet',
    date: getPastDate(8),
    paymentMethod: 'Nagad',
    notes: 'Monthly Data Pack & Unlimited Talktime',
    tag: 'Utilities'
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 320,
    category: 'Snacks & Hangout',
    date: getPastDate(5),
    paymentMethod: 'Cash',
    notes: 'Evening Singara, Tea & Coffee with campus batchmates',
    tag: 'Hangout'
  },
  {
    id: 'tx-7',
    type: 'expense',
    amount: 250,
    category: 'Transport',
    date: getPastDate(3),
    paymentMethod: 'Cash',
    notes: 'Bus Fare & Rickshaw for Exam Center',
    tag: 'Transport'
  },
  {
    id: 'tx-8',
    type: 'expense',
    amount: 180,
    category: 'Food & Mess',
    date: today,
    paymentMethod: 'Cash',
    notes: 'Campus Canteen Lunch (Chicken Kacchi & Borhani)',
    tag: 'Food'
  }
];

export const initialCategoryBudgets: CategoryBudget[] = [
  { category: 'Food & Mess', limit: 4500 },
  { category: 'Study & Books', limit: 1200 },
  { category: 'Rent & Utilities', limit: 2500 },
  { category: 'Transport', limit: 800 },
  { category: 'Mobile & Internet', limit: 600 },
  { category: 'Snacks & Hangout', limit: 1000 },
  { category: 'Health & Personal', limit: 500 },
  { category: 'Shopping', limit: 800 },
  { category: 'Entertainment', limit: 500 },
  { category: 'Others', limit: 500 }
];

export const initialMessMeals: MessMealRecord[] = [
  { id: 'm-1', date: getPastDate(3), sokalCount: 1, dupurCount: 1, raatCount: 1, notes: 'Regular meal' },
  { id: 'm-2', date: getPastDate(2), sokalCount: 1, dupurCount: 0, raatCount: 1, notes: 'Department feast in afternoon' },
  { id: 'm-3', date: getPastDate(1), sokalCount: 0, dupurCount: 1, raatCount: 1, notes: 'Late wake up' },
  { id: 'm-4', date: today, sokalCount: 1, dupurCount: 1, raatCount: 1, notes: 'Today active meals' }
];

export const initialMessBazar: MessBazarExpense[] = [
  { id: 'b-1', date: getPastDate(10), shopperName: 'Tanvir', amount: 1850, items: 'Rice 10kg, Oil 2L, Egg 2 dozen, Spices, Potatoes' },
  { id: 'b-2', date: getPastDate(5), shopperName: 'Sojib (Me)', amount: 1200, items: 'Chicken 2kg, Fish, Vegetables, Lentils (Dal)' },
  { id: 'b-3', date: getPastDate(1), shopperName: 'Rahim', amount: 650, items: 'Milk, Tea leaves, Snacks, Washing powder' }
];

export const initialMessUtilities: MessUtilityBill[] = [
  { id: 'u-1', title: 'Wifi Internet (10 Mbps)', amount: 800, dueDate: getPastDate(-5), isPaid: true, totalMembers: 4 },
  { id: 'u-2', title: 'Electricity & Gas Bill', amount: 1400, dueDate: getPastDate(-10), isPaid: false, totalMembers: 4 },
  { id: 'u-3', title: 'Mess Housemaid / Cook salary', amount: 2400, dueDate: getPastDate(-3), isPaid: false, totalMembers: 4 }
];

export const initialDebts: DebtItem[] = [
  { id: 'd-1', personName: 'Siam (Batchmate)', type: 'owed', amount: 350, dueDate: getPastDate(-7), notes: 'Photocopy & lab report print cost', isSettled: false, createdAt: getPastDate(12) },
  { id: 'd-2', personName: 'Mama Canteen / Shop', type: 'owe', amount: 180, dueDate: getPastDate(-2), notes: 'Evening tea & biscuits balance', isSettled: false, createdAt: getPastDate(4) },
  { id: 'd-3', personName: 'Rafiq (Flatmate)', type: 'owed', amount: 500, dueDate: getPastDate(5), notes: 'Shared wifi bill cash contribution', isSettled: true, createdAt: getPastDate(15) }
];

export const initialSavingsGoals: SavingsGoal[] = [
  { id: 's-1', title: 'Semester Final Exam & Registration Fee', targetAmount: 5000, currentAmount: 3500, deadline: getPastDate(-45), iconName: 'GraduationCap' },
  { id: 's-2', title: 'New Study Laptop / Tablet Fund', targetAmount: 35000, currentAmount: 12000, deadline: getPastDate(-120), iconName: 'Laptop' },
  { id: 's-3', title: 'Campus Tour & Vacation Trip', targetAmount: 4000, currentAmount: 2800, deadline: getPastDate(-30), iconName: 'Compass' }
];

export const currencies = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' }
];
