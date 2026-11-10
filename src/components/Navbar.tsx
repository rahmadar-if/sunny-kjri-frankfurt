import React from 'react';
import { Globe, User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  currentUser: { name: string; email: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentUser,
  onOpenAuth,
  onSignOut,
  onBookClick,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo & Diplomatic Seal */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sunny-navy flex items-center justify-center p-1.5 sm:p-2 shadow-sm text-sunny-gold group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/90/National_emblem_of_Indonesia_Garuda_Pancasila.svg"
                alt="Garuda Emblem"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-sunny-navy leading-none">
                KJRI <span className="text-sunny-gold">FRANKFURT</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide uppercase mt-0.5 sm:mt-1 hidden sm:block">
                {t.nav.subtitle}
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-sunny-navy transition-colors">
              {t.nav.services}
            </a>
            <a href="#tracker" className="hover:text-sunny-navy transition-colors">
              {t.nav.tracker}
            </a>
            <a href="#faq" className="hover:text-sunny-navy transition-colors">
              {t.nav.faq}
            </a>
            <a href="#contact" className="hover:text-sunny-navy transition-colors">
              {t.nav.contact}
            </a>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-3">
            
            {/* Dual Language Switcher (EN / ID) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => onToggleLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-white text-sunny-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onToggleLang('id')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'id'
                    ? 'bg-white text-sunny-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ID
              </button>
            </div>

            {/* Auth / Profile State */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-sunny-navy truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  title={t.nav.signOut}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sunny-navy hover:bg-slate-100/70 rounded-lg transition-all"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                {t.nav.signIn}
              </button>
            )}

            {/* Primary Action Button (Sunny Style) */}
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all group active:scale-95"
            >
              <span>{t.nav.appointment}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>

        </div>
      </header>
  );
};
