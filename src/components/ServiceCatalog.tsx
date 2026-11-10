import React from 'react';
import { 
  BookOpenCheck, 
  CalendarCheck2, 
  FileWarning, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  FileSpreadsheet
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
        return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sunny-navy" />;
      case 'CalendarCheck2':
        return <CalendarCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-sunny-goldHover" />;
      case 'FileWarning':
        return <FileWarning className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
      default:
        return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sunny-navy" />;
    }
  };

  const passportServices = servicesData.filter(s => 
    ['passport-expired', 'passport-damaged', 'passport-lost'].includes(s.id)
  );
  
  const bottomServices = servicesData.filter(s => 
    ['passport-appointment-only', 'other-consular-services'].includes(s.id)
  );

  const renderServiceCard = (service: ServiceItem, isPopular = false) => {
    const isTerminOrOther = service.id === 'passport-appointment-only' || service.id === 'other-consular-services';
    const title = lang === 'en' ? service.titleEn : service.titleId;
    const tag = lang === 'en' ? service.tagEn : service.tagId;
    const description = lang === 'en' ? service.descriptionEn : service.descriptionId;
    const requirements = lang === 'en' ? service.requiredDocsEn : service.requiredDocsId;

    return (
      <div
        key={service.id}
        className={`relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 p-5 sm:p-6 hover:shadow-card-hover ${
          isPopular 
            ? 'border-sunny-gold/70 ring-1 ring-sunny-gold/20 shadow-soft' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        {/* Popular Ribbon Tag */}
        {isPopular && (
          <div className="absolute -top-3.5 right-5 px-3 py-1 rounded-full bg-gradient-to-r from-sunny-gold to-amber-500 text-white text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase shadow-xs">
            ★ {t.services.popularBadge}
          </div>
        )}

        <div>
          {/* Top Bar: Icon & Tag */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              {getServiceIcon(service.iconName)}
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 truncate">
              {tag}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-base sm:text-lg font-bold text-sunny-navy mb-1.5 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-5 min-h-[36px]">
            {description}
          </p>

          {/* Key Requirements List */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 mb-5">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.services.requirementsHeading}
            </div>
            <ul className="space-y-1.5">
              {requirements.slice(0, 3).map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="pt-3.5 border-t border-slate-100 mt-auto">
          {/* Trigger Button */}
          <button
            onClick={() => onSelectService(service)}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isPopular
                ? 'bg-sunny-navy hover:bg-sunny-navyDark text-white shadow-xs hover:shadow active:scale-98'
                : isTerminOrOther
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow active:scale-98'
                : 'bg-slate-100 hover:bg-sunny-navy hover:text-white text-slate-800 active:scale-98'
            }`}
          >
            <span>
              {service.id === 'passport-appointment-only' ? t.services.bookTerminBtn : t.services.applyBtn}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-y border-slate-100 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sunny-navy text-xs font-bold tracking-wide uppercase mb-3">
            {t.services.sectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-sunny-navy tracking-tight">
            {t.services.sectionTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600">
            {t.services.sectionSubtitle}
          </p>
        </div>

        {/* Line 1: 3 Passport Service Cards */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-sunny-navy" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'en' ? 'Indonesian Passport Services' : 'Pelayanan Paspor Republik Indonesia'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {passportServices.map((service) => 
              renderServiceCard(service, service.id === 'passport-expired')
            )}
          </div>
        </div>

        {/* Line 2: 2 Cards (Consular Appointment & Other Services) */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-sunny-goldHover" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'en' ? 'Appointments & Other Consular Affairs' : 'Reservasi Termin & Pelayanan Konsuler Lainnya'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {bottomServices.map((service) => 
              renderServiceCard(service, false)
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
