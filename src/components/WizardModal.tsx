import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  Sparkles,
  Info,
  ShieldAlert,
  Trash2,
  FileText,
  User,
  Globe
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

  // Wizard Step State: 1 = Identity & Data Pemohon, 2 = Documents Checklist, 3 = Termin Appointment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // COMBINED STEP 1 FORM DATA (Original + Form Terupdate dari Klien)
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [nameInOldPassport, setNameInOldPassport] = useState(currentUser?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiryDate, setPassportExpiryDate] = useState('');
  const [permitExpiryDate, setPermitExpiryDate] = useState('');
  const [dualCitizenship, setDualCitizenship] = useState<'Ya' | 'Tidak'>('Tidak');
  const [bundesland, setBundesland] = useState('Hessen');
  const [phoneCountry, setPhoneCountry] = useState<'+62' | '+49'>('+49');
  const [phone, setPhone] = useState('');
  const [germanAddress, setGermanAddress] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [passportType, setPassportType] = useState<'electronic' | 'ordinary'>('electronic');
  const [otherServiceNote, setOtherServiceNote] = useState('');

  // Step 2 Form Data - Document uploads & Peduli WNI
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
      // Step 1: Pre-fill Combined Identity & Client Form Data
      setFullName(currentUser?.name || 'Budi Santoso');
      setEmail(currentUser?.email || 'budi.santoso@example.de');
      setNameInOldPassport(currentUser?.name || 'Budi Santoso');
      setDateOfBirth('14/08/1994');
      setPassportNumber('B8291048');
      setPassportExpiryDate('15/05/2027');
      setPermitExpiryDate('30/09/2028');
      setDualCitizenship('Tidak');
      setBundesland('Hessen');
      setPhoneCountry('+49');
      setPhone('176 12345678');
      setGermanAddress('Mainzer Landstraße 182, 60327 Frankfurt am Main');
      setClientNote('Penggantian paspor reguler karena masa berlaku tersisa kurang dari 6 bulan untuk perpanjangan izin tinggal (Aufenthaltstitel).');
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
    if (!fullName.trim() || !email.trim() || !phone.trim() || !passportNumber.trim()) {
      setValidationError(lang === 'en' 
        ? 'Please fill in all mandatory identity and passport fields (*).' 
        : 'Mohon lengkapi seluruh kolom identitas dan data paspor wajib (*).');
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
    const fee = 0;

    const computedServiceName = service.id === 'other-consular-services' && otherServiceNote.trim()
      ? `${lang === 'en' ? service.titleEn : service.titleId} — ${otherServiceNote}`
      : lang === 'en' ? service.titleEn : service.titleId;

    // BARCODE ENCODES SUNNY CRM CASE URL AS REQUESTED
    const crmCaseUrl = 'https://demo-crm.sunny.co.id/service/case';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(crmCaseUrl)}`;

    const fullPhone = `${phoneCountry} ${phone.replace(/^0+/, '')}`;

    const newRecord: ApplicationRecord = {
      id: uniqueId,
      serviceId: service.id,
      serviceName: computedServiceName,
      applicantName: fullName,
      nik: '3273012304910002',
      passportNumber: passportNumber,
      email: email,
      phone: fullPhone,
      germanAddress: germanAddress ? `${germanAddress}, ${bundesland}` : `${bundesland}, Germany`,
      passportType: passportType,
      status: 'verified',
      submissionDate: new Date().toISOString().split('T')[0],
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      notes: clientNote || (lang === 'en' 
        ? 'Documents preliminary verified. Please bring original physical copies to your consular appointment.' 
        : 'Berkas telah diverifikasi lengkap. Harap bawa fisik dokumen asli saat hadir di loket konsuler.'),
      feePaid: fee,
      qrCodeUrl: qrCodeUrl,
      dhlTrackingNumber: `JJD00039${Math.floor(10000000 + Math.random() * 90000000)}DE`,
      dhlStatus: 'Awaiting passport printing completion for DHL dispatch'
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
            </div>
          </div>

          {/* Right Action: Upload or File Info */}
          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            {uploaded ? (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 block max-w-[120px] sm:max-w-[160px] truncate">
                    {uploaded.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {uploaded.size} &bull; Uploaded
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(key)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 active:scale-95">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'Browse File' : 'Pilih Berkas'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92dvh] animate-modal-enter relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sunny-gold block">
              CONSULAR APPLICATION WIZARD
            </span>
            <h2 className="text-base sm:text-xl font-extrabold text-sunny-navy tracking-tight leading-snug">
              {lang === 'en' ? service.titleEn : service.titleId}
            </h2>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-xl bg-amber-100/70 text-amber-900 hover:bg-amber-200/80 transition-colors flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300/60 active:scale-95"
              title="Pre-fill sample data for this step"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{currentStep === 1 ? 'Sync Identity' : currentStep === 2 ? 'Attach Sample Files' : 'Auto Pick Slot'} (Step {currentStep})</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            
            {/* Step 1 Tab */}
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pb-1.5 border-b-2 text-xs font-bold transition-colors ${
              currentStep === 1 
                ? 'border-sunny-navy text-sunny-navy' 
                : currentStep > 1 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-slate-200 text-slate-400'
            }`}>
              <div className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] flex-shrink-0 ${
                currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-sunny-navy text-white'
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

          {/* STEP 1: COMBINED FORM (IDENTITAS & DATA FORM KLIEN TERUPDATE) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              
              {/* Row 1: Nama Anda & Email Anda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Nama Anda*' : 'Full Legal Name (Nama Anda)*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Budi Santoso"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Email Anda*' : 'Email Address (Email Anda)*'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi.santoso@example.de"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Nama tertera di paspor lama & Tanggal lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Nama tertera di paspor lama*' : 'Name in Old Passport (Nama di paspor lama)*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInOldPassport}
                    onChange={(e) => setNameInOldPassport(e.target.value)}
                    placeholder="Nama sesuai halaman identitas paspor"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Tanggal lahir*' : 'Date of Birth (Tanggal lahir)*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="dd/mm/yyyy (cth: 14/08/1994)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Row 3: Nomor paspor lama & Tanggal habis masa berlaku paspor lama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Nomor paspor lama*' : 'Old Passport Number (Nomor paspor lama)*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="B8291048"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Tanggal habis masa berlaku paspor lama*' : 'Old Passport Expiry Date*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={passportExpiryDate}
                    onChange={(e) => setPassportExpiryDate(e.target.value)}
                    placeholder="dd/mm/yyyy (cth: 15/05/2027)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Row 4: Tanggal habis izin tinggal di Jerman & Domisili Bundesland */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Tanggal habis masa berlaku izin tinggal di Jerman*' : 'German Residence Permit Expiry Date*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={permitExpiryDate}
                    onChange={(e) => setPermitExpiryDate(e.target.value)}
                    placeholder="dd/mm/yyyy (cth: 30/09/2028)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Domisili negara bagian/ Bundesland*' : 'German Federal State / Bundesland*'}
                  </label>
                  <select
                    value={bundesland}
                    onChange={(e) => setBundesland(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="Hessen">Hessen (Frankfurt, Darmstadt, Kassel, Wiesbaden)</option>
                    <option value="Bayern">Bayern (München, Nürnberg, Augsburg)</option>
                    <option value="Baden-Württemberg">Baden-Württemberg (Stuttgart, Karlsruhe, Heidelberg)</option>
                    <option value="Nordrhein-Westfalen">Nordrhein-Westfalen (Köln, Düsseldorf, Dortmund, Bonn)</option>
                    <option value="Rheinland-Pfalz">Rheinland-Pfalz (Mainz, Koblenz, Ludwigshafen)</option>
                    <option value="Saarland">Saarland (Saarbrücken)</option>
                    <option value="Lainnya">Lainnya / Wilayah Lain</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Kewarganegaraan Lain & Nomor Telepon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'id' ? 'Apakah anda memiliki kewarganegaraan lain?*' : 'Do you hold another citizenship?*'}
                  </label>
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="radio"
                        name="dualCitizenship"
                        value="Ya"
                        checked={dualCitizenship === 'Ya'}
                        onChange={() => setDualCitizenship('Ya')}
                        className="w-4 h-4 text-sunny-navy border-slate-300 focus:ring-sunny-navy"
                      />
                      <span>Ya</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="radio"
                        name="dualCitizenship"
                        value="Tidak"
                        checked={dualCitizenship === 'Tidak'}
                        onChange={() => setDualCitizenship('Tidak')}
                        className="w-4 h-4 text-sunny-navy border-slate-300 focus:ring-sunny-navy"
                      />
                      <span>Tidak</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'id' ? 'Nomor telepon yang bisa dihubungi*' : 'Contact Phone / WhatsApp*'}
                  </label>
                  <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:bg-white focus-within:border-sunny-navy focus-within:ring-2 focus-within:ring-sunny-navy/20">
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value as '+62' | '+49')}
                      className="px-2.5 py-2.5 bg-slate-100 text-xs font-bold text-slate-700 border-r border-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+62">🇮🇩 +62</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={phoneCountry === '+49' ? '176 12345678' : '0812-345-678'}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Alamat tinggal di Jerman */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'id' ? 'Alamat domisili lengkap di Jerman' : 'German Residential Address (Street, House No, PLZ, City)'}
                </label>
                <input
                  type="text"
                  value={germanAddress}
                  onChange={(e) => setGermanAddress(e.target.value)}
                  placeholder="e.g. Mainzer Landstraße 182, 60327 Frankfurt am Main"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                />
              </div>

              {/* Row 7: Pilihan Jenis Paspor */}
              {service.id !== 'passport-appointment-only' && service.id !== 'other-consular-services' && (
                <div className="pt-1">
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
                          {lang === 'id' ? 'Paspor Elektronik (E-Paspor)' : 'Electronic Passport (E-Paspor)'}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">
                          {lang === 'id' ? '48 Halaman dengan Chip Biometrik' : '48 Pages with Biometric Chip'}
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
                          {lang === 'id' ? 'Paspor Biasa (Non-Elektronik)' : 'Ordinary Passport (Paspor Biasa)'}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block">
                          {lang === 'id' ? '48 Halaman Standar' : '48 Standard Pages'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Row 8: Note / Alasan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'id' ? 'Note/alasan' : 'Notes / Reason for application'}
                </label>
                <textarea
                  rows={2}
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  placeholder="Catatan tambahan atau alasan permohonan paspor/layanan konsuler..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                />
              </div>

              {/* If Other Consular Services */}
              {service.id === 'other-consular-services' && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Consular Affair / Purpose Details' : 'Rincian Keperluan Pelayanan Konsuler'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={otherServiceNote}
                    onChange={(e) => setOtherServiceNote(e.target.value)}
                    placeholder="Legalisasi ijazah, pencatatan sipil nikah/lahir, surat keterangan domisili..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sunny-navy/20 focus:border-sunny-navy font-medium text-slate-800"
                  />
                </div>
              )}

            </div>
          )}

          {/* STEP 2: DOCUMENTS & DYNAMIC REQUIREMENTS */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Mandatory Peduli WNI check */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={peduliWniChecked}
                    onChange={(e) => setPeduliWniChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-sunny-navy rounded border-slate-300 focus:ring-sunny-navy"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">
                      {t.wizard.peduliWniCheck} <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed block mt-0.5">
                      {lang === 'en' ? 'Proof of active registration on the official Ministry of Foreign Affairs Peduli WNI portal.' : 'Surat tanda bukti atau konfirmasi lapor diri aktif di Portal Peduli WNI Kementerian Luar Negeri.'}
                    </span>
                  </div>
                </label>

                {peduliWniChecked && (
                  <div className="mt-3 pl-7">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.wizard.peduliWniId}
                    </label>
                    <input
                      type="text"
                      value={peduliWniRef}
                      onChange={(e) => setPeduliWniRef(e.target.value)}
                      placeholder="e.g. PWNI-FRA-2026-7819"
                      className="w-full sm:max-w-xs px-3 py-1.5 text-xs rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-sunny-navy"
                    />
                  </div>
                )}
              </div>

              {/* If Lost Passport: Require Police Loss Report Number */}
              {service.id === 'passport-lost' && (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50/70 border border-rose-200">
                  <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold text-xs sm:text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>German Police Loss Report (Verlustanzeige)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Surat Kehilangan Polisi Jerman <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={policeReportNo}
                      onChange={(e) => setPoliceReportNo(e.target.value)}
                      placeholder="e.g. POL-FFM-2026-004812"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* If Damaged Passport: Explanation field */}
              {service.id === 'passport-damaged' && (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Kronologi Kerusakan Paspor</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Keterangan Singkat Penyebab Kerusakan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={damageExplanation}
                      onChange={(e) => setDamageExplanation(e.target.value)}
                      placeholder="Jelaskan secara singkat bagaimana kerusakan terjadi (halaman sobek, basah, chip tidak terbaca)..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-sunny-navy"
                    />
                  </div>
                </div>
              )}

              {/* File Upload Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t.wizard.uploadTitle}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    PDF, JPG, PNG &bull; Max 5MB
                  </span>
                </div>

                <div className="space-y-2.5">
                  {service.id === 'other-consular-services' && renderDocUploadRow(
                    'relevant_doc',
                    'Relevant Document / Paperwork for Legalization',
                    'Berkas Dokumen Terkait yang Akan Diproses / Dilegalisasi',
                    true,
                    'Scan or draft of paperwork (e.g. certificate, translation, power of attorney)'
                  )}

                  {service.id !== 'passport-lost' && service.id !== 'other-consular-services' && service.id !== 'passport-appointment-only' && renderDocUploadRow(
                    'old_passport',
                    'Current / Old Passport (Identity Page)',
                    'Paspor Lama / Saat Ini (Halaman Data)',
                    true,
                    'Scan or clear photo of page 2 & 3 showing full identity'
                  )}

                  {service.id === 'passport-damaged' && renderDocUploadRow(
                    'damage_photo',
                    'Photograph of Damaged Passport Section',
                    'Foto Bagian Paspor yang Rusak Fisik',
                    true,
                    'Clear photo displaying torn, burnt, or unreadable pages'
                  )}

                  {service.id === 'passport-lost' && renderDocUploadRow(
                    'police_loss_doc',
                    'German Police Loss Report (Verlustanzeige)',
                    'Surat Laporan Kehilangan Polisi Jerman (Verlustanzeige)',
                    true,
                    'Official certificate issued by local German police station'
                  )}

                  {renderDocUploadRow(
                    'residence_permit',
                    'German Residence Title (Aufenthaltstitel / Visa)',
                    'Izin Tinggal Jerman (Aufenthaltstitel / Visa)',
                    true,
                    'Front and back copy of valid electronic residence card (eAT)'
                  )}

                  {renderDocUploadRow(
                    'meldebescheinigung',
                    'Proof of German Residence (Meldebescheinigung)',
                    'Surat Keterangan Domisili Jerman (Meldebescheinigung)',
                    true,
                    'Issued by Bürgeramt in Hessen, Bayern, BW, NRW, RP, or Saarland'
                  )}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: TERMIN & TIME-SLOT APPOINTMENT CONFIRMATION */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Client's Official Summary Banner with Icons */}
              <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-4 space-y-2 text-xs sm:text-[13px] text-slate-800 shadow-xs">
                <div className="font-extrabold text-sm text-sunny-navy mb-2 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Konfirmasi Jadwal Pemesanan: {lang === 'en' ? service.titleEn : service.titleId}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span><strong>Dengan:</strong> KJRI Frankfurt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span><strong>Kapan:</strong> {selectedDate} ({selectedSlot})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span><strong>Zona waktu:</strong> Asia/Jakarta (CET)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span><strong>Durasi:</strong> 15 menit</span>
                  </div>
                </div>
              </div>

              {/* Blue Alert Notice from Client Form */}
              <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BAE6FD] text-[#0369A1] text-xs font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0369A1] flex-shrink-0" />
                <span>Pemesanan ini memerlukan persetujuan dari tuan rumah.</span>
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
                    const isFull = idx === 4;
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

              {/* Disclaimer */}
              <p className="text-[10px] sm:text-[11px] text-slate-400 text-center leading-relaxed pt-2">
                Situs ini dilindungi oleh reCAPTCHA dan berlaku Kebijakan Privasi dan Persyaratan Layanan Google.
              </p>

            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
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
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Minta Pemesanan (Confirm Appointment)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
