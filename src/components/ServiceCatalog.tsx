import React from 'react';
import { 
  BookOpenCheck, 
  CalendarCheck2, 
  FileWarning, 
  AlertTriangle, 
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

  const renderServiceCard = (service: ServiceItem) => {
    const isTerminOrOther = service.id === 'passport-appointment-only' || service.id === 'other-consular-services';
    const title = lang === 'en' ? service.titleEn : service.titleId;
    const description = lang === 'en' ? service.descriptionEn : service.descriptionId;

    return (
      <div
        key={service.id}
        className="relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-200 p-5 sm:p-6 hover:shadow-card-hover"
      >
        <div>
          {/* Icon & Title in 1 line */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              {getServiceIcon(service.iconName)}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-sunny-navy leading-snug">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {description}
          </p>
        </div>

        {/* Bottom Action Button */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          {/* Trigger Button */}
          <button
            onClick={() => onSelectService(service)}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isTerminOrOther
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow active:scale-98'
                : 'bg-sunny-navy hover:bg-sunny-navyDark text-white shadow-xs hover:shadow active:scale-98'
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
              renderServiceCard(service)
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
              renderServiceCard(service)
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
