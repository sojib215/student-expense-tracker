import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = translations[language];

  if (!isOpen) return null;

  const commands = [
    'git init',
    'git add .',
    'git commit -m "Initial commit for Student Expense Tracker"',
    'git branch -M main',
    'git remote add origin https://github.com/YOUR_USERNAME/student-expense-tracker.git',
    'git push -u origin main'
  ];

  const packageJsonScripts = `"scripts": {
  "build": "vite build",
  "deploy": "gh-pages -d dist"
}`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-800 shadow-xl p-6 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-slate-100 text-indigo-600 border border-slate-200">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.githubModalHeader}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these simple steps to push your project to GitHub & get a live link
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-5 text-sm text-slate-700">
          
          {/* Step 1 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              {t.step1}
            </h3>
            <p className="text-xs text-slate-600 mt-1 pl-8">
              Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a> and create a public repository. Do NOT check "Initialize with README".
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-base mb-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">2</span>
              {t.step2}
            </h3>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 relative space-y-1">
              <button
                onClick={() => copyToClipboard(commands.join('\n'), 1)}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 transition"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 1 ? t.copysuccess : 'Copy All'}
              </button>
              {commands.map((cmd, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{cmd}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-base mb-1">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">3</span>
              {t.step3}
            </h3>
            <div className="pl-8 text-xs text-slate-700 space-y-2">
              <p>
                <strong className="text-slate-900">Option A (Vercel / Netlify - Recommended & Fastest):</strong>
                <br />
                Connect your GitHub account to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">Vercel</a> or <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">Netlify</a>, import the repository, and click "Deploy". You get an instant HTTPS live link!
              </p>
              <p>
                <strong className="text-slate-900">Option B (GitHub Pages):</strong>
                <br />
                1. Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 font-mono">npm install -D gh-pages</code>
                <br />
                2. Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 font-mono">npx gh-pages -d dist</code>
                <br />
                3. Go to Repository Settings -&gt; Pages -&gt; select <code className="text-amber-700 font-bold">gh-pages</code> branch.
              </p>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>{t.downloadZipNotice}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-right border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition cursor-pointer shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
