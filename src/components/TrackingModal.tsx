import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  Copy, 
  Check, 
  Printer,
  CalendarCheck
} from 'lucide-react';
import { Language, ApplicationRecord, ApplicationStatus } from '../types';
import { translations } from '../data/translations';

interface TrackingModalProps {
  lang: Language;
  application: ApplicationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenETicket?: (app: ApplicationRecord) => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  lang,
  application,
  isOpen,
  onClose,
  onOpenETicket,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = translations[lang];

  if (!isOpen || !application) return null;

  const copyRefCode = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stages: { key: ApplicationStatus; label: string; desc: string }[] = [
    {
      key: 'submitted',
      label: t.tracker.step1,
      desc: lang === 'en' ? 'Online application & documents submitted' : 'Formulir & berkas online diterima sistem'
    },
    {
      key: 'verified',
      label: t.tracker.step2,
      desc: lang === 'en' ? 'Requirements inspected by consular staff' : 'Berkas diverifikasi lengkap oleh petugas'
    },
    {
      key: 'appointment_ready',
      label: t.tracker.step3,
      desc: lang === 'en' ? 'Biometrics & facial photograph session' : 'Sesi foto biometrik & sidik jari di loket'
    },
    {
      key: 'in_production',
      label: t.tracker.step4,
      desc: lang === 'en' ? 'Immigration chip encoding & laser printing' : 'Pencetakan fisik & encoding chip paspor'
    },
    {
      key: 'ready_for_pickup',
      label: t.tracker.step5,
      desc: lang === 'en' ? 'Ready at reception or sent by DHL post' : 'Paspor siap diambil di KJRI / dikirim via pos'
    }
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted': return 0;
      case 'verified': return 1;
      case 'appointment_ready': return 2;
      case 'in_production': return 3;
      case 'ready_for_pickup': return 4;
      default: return 0;
    }
  };

  const currentIdx = getStageIndex(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sunny-gold block">
              {t.tracker.modalTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-xl text-sunny-navy font-mono">
                {application.id}
              </span>
              <button
                onClick={copyRefCode}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Copy reference code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Applicant Meta Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.tracker.applicantLabel}</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">{application.applicantName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.tracker.serviceLabel}</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{application.serviceName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Document</span>
              <span className="font-semibold text-slate-800 capitalize">
                {application.passportType === 'electronic' ? 'E-Paspor 48 Hlm' : 'Paspor Reguler'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission</span>
              <span className="font-semibold text-slate-800">{application.submissionDate}</span>
            </div>
          </div>

          {/* 5-Stage Stepper Component */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Lifecycle Progress
            </h4>
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isUpcoming = idx > currentIdx;

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    {/* Stepper Node Circle */}
                    <div className="absolute -left-6 sm:-left-8 top-0.5 flex items-center justify-center">
                      {isPassed ? (
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-emerald-50">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-sunny-navy text-sunny-gold flex items-center justify-center ring-4 ring-amber-100 animate-pulse">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-300 flex items-center justify-center" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          isCurrent ? 'text-sunny-navy' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointment Information Card if exists */}
          {application.appointmentDate && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    {t.tracker.appointmentInfo}
                  </div>
                  <div className="font-extrabold text-sm text-sunny-navy mt-0.5">
                    {application.appointmentDate} • {application.appointmentTime}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {t.tracker.locationInfo}
                  </div>
                </div>
              </div>
              
              {onOpenETicket && (
                <button
                  onClick={() => onOpenETicket(application)}
                  className="px-3 py-2 rounded-xl bg-sunny-navy text-white text-xs font-bold hover:bg-sunny-navyDark transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <Printer className="w-3.5 h-3.5 text-sunny-gold" />
                  <span>View E-Ticket</span>
                </button>
              )}
            </div>
          )}

          {/* Consular Notes */}
          {application.notes && (
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3">
              <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-0.5">
                  {t.tracker.notesLabel}:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {application.notes}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
          >
            {t.tracker.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
