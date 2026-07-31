import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  Tag
} from 'lucide-react';
import { Transaction, Language } from '../types';
import { translations } from '../data/translations';
import { exportTransactionsToCSV } from '../utils/storage';

interface TransactionsViewProps {
  transactions: Transaction[];
  currencySymbol: string;
  language: Language;
  onOpenQuickAdd: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  currencySymbol,
  language,
  onOpenQuickAdd,
  onDeleteTransaction
}) => {
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      (tx.notes || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.tag || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t.navTransactions}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {filteredTransactions.length} records found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filteredTransactions, currencySymbol)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন খরচ যোগ করুন' : t.addExpense}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes, category, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        {/* Type Filter */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-transparent text-slate-800 w-full focus:outline-none cursor-pointer font-medium"
          >
            <option value="all" className="bg-white text-slate-800">All Types</option>
            <option value="expense" className="bg-white text-slate-800">{t.addExpense}</option>
            <option value="income" className="bg-white text-slate-800">{t.addIncome}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-slate-800 w-full focus:outline-none cursor-pointer font-medium"
          >
            <option value="all" className="bg-white text-slate-800">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white text-slate-800">
                {cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-100 transition gap-3"
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

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div
                    className={`font-bold text-sm sm:text-base ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">{tx.date}</div>
                </div>

                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="px-2.5 py-1 text-slate-500 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-rose-700">{t.delete}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          No matching transactions found. Try adjusting your search query or filters.
        </div>
      )}

    </div>
  );
};
