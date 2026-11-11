import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  Copy, 
  Check, 
  Printer,
  CalendarCheck,
  Truck,
  Package,
  ExternalLink,
  ChevronRight,
  Sparkles
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
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDhl, setCopiedDhl] = useState(false);
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus>(application?.status || 'verified');
  const t = translations[lang];

  React.useEffect(() => {
    if (application) {
      setActiveStatus(application.status);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const copyRefCode = () => {
    navigator.clipboard.writeText(application.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyDhlNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedDhl(true);
    setTimeout(() => setCopiedDhl(false), 2000);
  };

  const dhlTrackingNo = application.dhlTrackingNumber || `JJD0003948192847DE`;

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
      label: lang === 'en' ? 'Ready for Collection / Dispatched via DHL' : 'Paspor Siap Diambil / Dikirim via DHL',
      desc: lang === 'en' ? 'Ready at reception or sent by DHL post (Einschreiben)' : 'Paspor siap diambil di KJRI / dikirim via pos tercatat DHL'
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

  const currentIdx = getStageIndex(activeStatus);
  const showDhlSection = activeStatus === 'in_production' || activeStatus === 'ready_for_pickup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92dvh] animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sunny-gold block">
              {t.tracker.modalTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-lg sm:text-xl text-sunny-navy font-mono">
                {application.id}
              </span>
              <button
                onClick={copyRefCode}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Copy reference code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Stage Switcher Pill Bar (Convenient for Presales Presentations) */}
        <div className="px-4 sm:px-6 py-2 bg-amber-50/60 border-b border-amber-200/50 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulasi Tahapan:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {(['submitted', 'verified', 'appointment_ready', 'in_production', 'ready_for_pickup'] as ApplicationStatus[]).map((s, idx) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveStatus(s)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap text-[10px] sm:text-[11px] ${
                  activeStatus === s
                    ? 'bg-sunny-navy text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-amber-200/60'
                }`}
              >
                {idx + 1}. {s === 'ready_for_pickup' ? 'Dispatched DHL 🚚' : s === 'in_production' ? 'In Production' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
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
                        {stage.key === 'ready_for_pickup' && (isCurrent || isPassed) && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <Truck className="w-3 h-3 text-emerald-600" />
                            <span>DHL Post Active</span>
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

          {/* DEDICATED DHL TRACKING CARD (Shown at end stages: Production & Dispatched) */}
          {showDhlSection && (
            <div className="rounded-2xl border-2 border-[#FFCC00] bg-gradient-to-br from-[#FFFDF0] via-white to-[#FFFBEA] p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* DHL Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-amber-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="px-3 py-1 bg-[#FFCC00] text-[#D40511] font-black text-sm tracking-widest rounded-lg shadow-xs flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#D40511]" />
                    <span>DHL</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      DHL Paket &bull; Deutsche Post Einschreiben
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Layanan Pengiriman Resmi Dokumen Paspor
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{activeStatus === 'ready_for_pickup' ? 'Out for Delivery / Dalam Pengantaran' : 'Waybill Diterbitkan'}</span>
                  </span>
                </div>
              </div>

              {/* Waybill Tracking Code & Carrier Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-amber-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Resi DHL / Shipment Number</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-extrabold text-sm text-slate-900 tracking-wider">
                      {dhlTrackingNo}
                    </span>
                    <button
                      onClick={() => copyDhlNumber(dhlTrackingNo)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Salin nomor resi DHL"
                    >
                      {copiedDhl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimasi Waktu Tiba</span>
                  <span className="font-bold text-emerald-700 text-xs mt-0.5 block">
                    1 &ndash; 2 Hari Kerja (Next Business Day Delivery)
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-6 text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700">Asal Kirim:</span> KJRI Frankfurt, Zeppelinallee 23
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Tujuan:</span> {application.germanAddress || 'Hessen / Germany'}
                  </div>
                </div>
              </div>

              {/* DHL Checkpoints Timeline */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Riwayat Perjalanan Paket (DHL Checkpoints)
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-800">Paket dalam perjalanan pengantaran kurir DHL ke alamat penerima</span>
                        <span className="text-[10px] text-slate-400 font-mono">08:30 CET</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">Frankfurt am Main Zustellbasis &bull; Kurir sedang menuju lokasi</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium text-slate-700">Tiba dan diproses di Pusat Sortir Paket DHL Paketzentrum</span>
                        <span className="text-[10px] text-slate-400 font-mono">Kemarin 17:45</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">Hub Logistik DHL Obertshausen / Frankfurt</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium text-slate-700">Paket paspor diserahkan staf konsuler KJRI Frankfurt ke kurir DHL</span>
                        <span className="text-[10px] text-slate-400 font-mono">Kemarin 14:15</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">Loket Konsuler KJRI Frankfurt (Einschreiben Tercatat)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button to Official DHL Portal */}
              <div className="pt-1">
                <a
                  href={`https://www.dhl.de/en/privatkunden/dhl-sendungsverfolgung.html?piececode=${dhlTrackingNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D40511] hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4 text-white" />
                  <span>Lacak Langsung di Portal Resmi DHL.de</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </div>

            </div>
          )}

          {/* Appointment Information Card if exists */}
          {application.appointmentDate && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-amber-950 uppercase tracking-wide">
                    {t.tracker.appointmentInfo}
                  </div>
                  <div className="font-extrabold text-xs sm:text-sm text-sunny-navy mt-0.5">
                    {application.appointmentDate} • {application.appointmentTime}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{t.tracker.locationInfo}</span>
                  </div>
                </div>
              </div>
              
              {onOpenETicket && (
                <button
                  onClick={() => onOpenETicket(application)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-sunny-navy text-white text-xs font-bold hover:bg-sunny-navyDark transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            {t.tracker.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
