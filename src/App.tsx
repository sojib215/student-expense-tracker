import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Utensils,
  Target,
  HandCoins,
  PiggyBank,
  Sparkles
} from 'lucide-react';

import {
  Transaction,
  CategoryBudget,
  MessMealRecord,
  MessBazarExpense,
  MessUtilityBill,
  DebtItem,
  SavingsGoal,
  Language,
  CurrencyCode,
  ExpenseCategory
} from './types';

import {
  getStoredTransactions,
  getStoredBudgets,
  getStoredMessMeals,
  getStoredMessBazar,
  getStoredMessUtilities,
  getStoredDebts,
  getStoredSavings,
  getStoredLanguage,
  getStoredCurrency,
  saveToStorage,
  loadFromStorage
} from './utils/storage';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { MessManagerView } from './components/MessManagerView';
import { BudgetsView } from './components/BudgetsView';
import { DebtsView } from './components/DebtsView';
import { SavingsView } from './components/SavingsView';
import { AIAdvisorView } from './components/AIAdvisorView';
import { QuickAddModal } from './components/QuickAddModal';
import { translations } from './data/translations';
import { currencies } from './data/initialData';

export default function App() {
  // Application State
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(getStoredBudgets);
  const [messMeals, setMessMeals] = useState<MessMealRecord[]>(getStoredMessMeals);
  const [messBazar, setMessBazar] = useState<MessBazarExpense[]>(getStoredMessBazar);
  const [messUtilities, setMessUtilities] = useState<MessUtilityBill[]>(getStoredMessUtilities);
  const [debts, setDebts] = useState<DebtItem[]>(getStoredDebts);
  const [savings, setSavings] = useState<SavingsGoal[]>(getStoredSavings);

  const [language, setLanguage] = useState<Language>(getStoredLanguage);
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'transactions' | 'mess' | 'budgets' | 'debts' | 'savings' | 'ai'
  >('dashboard');

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || '৳';
  const t = translations[language];

  // Sync state to local storage
  useEffect(() => { saveToStorage('student_et_transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('student_et_budgets', categoryBudgets); }, [categoryBudgets]);
  useEffect(() => { saveToStorage('student_et_mess_meals', messMeals); }, [messMeals]);
  useEffect(() => { saveToStorage('student_et_mess_bazar', messBazar); }, [messBazar]);
  useEffect(() => { saveToStorage('student_et_mess_utilities', messUtilities); }, [messUtilities]);
  useEffect(() => { saveToStorage('student_et_debts', debts); }, [debts]);
  useEffect(() => { saveToStorage('student_et_savings', savings); }, [savings]);
  useEffect(() => { saveToStorage('student_et_lang', language); }, [language]);
  useEffect(() => { saveToStorage('student_et_currency', currency); }, [currency]);

  // Overall Financial Calculations
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const remainingBalance = totalIncome - totalExpense;

  // Handlers for Transactions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    setTransactions((prev) => [created, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Mess Manager
  const handleAddMeal = (meal: Omit<MessMealRecord, 'id'>) => {
    const created: MessMealRecord = { ...meal, id: `m-${Date.now()}` };
    setMessMeals((prev) => [created, ...prev]);
  };

  const handleAddBazar = (bazar: Omit<MessBazarExpense, 'id'>) => {
    const created: MessBazarExpense = { ...bazar, id: `b-${Date.now()}` };
    setMessBazar((prev) => [created, ...prev]);

    // Automatically record bazar expense into transactions as well!
    handleAddTransaction({
      type: 'expense',
      amount: bazar.amount,
      category: 'Food & Mess',
      date: bazar.date,
      paymentMethod: 'Cash',
      notes: `Mess Bazar: ${bazar.shopperName} (${bazar.items})`,
      tag: 'Mess Bazar'
    });
  };

  const handleAddUtility = (utility: Omit<MessUtilityBill, 'id'>) => {
    const created: MessUtilityBill = { ...utility, id: `u-${Date.now()}` };
    setMessUtilities((prev) => [created, ...prev]);
  };

  const handleDeleteMeal = (id: string) => {
    setMessMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteBazar = (id: string) => {
    setMessBazar((prev) => prev.filter((b) => b.id !== id));
  };

  const handleToggleUtilityPaid = (id: string) => {
    setMessUtilities((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isPaid: !u.isPaid } : u))
    );
  };

  // Handlers for Budgets
  const handleUpdateBudgetLimit = (category: ExpenseCategory, newLimit: number) => {
    setCategoryBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, limit: newLimit } : b))
    );
  };

  // Handlers for Debts
  const handleAddDebt = (debt: Omit<DebtItem, 'id' | 'isSettled' | 'createdAt'>) => {
    const created: DebtItem = {
      ...debt,
      id: `d-${Date.now()}`,
      isSettled: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDebts((prev) => [created, ...prev]);
  };

  const handleToggleSettled = (id: string) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isSettled: !d.isSettled } : d))
    );
  };

  const handleDeleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers for Savings Jars
  const handleAddGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const created: SavingsGoal = {
      ...goal,
      id: `s-${Date.now()}`,
      currentAmount: 0
    };
    setSavings((prev) => [...prev, created]);
  };

  const handleAddSavingsMoney = (goalId: string, amount: number) => {
    setSavings((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    // Record as expense in transactions under 'Health & Personal' / Savings tag
    handleAddTransaction({
      type: 'expense',
      amount,
      category: 'Health & Personal',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      notes: `Deposited into Savings Jar`,
      tag: 'Savings'
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setSavings((prev) => prev.filter((g) => g.id !== goalId));
  };

  // JSON Import Handler
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.budgets) setCategoryBudgets(parsed.budgets);
        if (parsed.messMeals) setMessMeals(parsed.messMeals);
        if (parsed.messBazar) setMessBazar(parsed.messBazar);
        if (parsed.messUtilities) setMessUtilities(parsed.messUtilities);
        if (parsed.debts) setDebts(parsed.debts);
        if (parsed.savings) setSavings(parsed.savings);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.currency) setCurrency(parsed.currency);
        alert(language === 'bn' ? 'ডাটা সফলভাবে ব্যাকআপ থেকে রিকভার করা হয়েছে!' : 'Data restored successfully from backup!');
      } catch (err) {
        alert('Invalid backup JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'transactions', label: t.navTransactions, icon: Receipt },
    { id: 'mess', label: t.navMessManager, icon: Utensils },
    { id: 'budgets', label: t.navBudgets, icon: Target },
    { id: 'debts', label: t.navDebts, icon: HandCoins },
    { id: 'savings', label: t.navSavings, icon: PiggyBank },
    { id: 'ai', label: t.navAIAdvisor, icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12 flex flex-col justify-between">
      
      <div>
        {/* Top Navigation Bar */}
        <Header
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onImportJSON={handleImportJSON}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {/* Navigation Tabs Bar */}
          <nav className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Global Summary Metrics */}
          <SummaryCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            remainingBalance={remainingBalance}
            currencySymbol={currencySymbol}
            language={language}
          />

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            categoryBudgets={categoryBudgets}
            currencySymbol={currencySymbol}
            language={language}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            currencySymbol={currencySymbol}
            language={language}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'mess' && (
          <MessManagerView
            messMeals={messMeals}
            messBazar={messBazar}
            messUtilities={messUtilities}
            currencySymbol={currencySymbol}
            language={language}
            onAddMeal={handleAddMeal}
            onAddBazar={handleAddBazar}
            onAddUtility={handleAddUtility}
            onDeleteMeal={handleDeleteMeal}
            onDeleteBazar={handleDeleteBazar}
            onToggleUtilityPaid={handleToggleUtilityPaid}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsView
            categoryBudgets={categoryBudgets}
            transactions={transactions}
            currencySymbol={currencySymbol}
            language={language}
            onUpdateBudgetLimit={handleUpdateBudgetLimit}
          />
        )}

        {activeTab === 'debts' && (
          <DebtsView
            debts={debts}
            currencySymbol={currencySymbol}
            language={language}
            onAddDebt={handleAddDebt}
            onToggleSettled={handleToggleSettled}
            onDeleteDebt={handleDeleteDebt}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsView
            savings={savings}
            currencySymbol={currencySymbol}
            language={language}
            onAddGoal={handleAddGoal}
            onAddSavingsMoney={handleAddSavingsMoney}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'ai' && (
          <AIAdvisorView
            transactions={transactions}
            categoryBudgets={categoryBudgets}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            remainingBalance={remainingBalance}
            currencySymbol={currencySymbol}
            language={language}
          />
        )}

      </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="mt-12 bg-white border-t border-slate-200 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-2">
        <div className="flex items-center gap-2">
          <span>System Status:</span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational & Healthy
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider text-slate-400">
          <span>{currency} • {language === 'bn' ? 'বাংলা' : 'English'}</span>
          <span>Offline Ready</span>
          <span>Student Edition v1.0</span>
        </div>
      </footer>

      {/* Quick Add Transaction Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={handleAddTransaction}
        language={language}
        currencySymbol={currencySymbol}
      />

    </div>
  );
}
