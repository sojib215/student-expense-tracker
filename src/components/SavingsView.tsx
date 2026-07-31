import React, { useState } from 'react';
import { PiggyBank, Plus, Trophy, Trash2, GraduationCap, Laptop, Compass, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, Language } from '../types';
import { translations } from '../data/translations';

interface SavingsViewProps {
  savings: SavingsGoal[];
  currencySymbol: string;
  language: Language;
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  onAddSavingsMoney: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  savings,
  currencySymbol,
  language,
  onAddGoal,
  onAddSavingsMoney,
  onDeleteGoal
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [iconName, setIconName] = useState('PiggyBank');

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0 || !title) return;

    onAddGoal({
      title: title.trim(),
      targetAmount: target,
      iconName
    });

    setTitle('');
    setTargetAmount('');
  };

  const handleAddMoney = (goal: SavingsGoal) => {
    const deposit = parseFloat(depositAmount);
    if (isNaN(deposit) || deposit <= 0) return;

    const newSaved = goal.currentAmount + deposit;
    onAddSavingsMoney(goal.id, deposit);

    // Trigger celebration confetti if goal completed
    if (newSaved >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setDepositAmount('');
    setSelectedGoalId(null);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-sky-600" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-600" />;
      default: return <PiggyBank className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            {t.savingsTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set student milestone savings jars for fees, laptop, trips & emergency fund
          </p>
        </div>

        {/* Create New Goal Form */}
        <form onSubmit={handleCreateGoal} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Goal Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Exam Fee, Laptop Fund..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.targetAmount} ({currencySymbol}) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Icon Category</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 cursor-pointer font-medium"
              >
                <option value="PiggyBank">Savings Jar 🐖</option>
                <option value="GraduationCap">Academic Fee 🎓</option>
                <option value="Laptop">Gadget / Laptop 💻</option>
                <option value="Compass">Tour / Trip 🧭</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.addGoal}
          </button>
        </form>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savings.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / Math.max(1, g.targetAmount)) * 100));
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <div
                key={g.id}
                className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {renderIcon(g.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{g.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currencySymbol}{g.currentAmount.toLocaleString()} / {currencySymbol}{g.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-500">Progress</span>
                    <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-700'}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Action / Add deposit */}
                {isCompleted ? (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {t.completed}
                  </div>
                ) : (
                  <div>
                    {selectedGoalId === g.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddMoney(g)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedGoalId(g.id)}
                        className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        {t.addSavings}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
