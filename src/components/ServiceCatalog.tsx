import React from 'react';
import { 
  BookOpenCheck, 
  CalendarCheck2, 
  FileWarning, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Euro,
  Clock
} from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { translations } from '../data/translations';
import { servicesData } from '../data/services';

interface ServiceCatalogProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  lang,
  onSelectService,
}) => {
  const t = translations[lang];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-6 h-6 text-sunny-navy" />;
      case 'CalendarCheck2':
        return <CalendarCheck2 className="w-6 h-6 text-sunny-goldHover" />;
      case 'FileWarning':
        return <FileWarning className="w-6 h-6 text-amber-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      default:
        return <BookOpenCheck className="w-6 h-6 text-sunny-navy" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sunny-navy text-xs font-bold tracking-wide uppercase mb-3">
            {t.services.sectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-sunny-navy tracking-tight">
            {t.services.sectionTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.services.sectionSubtitle}
          </p>
        </div>

        {/* 4 Bento Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {servicesData.map((service) => {
            const isPopular = service.id === 'passport-expired';
            const isTerminOnly = service.id === 'passport-appointment-only';
            const title = lang === 'en' ? service.titleEn : service.titleId;
            const tag = lang === 'en' ? service.tagEn : service.tagId;
            const description = lang === 'en' ? service.descriptionEn : service.descriptionId;
            const duration = lang === 'en' ? service.durationEn : service.durationId;
            const requirements = lang === 'en' ? service.requiredDocsEn : service.requiredDocsId;

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 p-6 sm:p-8 hover:shadow-card-hover ${
                  isPopular 
                    ? 'border-sunny-gold/70 ring-1 ring-sunny-gold/20 shadow-soft' 
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Popular Ribbon Tag */}
                {isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-sunny-gold to-amber-500 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-sm">
                    ★ {t.services.popularBadge}
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon & Tag */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      {tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-sunny-navy mb-2">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {description}
                  </p>

                  {/* Key Requirements List */}
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 mb-6">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      {t.services.requirementsHeading}
                    </div>
                    <ul className="space-y-2">
                      {requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                      {requirements.length > 3 && (
                        <li className="text-[11px] text-slate-400 italic pl-5">
                          + {requirements.length - 3} {lang === 'en' ? 'additional requirements' : 'syarat tambahan'}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom Meta & Action Button */}
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    {/* Fee */}
                    <div className="flex items-center gap-1.5">
                      <Euro className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-[11px] text-slate-400 block -mb-0.5">
                          {t.services.feeLabel}
                        </span>
                        <span className="text-base font-extrabold text-sunny-navy">
                          {service.feeEur === 0 ? t.services.freeFee : `€ ${service.feeEur}`}
                        </span>
                      </div>
                    </div>

                    {/* Processing Duration */}
                    <div className="flex items-center gap-1.5 text-right">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-[11px] text-slate-400 block -mb-0.5">
                          {t.services.durationLabel}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <button
                    onClick={() => onSelectService(service)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-sunny-navy hover:bg-sunny-navyDark text-white shadow-sm hover:shadow active:scale-98'
                        : isTerminOnly
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow active:scale-98'
                        : 'bg-slate-100 hover:bg-sunny-navy hover:text-white text-slate-800 active:scale-98'
                    }`}
                  >
                    <span>
                      {isTerminOnly ? t.services.bookTerminBtn : t.services.applyBtn}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
