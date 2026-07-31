import React from 'react';
import {
  Wallet,
  Globe,
  Coins,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { Language, CurrencyCode } from '../types';
import { translations } from '../data/translations';
import { currencies } from '../data/initialData';
import { exportAppStateAsJSON, resetAllAppData } from '../utils/storage';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  onOpenQuickAdd: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  onOpenQuickAdd,
  onImportJSON
}) => {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none text-slate-900 flex items-center gap-2">
              {t.appTitle}
            </h1>
            <p className="text-xs text-slate-500 hidden md:block mt-0.5">
              {t.appSubTitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Add Expense Button */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-200 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>{language === 'bn' ? '+ নতুন খরচ যোগ করুন' : '+ Add Expense'}</span>
          </button>

          {/* Currency Selector */}
          <div className="relative flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2 py-1 text-xs sm:text-sm border border-slate-200 transition">
            <Coins className="w-3.5 h-3.5 text-amber-500 mr-1 hidden sm:inline" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-slate-800">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Backup / Export Menu */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={exportAppStateAsJSON}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition shadow-2xs"
              title={t.exportData}
            >
              <Download className="w-4 h-4 text-indigo-600" />
            </button>
            <label
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded cursor-pointer transition shadow-2xs"
              title={t.importData}
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <input
                type="file"
                accept=".json"
                onChange={onImportJSON}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                if (window.confirm(language === 'bn' ? 'আপনি কি সব ডাটা রিসেট করতে চান?' : 'Are you sure you want to reset all data?')) {
                  resetAllAppData();
                }
              }}
              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded transition shadow-2xs"
              title={t.resetData}
            >
              <RotateCcw className="w-4 h-4 text-slate-400 hover:text-rose-600" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
