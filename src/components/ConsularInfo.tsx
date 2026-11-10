import React from 'react';
import { MapPin, Clock, PhoneCall, Mail, Compass, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ConsularInfoProps {
  lang: Language;
}

export const ConsularInfo: React.FC<ConsularInfoProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-sunny-goldHover text-xs font-bold tracking-wide uppercase mb-3">
            {t.contact.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-sunny-navy tracking-tight">
            {t.contact.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.contact.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-sunny-navy flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sunny-navy mb-1">
                {t.contact.addressTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.contact.addressText}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Zeppelinallee+23,+60325+Frankfurt+am+Main"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-sunny-navy hover:text-sunny-goldHover flex items-center gap-1 transition-colors"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sunny-navy mb-1">
                {t.contact.hoursTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.contact.hoursText}
              </p>
            </div>
            <span className="mt-4 text-[11px] font-semibold text-slate-400">
              Closed on Weekends & Public Holidays
            </span>
          </div>

          {/* Card 3: 24/7 Hotline */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-soft flex flex-col justify-between hover:border-amber-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-amber-950 mb-1">
                {t.contact.hotlineTitle}
              </h3>
              <p className="text-xs font-mono font-bold text-sunny-navy mt-1">
                {t.contact.hotlineText}
              </p>
            </div>
            <a
              href="tel:+491624129044"
              className="mt-4 text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors"
            >
              <span>Call Hotline</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 4: Official Email */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sunny-navy mb-1">
                {t.contact.emailTitle}
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-1 break-all">
                {t.contact.emailText}
              </p>
            </div>
            <a
              href="mailto:konsuler.frankfurt@kemlu.go.id"
              className="mt-4 text-xs font-bold text-sunny-navy hover:text-sunny-goldHover flex items-center gap-1 transition-colors"
            >
              <span>Send Email</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Jurisdiction Banner (Wilayah Kerja Konsuler) */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-sunny-navy flex items-center justify-center flex-shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-sunny-navy uppercase tracking-wider block">
                {t.contact.statesTitle}
              </span>
              <span className="text-xs text-slate-600 mt-0.5 block">
                {t.contact.statesList}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            6 Bundesländer
          </span>
        </div>

      </div>
    </section>
  );
};
