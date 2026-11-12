import React, { useState } from 'react';
import { Globe, User, LogOut, ArrowRight, Menu, X, Calendar, Compass, HelpCircle, PhoneCall, LayoutDashboard } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  currentUser: { name: string; email: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onBookClick: () => void;
  currentView?: 'landing' | 'dashboard';
  onNavigateView?: (view: 'landing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentUser,
  onOpenAuth,
  onSignOut,
  onBookClick,
  currentView = 'landing',
  onNavigateView,
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileBookClick = () => {
    closeMobileMenu();
    onBookClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
        {/* Brand Logo & Diplomatic Seal */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 sm:gap-3 group" 
          onClick={(e) => {
            closeMobileMenu();
            if (currentView === 'dashboard') {
              e.preventDefault();
              onNavigateView?.('landing');
            }
          }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sunny-navy flex items-center justify-center p-1.5 sm:p-2 shadow-xs text-sunny-gold group-hover:scale-105 transition-transform flex-shrink-0">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a 
            href="#services" 
            onClick={() => {
              if (currentView === 'dashboard') {
                onNavigateView?.('landing');
              }
            }}
            className="hover:text-sunny-navy transition-colors"
          >
            {t.nav.services}
          </a>
          <a 
            href="#tracker" 
            onClick={() => {
              if (currentView === 'dashboard') {
                onNavigateView?.('landing');
              }
            }}
            className="hover:text-sunny-navy transition-colors"
          >
            {t.nav.tracker}
          </a>
          <a 
            href="#faq" 
            onClick={() => {
              if (currentView === 'dashboard') {
                onNavigateView?.('landing');
              }
            }}
            className="hover:text-sunny-navy transition-colors"
          >
            {t.nav.faq}
          </a>
          <a 
            href="#contact" 
            onClick={() => {
              if (currentView === 'dashboard') {
                onNavigateView?.('landing');
              }
            }}
            className="hover:text-sunny-navy transition-colors"
          >
            {t.nav.contact}
          </a>
        </nav>

        {/* Desktop Actions & Utilities */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Dual Language Switcher (EN / ID) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-sunny-navy shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLang('id')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                lang === 'id'
                  ? 'bg-white text-sunny-navy shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ID
            </button>
          </div>

          {/* Auth State */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => onNavigateView?.('dashboard')}
                className="flex flex-col text-right hover:opacity-80 transition-opacity cursor-pointer group"
                title={t.nav.myDashboard}
              >
                <span className="text-xs font-bold text-sunny-navy group-hover:underline truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentUser.email}
                </span>
              </button>
              <button
                onClick={onSignOut}
                title={t.nav.signOut}
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sunny-navy hover:bg-slate-100/70 rounded-lg transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.nav.signIn}</span>
            </button>
          )}

          {/* Primary Action Button (Hidden on My Dashboard as requested) */}
          {currentView !== 'dashboard' && (
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all group active:scale-95 cursor-pointer"
            >
              <span>{t.nav.appointment}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

        </div>

        {/* Mobile Header Right (ONLY LOGO + LOGIN + FLAT BURGER) */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          
          {/* Mobile Login / User Profile Icon */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-slate-100 py-1.5 px-2.5 rounded-xl border border-slate-200/80">
              <button
                onClick={() => onNavigateView?.('dashboard')}
                className="text-xs font-bold text-sunny-navy truncate max-w-[90px] cursor-pointer"
              >
                {currentUser.name.split(' ')[0]}
              </button>
              <button
                onClick={onSignOut}
                title={t.nav.signOut}
                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sunny-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer border border-slate-200/80"
              aria-label="Login"
            >
              <User className="w-3.5 h-3.5 text-sunny-goldHover" />
              <span>{t.nav.signIn}</span>
            </button>
          )}

          {/* Flat Burger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl text-slate-700 hover:text-sunny-navy hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/70"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-sunny-navy" />
            ) : (
              <Menu className="w-5 h-5 text-sunny-navy" />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-5 animate-modal-enter space-y-4">
          
          {/* Dual Language Switcher inside Mobile Menu */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Language / Bahasa:</span>
            </span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                onClick={() => onToggleLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-white text-sunny-navy shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onToggleLang('id')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  lang === 'id'
                    ? 'bg-white text-sunny-navy shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Indonesia
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-1">
            <a
              href="#services"
              onClick={() => {
                closeMobileMenu();
                if (currentView === 'dashboard') {
                  onNavigateView?.('landing');
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-sunny-navy hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-4 h-4 text-sunny-goldHover" />
              <span>{t.nav.services}</span>
            </a>
            <a
              href="#tracker"
              onClick={() => {
                closeMobileMenu();
                if (currentView === 'dashboard') {
                  onNavigateView?.('landing');
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-sunny-navy hover:bg-slate-50 transition-colors"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{t.nav.tracker}</span>
            </a>
            <a
              href="#faq"
              onClick={() => {
                closeMobileMenu();
                if (currentView === 'dashboard') {
                  onNavigateView?.('landing');
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-sunny-navy hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{t.nav.faq}</span>
            </a>
            <a
              href="#contact"
              onClick={() => {
                closeMobileMenu();
                if (currentView === 'dashboard') {
                  onNavigateView?.('landing');
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-sunny-navy hover:bg-slate-50 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{t.nav.contact}</span>
            </a>
          </div>

          {/* Direct CTA inside Mobile Menu (Hidden on Dashboard) */}
          {currentView !== 'dashboard' && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleMobileBookClick}
                className="w-full py-3 px-4 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span>{t.hero.btnPrimary}</span>
                <ArrowRight className="w-4 h-4 text-sunny-gold" />
              </button>
            </div>
          )}

        </div>
      )}

    </header>
  );
};
