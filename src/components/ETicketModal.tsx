import React from 'react';
import { 
  X, 
  Printer, 
  MapPin, 
  Calendar, 
  CheckSquare, 
  CreditCard
} from 'lucide-react';
import { Language, ApplicationRecord } from '../types';
import { translations } from '../data/translations';

interface ETicketModalProps {
  lang: Language;
  application: ApplicationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({
  lang,
  application,
  isOpen,
  onClose,
}) => {
  const t = translations[lang];

  if (!isOpen || !application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92dvh] animate-modal-enter relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-white text-slate-800 flex-1">
          
          {/* Top QR & Reference Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-1">
            <div className="flex-1 min-w-0 pr-0 sm:pr-2">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                {t.eticket.bookingRef}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-sunny-navy font-mono tracking-tight block">
                {application.id}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.eticket.qrInstruction}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex-shrink-0">
              <img
                src={application.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${application.id}`}
                alt="Termin QR Code"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            </div>
          </div>

          {/* Key Appointment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.eticket.applicant}</span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{application.applicantName}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Document Choice</span>
              <span className="font-bold text-sunny-navy text-xs">
                {application.passportType === 'electronic' 
                  ? (lang === 'id' ? 'Paspor Elektronik (E-Paspor)' : 'Electronic Passport (E-Paspor)') 
                  : (lang === 'id' ? 'Paspor Biasa' : 'Ordinary Passport')}
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.eticket.appointmentTime}</span>
                <span className="font-extrabold text-sunny-navy text-xs sm:text-sm">
                  {application.appointmentDate} • {application.appointmentTime}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Chancery Location</span>
                <span className="font-semibold text-slate-700 text-xs leading-snug">
                  {t.eticket.location}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist of Hardcopies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              {t.eticket.checklistTitle}
            </h4>
            <ul className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span>Original Current / Old Passport (Paspor Asli)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span>Original German Residence Card (Aufenthaltstitel) or Visa</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span>Original Proof of German Residence (Meldebescheinigung)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span>Printout of Peduli WNI email confirmation</span>
              </li>
              {application.serviceId === 'passport-lost' && (
                <li className="flex items-center gap-2 text-rose-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
                  <span>Original German Police Loss Report (Verlustanzeige)</span>
                </li>
              )}
            </ul>
          </div>

          {/* Payment Notice Banner */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2 text-xs">
            <CreditCard className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 block">
                {t.eticket.feeNoteTitle}
              </span>
              <span className="text-amber-900 leading-snug block mt-0.5 text-[11px]">
                {t.eticket.feeNoteDesc}
              </span>
            </div>
          </div>

        </div>

        {/* Action Footer - Mobile Optimized (Stacked on small screens) */}
        <div className="p-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors text-center cursor-pointer"
          >
            {t.eticket.btnDone}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sunny-gold" />
            <span>{t.eticket.btnPrint}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
