import React, { useState } from 'react';
import { AlertTriangle, X, Calendar, Clock } from 'lucide-react';
import { ApplicationRecord, Language } from '../types';
import { translations } from '../data/translations';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationRecord | null;
  lang: Language;
  onConfirmCancel: (applicationId: string, reason: string) => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  onClose,
  application,
  lang,
  onConfirmCancel
}) => {
  const t = translations[lang];

  const reasons = [
    t.cancelModal.reason1,
    t.cancelModal.reason2,
    t.cancelModal.reason3,
    t.cancelModal.reason4
  ];

  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() ? `${selectedReason}: ${customReason.trim()}` : selectedReason;
    onConfirmCancel(application.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-rose-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-100 bg-rose-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.cancelModal.modalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {application.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.cancelModal.warningText}{' '}
            <span className="font-bold text-slate-900">{application.serviceName}</span>:
          </p>

          {/* Appointment detail pill */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>{application.appointmentDate || 'Confirmed Termin'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{application.appointmentTime || '-'}</span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.cancelModal.reasonLabel}
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {reasons.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Additional notes (optional)...' : 'Catatan tambahan (opsional)...'}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-400"
            />
          </div>

          {/* Policy Note */}
          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-relaxed border border-slate-100">
            {t.cancelModal.policyNote}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {t.cancelModal.backBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.cancelModal.confirmBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
