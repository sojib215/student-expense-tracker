import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Transaction, CategoryBudget, Language } from '../types';
import { translations } from '../data/translations';

interface DashboardViewProps {
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  currencySymbol: string;
  language: Language;
  onOpenQuickAdd: () => void;
  onDeleteTransaction: (id: string) => void;
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#64748b', // slate
  '#84cc16', // lime
  '#d97706'  // amber dark
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  categoryBudgets,
  currencySymbol,
  language,
  onOpenQuickAdd,
  onDeleteTransaction
}) => {
  const t = translations[language];

  // Prepare Category Breakdown Data for Pie Chart
  const expenseMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    });

  const categoryPieData = Object.keys(expenseMap).map((cat) => ({
    name: cat,
    value: expenseMap[cat]
  }));

  // Prepare Monthly/Daily Spending Bar Chart Data
  const dailyMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .slice(-14) // Last 14 records
    .forEach((t) => {
      dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
    });

  const dailyTrendData = Object.keys(dailyMap)
    .sort()
    .map((date) => ({
      date: date.substring(5), // MM-DD
      amount: dailyMap[date]
    }));

  // Check category budget warnings (>80%)
  const budgetWarnings = categoryBudgets
    .map((b) => {
      const spent = expenseMap[b.category] || 0;
      const pct = (spent / b.limit) * 100;
      return { category: b.category, spent, limit: b.limit, pct };
    })
    .filter((b) => b.pct >= 80);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Budget Over-limit Warning Alert Banner */}
      {budgetWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-amber-900">
              {language === 'bn' ? 'বাজেট সতর্কতা!' : 'Budget Warning Alert!'}
            </h4>
            <p className="mt-0.5 text-amber-700">
              {budgetWarnings.map((w) => (
                <span key={w.category} className="inline-block mr-3">
                  • <strong>{w.category}:</strong> {currencySymbol}{w.spent}/{currencySymbol}{w.limit} ({w.pct.toFixed(0)}%)
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Expense Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t.spendingByCategory}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Share (%)
            </span>
          </div>

          {categoryPieData.length > 0 ? (
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${currencySymbol}${val}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 text-center p-4">
              {t.noTransactionsYet}
            </div>
          )}

          {/* Legend Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 max-h-24 overflow-y-auto">
            {categoryPieData.map((item, idx) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                {item.name}: {currencySymbol}{item.value}
              </span>
            ))}
          </div>
        </div>

        {/* Monthly Spending Trend Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.monthlyTrend}
              </h3>
              <p className="text-xs text-slate-500">
                Daily expense breakdown
              </p>
            </div>

            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-indigo-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন খরচ যোগ করুন' : t.addExpense}</span>
            </button>
          </div>

          {dailyTrendData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(val: number) => [`${currencySymbol}${val}`, 'Spent']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              {t.noTransactionsYet}
            </div>
          )}
        </div>

      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {language === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}
          </h3>
          <span className="text-xs text-slate-500">
            Showing last {recentTransactions.length} entries
          </span>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      {tx.category}
                      {tx.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 uppercase flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />
                          {tx.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tx.notes || 'No description'} • <span className="text-slate-400">{tx.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.date}</div>
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="px-2 py-1 text-slate-500 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span className="hidden sm:inline text-rose-700 font-semibold">{t.delete}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            {t.noTransactionsYet}
          </div>
        )}
      </div>

    </div>
  );
};
