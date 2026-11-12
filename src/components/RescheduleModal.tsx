import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApplicationRecord, Language } from '../types';
import { translations } from '../data/translations';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationRecord | null;
  lang: Language;
  onConfirmReschedule: (applicationId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  application,
  lang,
  onConfirmReschedule
}) => {
  const t = translations[lang];

  // Available sample slots
  const availableDates = [
    { value: '2026-11-24', labelEn: 'Tue, 24 Nov 2026', labelId: 'Sel, 24 Nov 2026', openSlots: 4 },
    { value: '2026-11-25', labelEn: 'Wed, 25 Nov 2026', labelId: 'Rab, 25 Nov 2026', openSlots: 6 },
    { value: '2026-11-26', labelEn: 'Thu, 26 Nov 2026', labelId: 'Kam, 26 Nov 2026', openSlots: 2 },
    { value: '2026-11-27', labelEn: 'Fri, 27 Nov 2026', labelId: 'Jum, 27 Nov 2026', openSlots: 5 },
    { value: '2026-12-01', labelEn: 'Tue, 01 Dec 2026', labelId: 'Sel, 01 Des 2026', openSlots: 8 }
  ];

  const availableTimes = [
    '09:00 - 09:30 CET',
    '09:30 - 10:00 CET',
    '10:00 - 10:30 CET',
    '10:30 - 11:00 CET',
    '11:00 - 11:30 CET',
    '11:30 - 12:00 CET',
    '12:00 - 12:30 CET'
  ];

  const [selectedDate, setSelectedDate] = useState('2026-11-25');
  const [selectedTime, setSelectedTime] = useState('10:00 - 10:30 CET');

  if (!isOpen || !application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReschedule(application.id, selectedDate, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-sunny-navy">
                {t.reschedule.modalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {application.id} • {application.serviceName}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Current Schedule Banner */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">
              {t.reschedule.currentSchedule}
            </span>
            <div className="flex items-center gap-2 mt-1 text-slate-800 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{application.appointmentDate || 'Not Scheduled'} • {application.appointmentTime || '-'}</span>
            </div>
          </div>

          {/* Select New Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.reschedule.selectDate}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableDates.map((d) => {
                const label = lang === 'en' ? d.labelEn : d.labelId;
                const isSelected = selectedDate === d.value;
                return (
                  <button
                    type="button"
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sunny-navy bg-slate-50/80 ring-1 ring-sunny-navy text-sunny-navy font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 text-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sunny-navy" />}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                      {d.openSlots} {lang === 'en' ? 'slots open' : 'slot tersedia'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select New Time Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.reschedule.selectSlot}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTimes.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sunny-navy text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {time.replace(' CET', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Policy Information Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>{t.reschedule.policyNote}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {t.reschedule.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-sunny-navy hover:bg-sunny-navyDark rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {t.reschedule.confirmBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
