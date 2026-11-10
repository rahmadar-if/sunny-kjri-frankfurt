import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface AuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const t = translations[lang];
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name || (isRegister ? 'Pemohon Terdaftar' : 'Budi Santoso'),
      email: email || 'budi.santoso@example.de',
    });
    onClose();
  };

  const handleVerifiedWniLogin = () => {
    onLoginSuccess({
      name: 'Budi Santoso',
      email: 'budi.santoso@example.de',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-sunny-navy">
              {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {t.auth.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Institutional Verified ID Quick Access */}
          <button
            type="button"
            onClick={handleVerifiedWniLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-none hover:shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-sunny-goldHover" />
            <span>{t.auth.demoLoginBtn}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[11px] text-slate-400 uppercase font-semibold absolute">
              or
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@example.de"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 font-medium"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 176 12345678"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.auth.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all mt-4 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>{isRegister ? t.auth.btnSubmitRegister : t.auth.btnSubmitLogin}</span>
              <ArrowRight className="w-4 h-4 text-sunny-gold" />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-slate-600 hover:text-sunny-navy font-semibold transition-colors cursor-pointer"
            >
              {isRegister ? t.auth.toggleToLogin : t.auth.toggleToRegister}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
