import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  CreditCard,
  XCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { ApplicationRecord, Language, UserProfile } from '../types';
import { translations } from '../data/translations';

interface UserDashboardProps {
  lang: Language;
  userProfile: UserProfile;
  applications: ApplicationRecord[];
  onBackToLanding: () => void;
  onNewApplication: () => void;
  onViewETicket: (app: ApplicationRecord) => void;
  onTrackProgress: (app: ApplicationRecord) => void;
  onOpenReschedule: (app: ApplicationRecord) => void;
  onOpenCancel: (app: ApplicationRecord) => void;
  onSyncPeduliWni: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  lang,
  userProfile,
  applications,
  onBackToLanding,
  onNewApplication,
  onViewETicket,
  onTrackProgress,
  onOpenReschedule,
  onOpenCancel,
  onSyncPeduliWni
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Copy handler
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Sync handler simulation
  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      onSyncPeduliWni();
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 800);
  };

  // Filter user applications (only applications for this user or all mock applications for the demo user)
  const userApps = applications.filter(
    (app) => app.email.toLowerCase() === userProfile.email.toLowerCase() || app.applicantName === userProfile.name
  );

  // Helper to determine appointment hours diff
  const getAppointmentCutoffStatus = (app: ApplicationRecord): {
    canModify: boolean;
    hoursLeft: number;
    statusLevel: 'normal' | 'warning48h' | 'locked24h';
  } => {
    if (!app.appointmentDate) {
      return { canModify: false, hoursLeft: 0, statusLevel: 'normal' };
    }

    try {
      // Parse appointment date string e.g. "2026-11-18"
      const appDateTime = new Date(`${app.appointmentDate}T10:00:00Z`).getTime();
      const now = new Date('2026-11-12T09:00:00Z').getTime(); // anchored to current simulated date
      const diffHours = (appDateTime - now) / (1000 * 60 * 60);

      if (diffHours <= 24) {
        return { canModify: false, hoursLeft: Math.max(0, Math.round(diffHours)), statusLevel: 'locked24h' };
      }
      if (diffHours <= 48) {
        return { canModify: true, hoursLeft: Math.round(diffHours), statusLevel: 'warning48h' };
      }
      return { canModify: true, hoursLeft: Math.round(diffHours), statusLevel: 'normal' };
    } catch {
      return { canModify: true, hoursLeft: 72, statusLevel: 'normal' };
    }
  };

  // Filter applications by tab
  const filteredApps = userApps.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['submitted', 'verified', 'appointment_ready', 'in_production'].includes(app.status);
    }
    if (activeTab === 'completed') {
      return app.status === 'ready_for_pickup';
    }
    if (activeTab === 'cancelled') {
      return app.status === 'cancelled';
    }
    return true;
  });

  // Status badge styling
  const renderStatusBadge = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'appointment_ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {lang === 'en' ? 'Termin Confirmed' : 'Termin Terkonfirmasi'}
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Document Verified' : 'Dokumen Terverifikasi'}
          </span>
        );
      case 'in_production':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <RefreshCw className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Passport in Production' : 'Paspor Sedang Dicetak'}
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Completed / Ready' : 'Selesai / Siap Diambil'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Cancelled' : 'Dibatalkan'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {lang === 'en' ? 'Submitted' : 'Permohonan Masuk'}
          </span>
        );
    }
  };

  const activeCount = userApps.filter((a) => ['submitted', 'verified', 'appointment_ready', 'in_production'].includes(a.status)).length;
  const completedCount = userApps.filter((a) => a.status === 'ready_for_pickup').length;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sunny-navy px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.dashboard.backToHome}</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-slate-500">
              {lang === 'en' ? 'WNI Consular Portal' : 'Portal Konsuler WNI'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNewApplication}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sunny-navy hover:bg-sunny-navyDark text-white shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.dashboard.newApplicationBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Welcome Header & Quick Stats */}
        <div className="bg-gradient-to-r from-sunny-navy via-slate-900 to-sunny-navy rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sunny-gold text-xs font-bold uppercase tracking-wider mb-2">
                {t.dashboard.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.dashboard.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                {t.dashboard.subtitle}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xs">
              <div className="text-center px-2">
                <span className="text-lg sm:text-2xl font-black text-white block">
                  {userApps.length}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300">
                  {t.dashboard.statTotal}
                </span>
              </div>
              <div className="text-center px-2 border-x border-white/10">
                <span className="text-lg sm:text-2xl font-black text-amber-400 block">
                  {activeCount}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300">
                  {t.dashboard.statActive}
                </span>
              </div>
              <div className="text-center px-2">
                <span className="text-lg sm:text-2xl font-black text-emerald-400 block">
                  {completedCount}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300">
                  {t.dashboard.statCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. APPLICANT BIODATA & PEDULI WNI PROFILE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-bold text-sunny-navy">
                  {t.dashboard.profileHeading}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.dashboard.profileSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{syncSuccess ? (lang === 'en' ? 'Synced!' : 'Tersinkron!') : t.dashboard.syncBtn}</span>
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-xs">
            {/* Full Name */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {t.dashboard.fullName}
              </span>
              <span className="text-sm font-bold text-sunny-navy block">
                {userProfile.name}
              </span>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {t.dashboard.email}
              </span>
              <span className="text-sm font-bold text-slate-800 block truncate">
                {userProfile.email}
              </span>
            </div>

            {/* NIK */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                {t.dashboard.nik}
              </span>
              <span className="text-sm font-mono font-bold text-slate-800 block">
                {userProfile.nik}
              </span>
            </div>

            {/* Passport Number & Expiry */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {t.dashboard.passportNo}
              </span>
              <span className="text-sm font-bold text-slate-800 block">
                {userProfile.currentPassportNo}{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({lang === 'en' ? 'Expires' : 'Berlaku s.d'} {userProfile.passportExpiry})
                </span>
              </span>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {t.dashboard.germanPhone}
              </span>
              <span className="text-sm font-bold text-slate-800 block">
                {userProfile.phone}
              </span>
            </div>

            {/* Peduli WNI Status */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t.dashboard.peduliWniStatus}
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ {t.dashboard.peduliWniVerified}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {userProfile.peduliWniId}
                </span>
              </div>
            </div>

            {/* German Residence Address */}
            <div className="md:col-span-2 lg:col-span-3 pt-3 border-t border-slate-100 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {t.dashboard.germanAddress}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {userProfile.germanAddress}, {userProfile.postalCode} {userProfile.city}, Hessen, Germany
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. APPLICATION & APPOINTMENT HISTORY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-sunny-navy">
                {t.dashboard.historyHeading}
              </h2>
              <p className="text-xs text-slate-500">
                {t.dashboard.historySubtitle}
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-sunny-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-sunny-navy'
                }`}
              >
                {t.dashboard.tabAll}
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-sunny-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-sunny-navy'
                }`}
              >
                {t.dashboard.tabActive}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-sunny-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-sunny-navy'
                }`}
              >
                {t.dashboard.tabCompleted}
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'cancelled'
                    ? 'bg-sunny-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-sunny-navy'
                }`}
              >
                {t.dashboard.tabCancelled}
              </button>
            </div>
          </div>

          {/* Cards List */}
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                {t.dashboard.noRecords}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => {
                const cutoff = getAppointmentCutoffStatus(app);
                const isUpcomingOrActive = ['appointment_ready', 'submitted', 'verified'].includes(app.status);
                const isCancelled = app.status === 'cancelled';

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs hover:shadow-soft overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm sm:text-base font-extrabold text-sunny-navy">
                              {app.id}
                            </span>
                            <button
                              onClick={() => handleCopy(app.id)}
                              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
                              title="Copy Reference"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {copiedId === app.id && (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                Copied!
                              </span>
                            )}
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {app.submissionDate}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {app.serviceName}
                          </h3>
                        </div>

                        <div>
                          {renderStatusBadge(app.status)}
                        </div>
                      </div>

                      {/* Appointment Details & Consular Hall */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                        {/* Termin Slot */}
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {lang === 'en' ? 'Termin Schedule' : 'Jadwal Janji Temu'}
                            </span>
                            <span className="font-bold text-slate-800">
                              {app.appointmentDate || (lang === 'en' ? 'Pending schedule' : 'Belum dijadwalkan')}
                            </span>
                            {app.appointmentTime && (
                              <span className="block text-[11px] text-slate-500">
                                {app.appointmentTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Document Type */}
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-sunny-navy flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {lang === 'en' ? 'Document Type' : 'Pilihan Dokumen'}
                            </span>
                            <span className="font-bold text-slate-800">
                              {app.passportType === 'electronic'
                                ? (lang === 'id' ? 'Paspor Elektronik (Chip)' : 'Electronic Passport (Chip)')
                                : (lang === 'id' ? 'Paspor Biasa' : 'Ordinary Passport')}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-1">
                          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {lang === 'en' ? 'Location' : 'Lokasi Pelayanan'}
                            </span>
                            <span className="text-slate-700 leading-snug">
                              KJRI Frankfurt, Zeppelinallee 23
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cancellation Reason if cancelled */}
                      {isCancelled && app.cancellationReason && (
                        <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">
                              {lang === 'en' ? 'Cancellation Reason:' : 'Alasan Pembatalan:'}
                            </span>
                            <span>{app.cancellationReason}</span>
                          </div>
                        </div>
                      )}

                      {/* Cut-off info for upcoming appointments */}
                      {isUpcomingOrActive && !isCancelled && (
                        <div>
                          {cutoff.statusLevel === 'locked24h' ? (
                            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                              <span>{t.dashboard.cutoffLocked24h}</span>
                            </div>
                          ) : cutoff.statusLevel === 'warning48h' ? (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span>{t.dashboard.cutoffWarning48h}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{t.dashboard.cutoffNoticeActive}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {!isCancelled && (
                            <button
                              onClick={() => onViewETicket(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sunny-navy bg-slate-100 hover:bg-sunny-navy hover:text-white transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{t.dashboard.viewTicketBtn}</span>
                            </button>
                          )}
                          <button
                            onClick={() => onTrackProgress(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-sunny-navy hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <span>{t.dashboard.trackDetailsBtn}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Reschedule & Cancel actions (Only for upcoming appointment) */}
                        {isUpcomingOrActive && !isCancelled && (
                          <div className="flex items-center gap-2">
                            {cutoff.canModify ? (
                              <>
                                <button
                                  onClick={() => onOpenReschedule(app)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer"
                                >
                                  {t.dashboard.rescheduleBtn}
                                </button>
                                <button
                                  onClick={() => onOpenCancel(app)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  {t.dashboard.cancelBtn}
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400 px-2 py-1 bg-slate-100 rounded-lg">
                                {lang === 'en' ? 'Termin Locked (<24h)' : 'Jadwal Terkunci (<24 Jam)'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
