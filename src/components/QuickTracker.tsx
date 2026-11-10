import React, { useState } from 'react';
import { Search, Compass, AlertCircle, FileCheck2 } from 'lucide-react';
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
    <section id="tracker" className="py-12 sm:py-16 bg-[#F8FAFC] scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-sunny-gold flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Compass className="w-6 h-6 text-sunny-goldHover" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sunny-navy tracking-tight">
          {t.tracker.title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t.tracker.subtitle}
        </p>

        {/* Input Form Box */}
        <div className="mt-6 sm:mt-8 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-soft max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={t.tracker.placeholder}
                className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800 transition-all uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>{t.tracker.btnCheck}</span>
            </button>
          </form>

          {/* Error notice if empty or invalid */}
          {errorMsg && (
            <div className="mt-2.5 text-xs text-rose-600 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Active Registry Reference Pills - ONLY SHOWN WHEN USER IS LOGGED IN */}
          {currentUser && (
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-600 animate-fadeIn">
              <span className="flex items-center gap-1 font-semibold text-slate-500 text-[11px] sm:text-xs">
                <FileCheck2 className="w-3.5 h-3.5 text-sunny-navy" />
                {t.tracker.quickRefLabel}
              </span>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-8812')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors flex items-center gap-1 border border-slate-200/80"
              >
                <span>FRA-2026-8812</span>
                <span className="text-[10px] text-amber-700 font-sans font-bold">({lang === 'en' ? 'In Production' : 'Proses Cetak'})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-7731')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors flex items-center gap-1 border border-slate-200/80"
              >
                <span>FRA-2026-7731</span>
                <span className="text-[10px] text-blue-700 font-sans font-bold">({lang === 'en' ? 'Verified' : 'Terverifikasi'})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('FRA-2026-9041')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors flex items-center gap-1 border border-slate-200/80"
              >
                <span>FRA-2026-9041</span>
                <span className="text-[10px] text-emerald-700 font-sans font-bold">({lang === 'en' ? 'Ready' : 'Siap Diambil'})</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
