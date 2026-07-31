import React, { useState } from 'react';
import { HandCoins, Plus, CheckCircle, Clock, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DebtItem, Language } from '../types';
import { translations } from '../data/translations';

interface DebtsViewProps {
  debts: DebtItem[];
  currencySymbol: string;
  language: Language;
  onAddDebt: (debt: Omit<DebtItem, 'id' | 'isSettled' | 'createdAt'>) => void;
  onToggleSettled: (id: string) => void;
  onDeleteDebt: (id: string) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  currencySymbol,
  language,
  onAddDebt,
  onToggleSettled,
  onDeleteDebt
}) => {
  const t = translations[language];

  const [personName, setPersonName] = useState('');
  const [type, setType] = useState<'owe' | 'owed'>('owe');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || !personName) return;

    onAddDebt({
      personName: personName.trim(),
      type,
      amount: amt,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined
    });

    setPersonName('');
    setAmount('');
    setDueDate('');
    setNotes('');
  };

  const totalIOwe = debts
    .filter((d) => d.type === 'owe' && !d.isSettled)
    .reduce((acc, d) => acc + d.amount, 0);

  const totalTheyOwe = debts
    .filter((d) => d.type === 'owed' && !d.isSettled)
    .reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Money I Owe */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {t.iOwe}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
              {currencySymbol}{totalIOwe.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Total active pending debts</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Money Owed to Me */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {t.theyOwe}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
              {currencySymbol}{totalTheyOwe.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Total money friends owe you</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-amber-600" />
            {t.debtTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of who owes you money and whom you need to repay
          </p>
        </div>

        {/* Add Record Form */}
        <form onSubmit={handleFormSubmit} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.type} *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold cursor-pointer"
              >
                <option value="owe">I Owe (দেনা)</option>
                <option value="owed">They Owe Me (পাওনা)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.personName} *</label>
              <input
                type="text"
                required
                placeholder="e.g. Siam, Canteen Mama..."
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.amount} ({currencySymbol}) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.dueDate}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold text-xs mb-1">{t.notes}</label>
            <input
              type="text"
              placeholder="e.g. Print cost, Tea treat, Wifi share..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.addDebt}
          </button>
        </form>

        {/* Debt List */}
        <div className="space-y-2">
          {debts.map((d) => (
            <div
              key={d.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition gap-3 ${
                d.isSettled
                  ? 'bg-slate-50/40 border-slate-200/60 opacity-60'
                  : 'bg-slate-50/70 border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    d.type === 'owe'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}
                >
                  <HandCoins className="w-5 h-5" />
                </div>

                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {d.personName}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        d.type === 'owe'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {d.type === 'owe' ? 'I Owe' : 'Owed to Me'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {d.notes || 'No notes'} {d.dueDate && `• Due: ${d.dueDate}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-left sm:text-right">
                  <div
                    className={`font-bold text-base ${
                      d.type === 'owe' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {currencySymbol}{d.amount.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSettled(d.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                      d.isSettled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.isSettled ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {d.isSettled ? t.settled : t.markSettled}
                  </button>

                  <button
                    onClick={() => onDeleteDebt(d.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
