import React, { useState } from 'react';
import {
  Utensils,
  ShoppingBag,
  Calculator,
  Receipt,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';
import {
  MessMealRecord,
  MessBazarExpense,
  MessUtilityBill,
  Language
} from '../types';
import { translations } from '../data/translations';

interface MessManagerViewProps {
  messMeals: MessMealRecord[];
  messBazar: MessBazarExpense[];
  messUtilities: MessUtilityBill[];
  currencySymbol: string;
  language: Language;
  onAddMeal: (meal: Omit<MessMealRecord, 'id'>) => void;
  onAddBazar: (bazar: Omit<MessBazarExpense, 'id'>) => void;
  onAddUtility: (utility: Omit<MessUtilityBill, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
  onDeleteBazar: (id: string) => void;
  onToggleUtilityPaid: (id: string) => void;
}

export const MessManagerView: React.FC<MessManagerViewProps> = ({
  messMeals,
  messBazar,
  messUtilities,
  currencySymbol,
  language,
  onAddMeal,
  onAddBazar,
  onAddUtility,
  onDeleteMeal,
  onDeleteBazar,
  onToggleUtilityPaid
}) => {
  const t = translations[language];

  // Forms State
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [sokal, setSokal] = useState(1);
  const [dupur, setDupur] = useState(1);
  const [raat, setRaat] = useState(1);

  const [bazarShopper, setBazarShopper] = useState('');
  const [bazarAmount, setBazarAmount] = useState('');
  const [bazarItems, setBazarItems] = useState('');

  const [utilityTitle, setUtilityTitle] = useState('');
  const [utilityAmount, setUtilityAmount] = useState('');
  const [utilityMembers, setUtilityMembers] = useState(4);

  // Calculations
  const totalMealsCount = messMeals.reduce(
    (acc, m) => acc + (m.sokalCount || 0) + (m.dupurCount || 0) + (m.raatCount || 0),
    0
  );

  const totalBazarCost = messBazar.reduce((acc, b) => acc + b.amount, 0);
  const estimatedMealRate = totalMealsCount > 0 ? totalBazarCost / totalMealsCount : 0;

  // Handlers
  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeal({
      date: mealDate,
      sokalCount: Number(sokal),
      dupurCount: Number(dupur),
      raatCount: Number(raat)
    });
  };

  const handleBazarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(bazarAmount);
    if (isNaN(amt) || amt <= 0 || !bazarShopper) return;

    onAddBazar({
      date: new Date().toISOString().split('T')[0],
      shopperName: bazarShopper.trim(),
      amount: amt,
      items: bazarItems.trim() || 'General Bazar'
    });

    setBazarShopper('');
    setBazarAmount('');
    setBazarItems('');
  };

  const handleUtilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(utilityAmount);
    if (isNaN(amt) || amt <= 0 || !utilityTitle) return;

    onAddUtility({
      title: utilityTitle.trim(),
      amount: amt,
      dueDate: new Date().toISOString().split('T')[0],
      isPaid: false,
      totalMembers: Number(utilityMembers) || 1
    });

    setUtilityTitle('');
    setUtilityAmount('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Dark Accent Featured Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Utensils className="w-4 h-4" />
            {t.messManagerTitle}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? 'মেস ও হোস্টেল মিল রেট ট্র্যাকার' : 'Mess & Hostel Bill Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {t.messSubtitle}
          </p>
        </div>

        {/* Live Meal Rate Badge */}
        <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center shrink-0">
          <span className="text-[11px] text-slate-400 font-medium block uppercase tracking-wider">
            {t.estimatedRate}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
            {currencySymbol}{estimatedMealRate.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ meal</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Total Bazar: {currencySymbol}{totalBazarCost} ÷ {totalMealsCount} meals
          </div>
        </div>
      </div>

      {/* Grid: Meals & Bazar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Meal Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              {t.mealTracker}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Total Meals: {totalMealsCount}
            </span>
          </div>

          {/* Quick Meal Entry Form */}
          <form onSubmit={handleMealSubmit} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.date}</label>
                <input
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.sokal}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={sokal}
                  onChange={(e) => setSokal(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900 font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.dupur}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={dupur}
                  onChange={(e) => setDupur(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900 font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.raat}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={raat}
                  onChange={(e) => setRaat(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900 font-bold text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t.addMeal}
            </button>
          </form>

          {/* Meal List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messMeals.map((m) => {
              const dayTotal = (m.sokalCount || 0) + (m.dupurCount || 0) + (m.raatCount || 0);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs text-slate-800"
                >
                  <div>
                    <span className="font-bold text-slate-900">{m.date}</span>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {t.sokal}: {m.sokalCount} | {t.dupur}: {m.dupurCount} | {t.raat}: {m.raatCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                      {dayTotal} meals
                    </span>
                    <button
                      onClick={() => onDeleteMeal(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Shared Bazar Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              {t.bazarTracker}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Total: {currencySymbol}{totalBazarCost}
            </span>
          </div>

          {/* Quick Bazar Entry Form */}
          <form onSubmit={handleBazarSubmit} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.shopperName} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir, Sojib..."
                  value={bazarShopper}
                  onChange={(e) => setBazarShopper(e.target.value)}
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
                  value={bazarAmount}
                  onChange={(e) => setBazarAmount(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold text-xs mb-1">{t.items}</label>
              <input
                type="text"
                placeholder="e.g. Rice 10kg, Chicken 2kg, Eggs..."
                value={bazarItems}
                onChange={(e) => setBazarItems(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t.addBazar}
            </button>
          </form>

          {/* Bazar Log List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messBazar.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {b.shopperName}
                    <span className="text-[10px] text-slate-400">{b.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.items}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-700 text-sm">
                    {currencySymbol}{b.amount}
                  </span>
                  <button
                    onClick={() => onDeleteBazar(b.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Utility Bills Splitter Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-600" />
              {t.utilityBillSplitter}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Easily divide house rent, maid salary, wifi & gas bills among flatmates
            </p>
          </div>
        </div>

        {/* Add Utility Bill Form */}
        <form onSubmit={handleUtilitySubmit} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Bill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Wifi Internet, Rent, Cook Salary"
              value={utilityTitle}
              onChange={(e) => setUtilityTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Total Bill Amount ({currencySymbol}) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="0.00"
              value={utilityAmount}
              onChange={(e) => setUtilityAmount(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Total Flatmates</label>
            <input
              type="number"
              min="1"
              max="20"
              value={utilityMembers}
              onChange={(e) => setUtilityMembers(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-bold text-center"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t.addUtility}
            </button>
          </div>
        </form>

        {/* Utility Bills List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {messUtilities.map((u) => {
            const perPersonShare = Math.round(u.amount / Math.max(1, u.totalMembers));
            return (
              <div
                key={u.id}
                className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{u.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      Split among {u.totalMembers} members
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleUtilityPaid(u.id)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      u.isPaid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {u.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {u.isPaid ? t.paidStatus : t.unpaidStatus}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Total:</span>
                    <span className="font-bold text-slate-900 ml-1">{currencySymbol}{u.amount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">{t.perPerson}:</span>
                    <span className="font-extrabold text-amber-700 ml-1">{currencySymbol}{perPersonShare}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
