import React, { useState } from 'react';
import { Sparkles, Bot, Lightbulb, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Transaction, CategoryBudget, Language } from '../types';
import { translations } from '../data/translations';

interface AIAdvisorViewProps {
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  totalIncome: number;
  totalExpense: number;
  remainingBalance: number;
  currencySymbol: string;
  language: Language;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  transactions,
  totalIncome,
  totalExpense,
  remainingBalance,
  currencySymbol,
  language
}) => {
  const t = translations[language];

  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Group expenses by category
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
    });

  const handleFetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: totalIncome,
          totalExpense,
          remainingBudget: remainingBalance,
          categoryExpenses,
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAdvice(data.advice);
      } else {
        throw new Error('Server error');
      }
    } catch (e) {
      // Offline fallback rule-based advisor for GitHub Pages or offline execution
      const foodExpense = categoryExpenses['Food & Mess'] || 0;
      const snacksExpense = categoryExpenses['Snacks & Hangout'] || 0;

      if (language === 'bn') {
        setAdvice(`
💡 **স্মার্ট স্টুডেন্ট ফাইন্যান্সিয়াল টিপস:**
1. **মেস ও স্ন্যাকস খরচ নিয়ন্ত্রণ:** আপনার স্ন্যাকস ও বাইরে খাওয়ার খরচ মোট বাজেটের বেশ বড় অংশ দখল করছে। বন্ধুরা মিলে ক্যাফেতে প্রতিদিন না গিয়ে ক্যাম্পাসের ক্যান্টিন বেছে নিলে মাসে ৳৬০০-১০০০ বাঁচানো সম্ভব।
2. **বুকস ও পিডিএফ স্টাডি:** নতুন বই কেনার বদলে লাইব্রেরি বা সিনিয়রদের থেকে ধার নেয়া বই এবং ডিজিটাল পিডিএফ নোটস ব্যবহার করলে পকেটমানির অনেকটাই সেভ হবে।
3. **জরুরি সেভিংস জার:** প্রতি মাসে পকেটমানি পাওয়ার সাথে সাথে অন্তত ১০% টাকা (৳৫০০-৮০০) আপনার সেভিংস জারে আগে আলাদা করে সরিয়ে রাখুন।
        `);
      } else {
        setAdvice(`
💡 **Smart Student Money Tips:**
1. **Mess & Snacks Control:** Snacks & hangout expenses are consuming a significant chunk. Prefer campus canteen tea/singara over cafes to save 500-1000/month.
2. **Academic & Book Borrowing:** Borrow reference books from library or seniors instead of buying new ones.
3. **Pay Yourself First:** Set aside 10% of your allowance immediately in your Savings Jar before spending!
        `);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {t.aiAdvisorTitle}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini Powered
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.aiSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchAdvice}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
          <span>{loading ? t.analyzing : t.generateAdvice}</span>
        </button>
      </div>

      {/* Financial Health Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Monthly Allowance:</span>
          <div className="font-bold text-emerald-600 text-base mt-0.5">
            {currencySymbol}{totalIncome.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Total Spent:</span>
          <div className="font-bold text-rose-600 text-base mt-0.5">
            {currencySymbol}{totalExpense.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Net Remaining:</span>
          <div className="font-bold text-indigo-600 text-base mt-0.5">
            {currencySymbol}{remainingBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Advice Display Area */}
      {advice ? (
        <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-200 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm border-b border-indigo-100 pb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>AI Student Mentor Analysis</span>
          </div>
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
            {advice}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <Bot className="w-10 h-10 text-indigo-600 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-slate-900">
            Ready for your personalized financial advice?
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the button above to analyze your monthly income, category spending, and mess expenses for instant money-saving recommendations!
          </p>
        </div>
      )}

    </div>
  );
};
