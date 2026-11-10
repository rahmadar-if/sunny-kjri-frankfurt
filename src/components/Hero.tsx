import React from 'react';
import { Calendar, Search, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
      {/* Background Subtle Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-amber-100/30 via-slate-100/40 to-blue-50/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700 mb-6 hover:border-sunny-gold/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sunny-navy font-bold">{t.hero.badge}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sunny-gold" />
            KJRI Frankfurt am Main
          </span>
        </div>

        {/* Action-Driven Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-sunny-navy tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {t.hero.titleMain}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunny-gold via-amber-600 to-sunny-goldHover">
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* 2 Main Action Buttons (Minimalist & Direct) */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          
          {/* Button 1: Book Passport Appointment */}
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group active:scale-95 border border-sunny-navy"
          >
            <Calendar className="w-4 h-4 text-sunny-gold group-hover:scale-110 transition-transform" />
            <span>{t.hero.btnPrimary}</span>
          </button>

          {/* Button 2: Track Application */}
          <button
            onClick={onTrackClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-sunny-navy font-bold text-sm sm:text-base border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>{t.hero.btnSecondary}</span>
          </button>

        </div>

        {/* Trust Badges / Stats Cards (Sunny Bento Polish) */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-soft hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-sunny-gold flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="font-extrabold text-xl text-sunny-navy">
              {t.hero.stat1Number}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {t.hero.stat1Label}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-soft hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div className="font-extrabold text-xl text-sunny-navy">
              {t.hero.stat2Number}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {t.hero.stat2Label}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-soft hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="font-extrabold text-xl text-sunny-navy">
              {t.hero.stat3Number}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {t.hero.stat3Label}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
