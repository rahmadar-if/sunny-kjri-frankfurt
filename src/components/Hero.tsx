import React from 'react';
import { Calendar, Search, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeroProps {
  lang: Language;
  onBookClick: () => void;
  onTrackClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onBookClick,
  onTrackClick,
}) => {
  const t = translations[lang];

  return (
    <section 
      className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-top bg-no-repeat bg-cover border-b border-slate-100"
      style={{
        backgroundImage: "url('https://kemlu.go.id/assets/bg-tentang-CK76dm9Q.svg'), url('/bg-kemlu.svg')",
        backgroundColor: '#FCFCFD'
      }}
    >
      {/* Ambient gradient overlay for enhanced readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-[#F8FAFC] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Action-Driven Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-sunny-navy tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {t.hero.titleMain}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunny-gold via-amber-600 to-sunny-goldHover">
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          {t.hero.subtitle}
        </p>

        {/* 2 Main Action Buttons (Minimalist & Direct) */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          
          {/* Button 1: Book Passport Appointment */}
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group active:scale-95 border border-sunny-navy cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-sunny-gold group-hover:scale-110 transition-transform" />
            <span>{t.hero.btnPrimary}</span>
          </button>

          {/* Button 2: Track Application */}
          <button
            onClick={onTrackClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-sunny-navy font-bold text-sm sm:text-base border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>{t.hero.btnSecondary}</span>
          </button>

        </div>

        {/* Redesigned Premium Hero Status Ribbon / Bar */}
        <div className="mt-12 sm:mt-14 max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_-5px_rgba(11,37,69,0.06)] p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              
              {/* Stat 1: Consular Jurisdiction */}
              <div className="p-3.5 sm:px-5 flex items-center gap-3.5 text-left group hover:bg-slate-50/70 rounded-xl transition-colors">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 text-sunny-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <MapPin className="w-5 h-5 text-sunny-goldHover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-sunny-navy leading-none">
                      {t.hero.stat1Number}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100/70 text-amber-900 uppercase tracking-wide">
                      Germany
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium block mt-1 leading-snug">
                    {t.hero.stat1Label}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    HE, BW, BY, NW, RP, SL
                  </span>
                </div>
              </div>

              {/* Stat 2: Counter Session */}
              <div className="p-3.5 sm:px-5 flex items-center gap-3.5 text-left group hover:bg-slate-50/70 rounded-xl transition-colors">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-sunny-navy leading-none">
                      {t.hero.stat2Number}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100/70 text-blue-900 uppercase tracking-wide">
                      Fast Track
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium block mt-1 leading-snug">
                    {t.hero.stat2Label}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Mon – Fri 09:00 – 12:30 CET
                  </span>
                </div>
              </div>

              {/* Stat 3: Digital Transparency */}
              <div className="p-3.5 sm:px-5 flex items-center gap-3.5 text-left group hover:bg-slate-50/70 rounded-xl transition-colors">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-sunny-navy leading-none">
                      {t.hero.stat3Number}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900 uppercase tracking-wide">
                      Verified
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium block mt-1 leading-snug">
                    {t.hero.stat3Label}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Live QR Code & Stepper
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
