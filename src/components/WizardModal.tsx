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
  ShieldAlert,
  Trash2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ServiceItem, ApplicationRecord } from '../types';
import { translations } from '../data/translations';
import { availableTimeSlots } from '../data/mockData';

interface UploadedFileMeta {
  name: string;
  size: string;
}

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
  const [otherServiceNote, setOtherServiceNote] = useState('');

  // Step 2 Form Data - INITIALIZED EMPTY (Mandatory files required before proceeding)
  const [peduliWniChecked, setPeduliWniChecked] = useState(false);
  const [peduliWniRef, setPeduliWniRef] = useState('');
  const [policeReportNo, setPoliceReportNo] = useState('');
  const [damageExplanation, setDamageExplanation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: UploadedFileMeta }>({});

  // Step 3 Calendar & Slot Data
  const [selectedDate, setSelectedDate] = useState('2026-11-18');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 10:30 CET');

  // Validation Error
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !service) return null;

  // Real File Upload Handler from Local Storage
  const handleFileSelect = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeInKb = (file.size / 1024).toFixed(0);
      const sizeFormatted = Number(sizeInKb) > 1024 
        ? (Number(sizeInKb) / 1024).toFixed(1) + ' MB' 
        : sizeInKb + ' KB';

      setUploadedFiles(prev => ({
        ...prev,
        [docKey]: {
          name: file.name,
          size: sizeFormatted
        }
      }));
      setValidationError('');
    }
  };

  const handleRemoveFile = (docKey: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });
  };

  // Sync / Pre-fill from Peduli WNI Record (STEP-BY-STEP PER TAB)
  const handleAutoFill = () => {
    if (currentStep === 1) {
      // Step 1: Pre-fill Identity & German Contacts only
      setFullName(currentUser?.name || 'Budi Santoso');
      setNik('3273012304910002');
      setPassportNumber('B8291048');
      setEmail(currentUser?.email || 'budi.santoso@example.de');
      setPhone('+49 176 12345678');
      setGermanAddress('Mainzer Landstraße 182, 60327 Frankfurt am Main');
      if (service.id === 'other-consular-services') {
        setOtherServiceNote('Legalisasi Terjemahan Ijazah & Akta Kelahiran');
      }
      setValidationError('');
    } else if (currentStep === 2) {
      // Step 2: Pre-fill Document Checklist & Peduli WNI only
      setPeduliWniChecked(true);
      setPeduliWniRef('PWNI-FRA-2026-7819');
      setPoliceReportNo('POL-FFM-2026-004812');
      setDamageExplanation('Halaman paspor sobek sebagian karena tersangkut koper.');
      setUploadedFiles({
        'old_passport': { name: 'paspor_lama_budi.pdf', size: '1.2 MB' },
        'residence_permit': { name: 'aufenthaltstitel_budi.jpg', size: '850 KB' },
        'meldebescheinigung': { name: 'meldebescheinigung_ffm.pdf', size: '420 KB' },
        'police_loss_doc': { name: 'polizei_verlustanzeige.pdf', size: '610 KB' },
        'damage_photo': { name: 'foto_kerusakan_paspor.jpg', size: '940 KB' },
        'relevant_doc': { name: 'ijazah_terjemahan_resmi.pdf', size: '1.4 MB' }
      });
      setValidationError('');
    } else if (currentStep === 3) {
      // Step 3: Pre-select available date & slot
      setSelectedDate('2026-11-18');
      setSelectedSlot('10:00 - 10:30 CET');
      setValidationError('');
    }
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setValidationError(lang === 'en' ? 'Please fill in all required identity fields.' : 'Mohon lengkapi seluruh data identitas wajib.');
      return;
    }
    if (service.id === 'other-consular-services' && !otherServiceNote.trim()) {
      setValidationError(lang === 'en' ? 'Please describe your consular service affair / purpose.' : 'Mohon isi rincian keperluan layanan konsuler Anda.');
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  // Step 2 Validation - Enforce Mandatory Documents
  const handleNextStep2 = () => {
    if (!peduliWniChecked) {
      setValidationError(lang === 'en' ? 'You must confirm Peduli WNI registration.' : 'Wajib konfirmasi lapor diri di Portal Peduli WNI.');
      return;
    }

    // Check mandatory uploads according to selected service
    if (service.id === 'passport-expired') {
      if (!uploadedFiles['old_passport'] || !uploadedFiles['residence_permit'] || !uploadedFiles['meldebescheinigung']) {
        setValidationError(
          lang === 'en' 
            ? 'Please upload all mandatory documents (* Mandatory) from your storage before continuing.' 
            : 'Mohon unggah seluruh dokumen wajib (* Wajib) dari perangkat Anda sebelum melanjutkan.'
        );
        return;
      }
    } else if (service.id === 'passport-damaged') {
      if (!uploadedFiles['old_passport'] || !uploadedFiles['residence_permit'] || !uploadedFiles['meldebescheinigung'] || !uploadedFiles['damage_photo']) {
        setValidationError(
          lang === 'en' 
            ? 'Please upload your damaged passport photo and all required identity documents.' 
            : 'Mohon unggah foto paspor rusak dan seluruh dokumen wajib sebelum melanjutkan.'
        );
        return;
      }
      if (!damageExplanation.trim()) {
        setValidationError(
          lang === 'en'
            ? 'Please provide a brief explanation of how the damage occurred.'
            : 'Mohon sertakan penjelasan singkat penyebab kerusakan paspor.'
        );
        return;
      }
    } else if (service.id === 'passport-lost') {
      if (!policeReportNo.trim()) {
        setValidationError(lang === 'en' ? 'Please provide the German police report number (Verlustanzeige).' : 'Mohon masukkan nomor surat kehilangan kepolisian Jerman.');
        return;
      }
      if (!uploadedFiles['police_loss_doc'] || !uploadedFiles['residence_permit'] || !uploadedFiles['meldebescheinigung']) {
        setValidationError(
          lang === 'en' 
            ? 'Please upload the German Police loss report (Verlustanzeige) and your residence documents.' 
            : 'Mohon unggah surat kehilangan dari kepolisian Jerman (Verlustanzeige) dan dokumen izin tinggal Anda.'
        );
        return;
      }
    } else if (service.id === 'other-consular-services') {
      if (!uploadedFiles['relevant_doc'] || !uploadedFiles['residence_permit']) {
        setValidationError(
          lang === 'en'
            ? 'Please upload your relevant document/paperwork and German residence permit.'
            : 'Mohon unggah berkas dokumen terkait dan izin tinggal Jerman Anda.'
        );
        return;
      }
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
    const fee = (service.id === 'passport-appointment-only' || service.id === 'other-consular-services') ? 0 : passportType === 'electronic' ? 65 : 25;

    const computedServiceName = service.id === 'other-consular-services' && otherServiceNote.trim()
      ? `${lang === 'en' ? service.titleEn : service.titleId} — ${otherServiceNote}`
      : lang === 'en' ? service.titleEn : service.titleId;

    const newRecord: ApplicationRecord = {
      id: uniqueId,
      serviceId: service.id,
      serviceName: computedServiceName,
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

  // Working day date options (Mon - Fri)
  const availableDates = [
    { date: '2026-11-16', day: 'Monday / Senin' },
    { date: '2026-11-17', day: 'Tuesday / Selasa' },
    { date: '2026-11-18', day: 'Wednesday / Rabu' },
    { date: '2026-11-19', day: 'Thursday / Kamis' },
    { date: '2026-11-20', day: 'Friday / Jumat' },
    { date: '2026-11-23', day: 'Monday / Senin' },
  ];

  // Render individual document upload row with real file picker & mobile responsiveness
  const renderDocUploadRow = (
    key: string, 
    titleEn: string, 
    titleId: string, 
    isMandatory: boolean,
    subtitle: string
  ) => {
    const uploaded = uploadedFiles[key];
    const title = lang === 'en' ? titleEn : titleId;

    return (
      <div 
        key={key}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
          uploaded 
            ? 'bg-emerald-50/40 border-emerald-200' 
            : 'bg-white border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              uploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {uploaded ? <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                  {title}
                </span>
                {isMandatory ? (
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-wide">
                    {lang === 'en' ? '* Mandatory' : '* Wajib'}
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {lang === 'en' ? 'Optional' : 'Opsional'}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-snug">
                {subtitle}
              </p>

              {/* Uploaded state pill */}
              {uploaded && (
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-emerald-800 truncate max-w-[180px] sm:max-w-[220px]">
                    {uploaded.name}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                    {uploaded.size}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right action button (Native file input) - full width on mobile */}
          <div className="flex items-center gap-2 self-stretch sm:self-center flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {uploaded ? (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <label className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Replace' : 'Ganti'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileSelect(key, e)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(key)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all active:scale-95">
                <Upload className="w-3.5 h-3.5 text-sunny-gold" />
                <span>{lang === 'en' ? 'Upload from Storage' : 'Unggah dari Perangkat'}</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileSelect(key, e)}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[94dvh] animate-modal-enter relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sunny-gold block">
              Consular Application Wizard
            </span>
            <h3 className="font-extrabold text-sm sm:text-lg text-sunny-navy truncate">
              {lang === 'en' ? service.titleEn : service.titleId}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Sync from Peduli WNI (Official & Proper presales naming - Step by Step) */}
            <button
              onClick={handleAutoFill}
              type="button"
              className="px-2.5 py-1.5 rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-950 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
              title="Sync registration data for current step"
            >
              <Sparkles className="w-3.5 h-3.5 text-sunny-goldHover" />
              <span className="hidden sm:inline">
                {currentStep === 1 
                  ? (lang === 'en' ? '⚡ Sync Identity (Step 1)' : '⚡ Sinkronisasi Identitas') 
                  : currentStep === 2 
                  ? (lang === 'en' ? '⚡ Sync Documents (Step 2)' : '⚡ Sinkronisasi Berkas') 
                  : (lang === 'en' ? '⚡ Auto-Select Slot' : '⚡ Pilih Slot Otomatis')}
              </span>
              <span className="sm:hidden">
                {currentStep === 1 ? 'Sync Step 1' : currentStep === 2 ? 'Sync Step 2' : 'Select Slot'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Step Simple Progress Tabs - Mobile Optimized */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center sm:text-left">
            
            {/* Step 1 Tab */}
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 1 
                ? 'border-sunny-navy text-sunny-navy' 
                : currentStep > 1 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] flex-shrink-0 ${
                currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <span className="truncate">{t.wizard.step1Title}</span>
            </div>

            {/* Step 2 Tab */}
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 2 
                ? 'border-sunny-navy text-sunny-navy' 
                : currentStep > 2 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] flex-shrink-0 ${
                currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
              </div>
              <span className="truncate">{t.wizard.step2Title}</span>
            </div>

            {/* Step 3 Tab */}
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 3 
                ? 'border-sunny-navy text-sunny-navy' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] flex-shrink-0 ${
                currentStep === 3 ? 'bg-sunny-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className="truncate">{t.wizard.step3Title}</span>
            </div>

          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          
          {/* Validation Notice if Error */}
          {validationError && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & CONTACT */}
          {currentStep === 1 && (
            <div className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

              {/* If Other Consular Services: Free-text note */}
              {service.id === 'other-consular-services' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Consular Affair / Purpose Details' : 'Rincian Keperluan Pelayanan Konsuler'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={otherServiceNote}
                    onChange={(e) => setOtherServiceNote(e.target.value)}
                    placeholder={lang === 'en' ? 'Describe the service or documents you need (e.g. Document legalization, birth/marriage registration, attestations, consular inquiry)...' : 'Jelaskan keperluan atau dokumen yang ingin Anda urus (contoh: Legalisasi ijazah, pencatatan sipil nikah/lahir, surat keterangan domisili)...'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === 'en' ? 'Provide details so the consular desk can prepare your physical session.' : 'Berikan keterangan agar loket konsuler dapat mempersiapkan berkas Anda.'}
                  </p>
                </div>
              )}

              {/* Passport Document Type Selection (Only for Passport services) */}
              {service.id !== 'passport-appointment-only' && service.id !== 'other-consular-services' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {t.wizard.passportType}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <label className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
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
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">
                          48 Pages with Biometric Chip — € 65
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
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
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">
                          48 Standard Pages — € 25
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DOCUMENTS & DYNAMIC REQUIREMENTS (MANDATORY UPLOADS REQUIRED) */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Mandatory Peduli WNI check */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={peduliWniChecked}
                    onChange={(e) => setPeduliWniChecked(e.target.checked)}
                    className="mt-1 rounded text-sunny-navy focus:ring-sunny-navy w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-amber-950 block">
                      {t.wizard.peduliWniCheck} <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-amber-800 block mt-0.5">
                      Lapor diri is mandatory under Indonesian Consular Regulation.
                    </span>
                  </div>
                </label>
                
                {peduliWniChecked && (
                  <div className="mt-2.5 sm:mt-3 pl-7">
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
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2.5">
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
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.wizard.damageExplanation} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={damageExplanation}
                    onChange={(e) => setDamageExplanation(e.target.value)}
                    placeholder="Describe how the damage occurred (e.g., torn signature page, water damage)..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 font-medium"
                  />
                </div>
              )}

              {/* Upload Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {t.wizard.uploadTitle}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    PDF, JPG, PNG (&lt; 5MB)
                  </span>
                </div>

                <div className="space-y-2.5">
                  
                  {/* File: Relevant Document (if other consular services) */}
                  {service.id === 'other-consular-services' && renderDocUploadRow(
                    'relevant_doc',
                    'Relevant Document / Paperwork to be Processed',
                    'Berkas Dokumen Terkait yang Akan Diproses / Dilegalisasi',
                    true,
                    'Scan or draft of paperwork (e.g. certificate, translation, power of attorney)'
                  )}

                  {/* File 1: Old Passport (if standard passport renewal or damaged) */}
                  {service.id !== 'passport-lost' && service.id !== 'other-consular-services' && service.id !== 'passport-appointment-only' && renderDocUploadRow(
                    'old_passport',
                    'Current / Old Passport (Identity Page)',
                    'Paspor Lama / Saat Ini (Halaman Data)',
                    true,
                    'Scan or clear photo of page 2 & 3 showing full identity'
                  )}

                  {/* File: Damaged Passport Photo (if damaged) */}
                  {service.id === 'passport-damaged' && renderDocUploadRow(
                    'damage_photo',
                    'Photograph of Damaged Passport Section',
                    'Foto Bagian Paspor yang Rusak Fisik',
                    true,
                    'Clear photo displaying torn, burnt, or unreadable pages'
                  )}

                  {/* File: German Police Report (if lost) */}
                  {service.id === 'passport-lost' && renderDocUploadRow(
                    'police_loss_doc',
                    'German Police Loss Report (Verlustanzeige)',
                    'Surat Laporan Kehilangan Polisi Jerman (Verlustanzeige)',
                    true,
                    'Official certificate issued by local German police station'
                  )}

                  {/* File 2: Residence Permit (all services) */}
                  {renderDocUploadRow(
                    'residence_permit',
                    'German Residence Title (Aufenthaltstitel / Visa)',
                    'Izin Tinggal Jerman (Aufenthaltstitel / Visa)',
                    true,
                    'Front and back copy of valid electronic residence card (eAT)'
                  )}

                  {/* File 3: Meldebescheinigung (all services) */}
                  {renderDocUploadRow(
                    'meldebescheinigung',
                    'Proof of German Residence (Meldebescheinigung)',
                    'Surat Keterangan Domisili Jerman (Meldebescheinigung)',
                    true,
                    'Issued by Bürgeramt in Hessen, Bayern, BW, NRW, RP, or Saarland'
                  )}

                  {/* Optional Old Passport Copy (if lost) */}
                  {service.id === 'passport-lost' && renderDocUploadRow(
                    'old_passport_copy',
                    'Copy of Lost Passport (If available)',
                    'Salinan Paspor yang Hilang (Jika ada)',
                    false,
                    'Optional scan or copy to expedite verification'
                  )}

                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CALENDAR & TIME-SLOT APPOINTMENT */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Info banner */}
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600">
                <Info className="w-4 h-4 text-sunny-navy mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.wizard.calendarTitle}
                  </span>
                  <span className="text-[11px] sm:text-xs leading-snug">{t.wizard.calendarDesc}</span>
                </div>
              </div>

              {/* Date Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t.wizard.selectDate}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.date;
                    return (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => setSelectedDate(item.date)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-sunny-navy bg-slate-50/90 ring-2 ring-sunny-navy/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sunny-navy font-extrabold text-xs sm:text-sm">
                          <CalendarIcon className="w-3.5 h-3.5 text-sunny-goldHover flex-shrink-0" />
                          <span className="truncate">{item.date}</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
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
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    KJRI Frankfurt (CET)
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
                        className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                          isFull
                            ? 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-sunny-navy bg-sunny-navy text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1 truncate">
                            <Clock className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-sunny-gold' : 'text-slate-400'}`} />
                            {slot.replace(' CET', '')}
                          </span>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] block mt-0.5 truncate ${
                          isSelected ? 'text-amber-200' : isFull ? 'text-slate-400' : 'text-emerald-600 font-semibold'
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

        {/* Footer Navigation Buttons - Mobile Optimized */}
        <div className="p-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
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
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ml-auto"
            >
              <span>{t.wizard.nextBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNextStep2}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ml-auto"
            >
              <span>{lang === 'en' ? 'Continue to Termin' : 'Lanjut ke Jadwal Termin'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sunny-gold" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-sunny-navy hover:bg-sunny-navyDark text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ring-2 ring-sunny-gold/40 ml-auto"
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
