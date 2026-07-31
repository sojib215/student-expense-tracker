import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  remainingBalance: number;
  currencySymbol: string;
  language: Language;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  remainingBalance,
  currencySymbol,
  language
}) => {
  const t = translations[language];

  // Calculate remaining days in current month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, lastDayOfMonth - today.getDate() + 1);

  // Safe daily spending allowance
  const safeDailyAllowance = remainingBalance > 0 ? Math.floor(remainingBalance / remainingDays) : 0;

  // Budget Health status
  const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  
  let healthStatus = t.healthGood;
  let healthColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let HealthIcon = ShieldCheck;

  if (expenseRatio > 100 || remainingBalance < 0) {
    healthStatus = t.healthDanger;
    healthColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    HealthIcon = AlertTriangle;
  } else if (expenseRatio > 75) {
    healthStatus = t.healthWarning;
    healthColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    HealthIcon = AlertTriangle;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Income */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.totalIncome}
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {currencySymbol}{totalIncome.toLocaleString()}
        </div>
        <p className="text-xs text-emerald-600 font-medium mt-2">
          Allowance & earnings logged
        </p>
      </div>

      {/* Total Expenses */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.totalExpense}
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight">
          {currencySymbol}{totalExpense.toLocaleString()}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-2">
          {expenseRatio.toFixed(1)}% of total allowance
        </p>
      </div>

      {/* Remaining Balance - Featured Accent Card */}
      <div className="bg-indigo-600 border border-indigo-700 rounded-2xl p-5 relative overflow-hidden shadow-md shadow-indigo-200 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
            {t.netSavings}
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/30 text-white border border-indigo-400/30">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {currencySymbol}{remainingBalance.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
            <HealthIcon className="w-3 h-3 text-white" />
            {healthStatus}
          </span>
        </div>
      </div>

      {/* Safe Daily Limit */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.dailyLimit}
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {currencySymbol}{safeDailyAllowance.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-2">
          For next {remainingDays} days this month
        </p>
      </div>

    </div>
  );
};
