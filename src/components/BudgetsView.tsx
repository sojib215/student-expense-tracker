import React, { useState } from 'react';
import { Target, AlertTriangle, Edit2, Check, Save } from 'lucide-react';
import { CategoryBudget, Transaction, Language, ExpenseCategory } from '../types';
import { translations } from '../data/translations';

interface BudgetsViewProps {
  categoryBudgets: CategoryBudget[];
  transactions: Transaction[];
  currencySymbol: string;
  language: Language;
  onUpdateBudgetLimit: (category: ExpenseCategory, newLimit: number) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  categoryBudgets,
  transactions,
  currencySymbol,
  language,
  onUpdateBudgetLimit
}) => {
  const t = translations[language];

  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editLimitValue, setEditLimitValue] = useState<string>('');

  // Calculate total spent per category
  const categorySpentMap: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpentMap[tx.category] = (categorySpentMap[tx.category] || 0) + tx.amount;
    });

  const handleStartEdit = (b: CategoryBudget) => {
    setEditingCategory(b.category);
    setEditLimitValue(b.limit.toString());
  };

  const handleSaveEdit = (category: ExpenseCategory) => {
    const num = parseFloat(editLimitValue);
    if (!isNaN(num) && num > 0) {
      onUpdateBudgetLimit(category, num);
    }
    setEditingCategory(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          {t.navBudgets}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Set maximum target monthly limits for each student category to avoid overspending
        </p>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryBudgets.map((b) => {
          const spent = categorySpentMap[b.category] || 0;
          const percentage = Math.min(100, Math.round((spent / Math.max(1, b.limit)) * 100));
          const isOverBudget = spent > b.limit;
          const isWarning = percentage >= 75 && !isOverBudget;

          let barColor = 'bg-emerald-500';
          let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

          if (isOverBudget) {
            barColor = 'bg-rose-500';
            badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (isWarning) {
            barColor = 'bg-amber-500';
            badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          const isEditing = editingCategory === b.category;

          return (
            <div
              key={b.category}
              className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3 relative hover:border-slate-300 transition"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{b.category}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Spent: <span className="font-bold text-slate-800">{currencySymbol}{spent.toLocaleString()}</span> of{' '}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editLimitValue}
                        onChange={(e) => setEditLimitValue(e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-900 font-bold inline-block"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bold text-slate-800">{currencySymbol}{b.limit.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(b.category)}
                      className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      title="Save Limit"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(b)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white rounded-lg transition"
                      title="Edit Limit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}>
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, (spent / b.limit) * 100)}%` }}
                />
              </div>

              {/* Status Message */}
              {isOverBudget && (
                <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  Exceeded budget limit by {currencySymbol}{(spent - b.limit).toLocaleString()}!
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
