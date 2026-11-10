import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Calendar as CalendarIcon, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ServiceItem, ApplicationRecord } from '../types';
import { translations } from '../data/translations';
import { availableTimeSlots } from '../data/mockData';

interface WizardModalProps {
  lang: Language;
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newRecord: ApplicationRecord) => void;
  currentUser: { name: string; email: string } | null;
}

export const WizardModal: React.FC<WizardModalProps> = ({
  lang,
  service,
  isOpen,
  onClose,
  onSubmitSuccess,
  currentUser,
}) => {
  const t = translations[lang];

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form Data
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [nik, setNik] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [germanAddress, setGermanAddress] = useState('');
  const [passportType, setPassportType] = useState<'electronic' | 'ordinary'>('electronic');

  // Step 2 Form Data
  const [peduliWniChecked, setPeduliWniChecked] = useState(true);
  const [peduliWniRef, setPeduliWniRef] = useState('PWNI-FRA-9921');
  const [policeReportNo, setPoliceReportNo] = useState('');
  const [damageExplanation, setDamageExplanation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({
    'old_passport': 'paspor_lama_scan.pdf',
    'residence_permit': 'aufenthaltstitel_karte.jpg',
    'meldebescheinigung': 'meldebescheinigung_frankfurt.pdf'
  });

  // Step 3 Calendar & Slot Data
  const [selectedDate, setSelectedDate] = useState('2026-11-18');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 10:30 CET');

  // Validation Error
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !service) return null;

  // Auto-fill dummy data for quick demo testing
  const handleAutoFill = () => {
    setFullName('Budi Santoso');
    setNik('3273012304910002');
    setPassportNumber('B8291048');
    setEmail('budi.santoso@example.de');
    setPhone('+49 176 12345678');
    setGermanAddress('Mainzer Landstraße 182, 60327 Frankfurt am Main');
    setPeduliWniChecked(true);
    setPeduliWniRef('PWNI-FRA-2026-7819');
    setPoliceReportNo('POL-FFM-2026-004812');
    setDamageExplanation('Halaman tanda tangan paspor robek sebagian karena tersangkut koper.');
    setUploadedFiles({
      'old_passport': 'paspor_lama_budi.pdf',
      'residence_permit': 'aufenthaltstitel_budi.jpg',
      'meldebescheinigung': 'meldebescheinigung_ffm.pdf',
      'police_loss_doc': 'polizei_verlustanzeige.pdf',
      'damage_photo': 'foto_kerusakan_paspor.jpg'
    });
    setValidationError('');
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setValidationError(lang === 'en' ? 'Please fill in all required identity fields.' : 'Mohon lengkapi seluruh data identitas wajib.');
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    if (!peduliWniChecked) {
      setValidationError(lang === 'en' ? 'You must confirm Peduli WNI registration.' : 'Wajib konfirmasi lapor diri di Portal Peduli WNI.');
      return;
    }
    if (service.id === 'passport-lost' && !policeReportNo.trim()) {
      setValidationError(lang === 'en' ? 'Please provide the German police report number (Verlustanzeige).' : 'Mohon masukkan nomor surat kehilangan kepolisian Jerman.');
      return;
    }
    setValidationError('');
    setCurrentStep(3);
  };

  // Final Submit
  const handleFinalSubmit = () => {
    if (!selectedDate || !selectedSlot) {
      setValidationError(lang === 'en' ? 'Please select your appointment date and time slot.' : 'Mohon pilih tanggal dan slot jam janji temu.');
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const uniqueId = `FRA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = service.id === 'passport-appointment-only' ? 0 : passportType === 'electronic' ? 65 : 25;

    const newRecord: ApplicationRecord = {
      id: uniqueId,
      serviceId: service.id,
      serviceName: lang === 'en' ? service.titleEn : service.titleId,
      applicantName: fullName,
      nik: nik || '3273012304910002',
      passportNumber: passportNumber || 'B8291048',
      email: email,
      phone: phone,
      germanAddress: germanAddress || 'Zeppelinallee 23, 60325 Frankfurt',
      passportType: passportType,
      status: 'verified',
      submissionDate: new Date().toISOString().split('T')[0],
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      notes: lang === 'en' 
        ? 'Documents preliminary verified. Please bring original physical copies to your consular appointment.' 
        : 'Berkas telah diverifikasi lengkap. Harap bawa fisik dokumen asli saat hadir di loket konsuler.',
      feePaid: fee,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${uniqueId}`
    };

    onSubmitSuccess(newRecord);
  };

  const simulateFileUpload = (docKey: string, defaultName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docKey]: defaultName
    }));
  };

  // Working day date options (Mon - Fri)
  const availableDates = [
    { date: '2026-11-16', day: 'Monday / Senin' },
    { date: '2026-11-17', day: 'Tuesday / Selasa' },
    { date: '2026-11-18', day: 'Wednesday / Rabu' },
    { date: '2026-11-19', day: 'Thursday / Kamis' },
    { date: '2026-11-20', day: 'Friday / Jumat' },
    { date: '2026-11-23', day: 'Monday / Senin' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sunny-gold block">
              Consular Application Wizard
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-sunny-navy">
              {lang === 'en' ? service.titleEn : service.titleId}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto fill helper for demonstration */}
            <button
              onClick={handleAutoFill}
              type="button"
              className="px-2.5 py-1.5 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-1 transition-all"
              title="Click to quickly fill sample data for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-sunny-goldHover" />
              <span className="hidden sm:inline">{t.wizard.autoFillBtn}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Step Simple Progress Tabs */}
        <div className="px-6 py-3 bg-white border-b border-slate-100">
          <div className="grid grid-cols-3 gap-2">
            
            {/* Step 1 Tab */}
            <div className={`flex items-center gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 1 
                ? 'border-sunny-navy text-sunny-navy' 
                : currentStep > 1 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <span className="truncate">{t.wizard.step1Title}</span>
            </div>

            {/* Step 2 Tab */}
            <div className={`flex items-center gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 2 
                ? 'border-sunny-navy text-sunny-navy' 
                : currentStep > 2 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
              </div>
              <span className="truncate">{t.wizard.step2Title}</span>
            </div>

            {/* Step 3 Tab */}
            <div className={`flex items-center gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 3 
                ? 'border-sunny-navy text-sunny-navy' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                currentStep === 3 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className="truncate">{t.wizard.step3Title}</span>
            </div>

          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Validation Notice if Error */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & CONTACT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.fullName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Budi Santoso"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.nik}
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="3273012304910002"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi.santoso@example.de"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 176 12345678"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.wizard.address}
                </label>
                <input
                  type="text"
                  value={germanAddress}
                  onChange={(e) => setGermanAddress(e.target.value)}
                  placeholder="e.g. Mainzer Landstraße 182, 60327 Frankfurt am Main"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                />
              </div>

              {/* Passport Document Type Selection */}
              {service.id !== 'passport-appointment-only' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {t.wizard.passportType}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      passportType === 'electronic'
                        ? 'border-sunny-navy bg-slate-50/80 ring-1 ring-sunny-navy/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="passportType"
                        checked={passportType === 'electronic'}
                        onChange={() => setPassportType('electronic')}
                        className="mt-0.5 text-sunny-navy focus:ring-sunny-navy"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-sunny-navy block">
                          Electronic Passport (E-Paspor)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          48 Pages with Biometric Chip — € 65
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      passportType === 'ordinary'
                        ? 'border-sunny-navy bg-slate-50/80 ring-1 ring-sunny-navy/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="passportType"
                        checked={passportType === 'ordinary'}
                        onChange={() => setPassportType('ordinary')}
                        className="mt-0.5 text-sunny-navy focus:ring-sunny-navy"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-sunny-navy block">
                          Ordinary Passport (Paspor Biasa)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          48 Standard Pages — € 25
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DOCUMENTS & DYNAMIC REQUIREMENTS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              
              {/* Mandatory Peduli WNI check */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={peduliWniChecked}
                    onChange={(e) => setPeduliWniChecked(e.target.checked)}
                    className="mt-1 rounded text-sunny-navy focus:ring-sunny-navy w-4 h-4"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-amber-950 block">
                      {t.wizard.peduliWniCheck}
                    </span>
                    <span className="text-[11px] text-amber-800 block mt-0.5">
                      Lapor diri is mandatory under Indonesian Consular Regulation.
                    </span>
                  </div>
                </label>
                
                {peduliWniChecked && (
                  <div className="mt-3 pl-7">
                    <input
                      type="text"
                      value={peduliWniRef}
                      onChange={(e) => setPeduliWniRef(e.target.value)}
                      placeholder={t.wizard.peduliWniId}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-amber-300 text-slate-800 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Conditional Lost Passport Fields */}
              {service.id === 'passport-lost' && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>German Police Loss Report Required</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.wizard.policeReportNo} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={policeReportNo}
                      onChange={(e) => setPoliceReportNo(e.target.value)}
                      placeholder="e.g. POL-FFM-2026-004812"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-rose-300 text-slate-800 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Damaged Passport Fields */}
              {service.id === 'passport-damaged' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.damageExplanation}
                  </label>
                  <textarea
                    rows={2}
                    value={damageExplanation}
                    onChange={(e) => setDamageExplanation(e.target.value)}
                    placeholder="Describe how the damage occurred (e.g., torn page, water damage)..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 font-medium"
                  />
                </div>
              )}

              {/* Upload Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {t.wizard.uploadTitle}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    PDF, JPG, PNG (&lt; 5MB)
                  </span>
                </div>

                <div className="space-y-2.5">
                  
                  {/* File 1: Old Passport */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {lang === 'en' ? 'Old Passport (Identity Page)' : 'Paspor Lama (Halaman Data Diri)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {uploadedFiles['old_passport'] || 'Not uploaded yet'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => simulateFileUpload('old_passport', 'paspor_lama_scan.pdf')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadedFiles['old_passport'] ? 'Replace' : 'Upload'}</span>
                    </button>
                  </div>

                  {/* File 2: Residence Permit */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {lang === 'en' ? 'German Residence Title (Aufenthaltstitel)' : 'Izin Tinggal Jerman (Aufenthaltstitel)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {uploadedFiles['residence_permit'] || 'Not uploaded yet'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => simulateFileUpload('residence_permit', 'aufenthaltstitel_karte.jpg')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadedFiles['residence_permit'] ? 'Replace' : 'Upload'}</span>
                    </button>
                  </div>

                  {/* File 3: Meldebescheinigung */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {lang === 'en' ? 'Proof of Residence (Meldebescheinigung)' : 'Bukti Domisili (Meldebescheinigung)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {uploadedFiles['meldebescheinigung'] || 'Not uploaded yet'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => simulateFileUpload('meldebescheinigung', 'meldebescheinigung_frankfurt.pdf')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadedFiles['meldebescheinigung'] ? 'Replace' : 'Upload'}</span>
                    </button>
                  </div>

                  {/* File 4: If Lost Passport */}
                  {service.id === 'passport-lost' && (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/40 text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-4 h-4 text-rose-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">
                            Police Loss Report (Verlustanzeige PDF)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {uploadedFiles['police_loss_doc'] || 'Not uploaded yet'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => simulateFileUpload('police_loss_doc', 'polizei_verlustanzeige.pdf')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{uploadedFiles['police_loss_doc'] ? 'Replace' : 'Upload'}</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CALENDAR & TIME-SLOT APPOINTMENT */}
          {currentStep === 3 && (
            <div className="space-y-5">
              
              {/* Info banner */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600">
                <Info className="w-4 h-4 text-sunny-navy mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.wizard.calendarTitle}
                  </span>
                  <span>{t.wizard.calendarDesc}</span>
                </div>
              </div>

              {/* Date Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t.wizard.selectDate}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.date;
                    return (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => setSelectedDate(item.date)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-sunny-navy bg-slate-50/90 ring-2 ring-sunny-navy/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sunny-navy font-extrabold text-xs sm:text-sm">
                          <CalendarIcon className="w-3.5 h-3.5 text-sunny-goldHover" />
                          <span>{item.date}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                          {item.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Selection Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {t.wizard.selectSlot}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    KJRI Frankfurt Time (CET)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimeSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot;
                    const isFull = idx === 4; // Mock one full slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isFull
                            ? 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-sunny-navy bg-sunny-navy text-white shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className={`w-3 h-3 ${isSelected ? 'text-sunny-gold' : 'text-slate-400'}`} />
                            {slot.replace(' CET', '')}
                          </span>
                        </div>
                        <span className={`text-[10px] block mt-0.5 ${
                          isSelected ? 'text-amber-200' : isFull ? 'text-slate-400' : 'text-emerald-600'
                        }`}>
                          {isFull ? t.wizard.fullyBooked : `4 ${t.wizard.slotsAvailable}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.wizard.prevBtn}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleNextStep1}
              className="px-5 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span>{t.wizard.nextBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNextStep2}
              className="px-5 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span>{lang === 'en' ? 'Continue to Termin' : 'Lanjut ke Jadwal Termin'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ring-2 ring-sunny-gold/40"
            >
              <Check className="w-4 h-4 text-sunny-gold" />
              <span>{t.wizard.submitBtn}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
