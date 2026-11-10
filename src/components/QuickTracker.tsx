import React, { useState } from 'react';
import { Search, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { Language, ApplicationRecord } from '../types';
import { translations } from '../data/translations';

interface QuickTrackerProps {
  lang: Language;
  onSearch: (refCode: string) => void;
  recentApplications: ApplicationRecord[];
  currentUser: { name: string; email: string } | null;
}

export const QuickTracker: React.FC<QuickTrackerProps> = ({
  lang,
  onSearch,
  currentUser,
}) => {
  const t = translations[lang];
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter a booking code or passport number' : 'Mohon masukkan nomor booking atau paspor');
      return;
    }
    setErrorMsg('');
    onSearch(inputVal.trim());
  };

  const handleSampleClick = (code: string) => {
    setInputVal(code);
    setErrorMsg('');
    onSearch(code);
  };

  return (
    <section id="tracker" className="py-16 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-sunny-gold flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Compass className="w-6 h-6 text-sunny-goldHover" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sunny-navy tracking-tight">
          {t.tracker.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          {t.tracker.subtitle}
        </p>

        {/* Input Form Box */}
        <div className="mt-8 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-soft max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={t.tracker.placeholder}
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800 transition-all uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>{t.tracker.btnCheck}</span>
            </button>
          </form>

          {/* Error notice if empty or invalid */}
          {errorMsg && (
            <div className="mt-2 text-xs text-rose-600 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Pill Links - ONLY SHOWN WHEN USER IS LOGGED IN */}
          {currentUser && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 animate-fadeIn">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-sunny-gold" />
                Demo Samples:
              </span>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-8812')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors"
              >
                FRA-2026-8812 (Printing)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-7731')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors"
              >
                FRA-2026-7731 (Verified)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-9041')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors"
              >
                FRA-2026-9041 (Ready)
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
