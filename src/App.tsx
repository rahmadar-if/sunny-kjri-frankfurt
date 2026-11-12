import { useState } from 'react';
import { Language, ServiceItem, ApplicationRecord, UserProfile } from './types';
import { mockApplications, mockUserProfile } from './data/mockData';
import { servicesData } from './data/services';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { QuickTracker } from './components/QuickTracker';
import { TrackingModal } from './components/TrackingModal';
import { WizardModal } from './components/WizardModal';
import { ETicketModal } from './components/ETicketModal';
import { FaqSection } from './components/FaqSection';
import { ConsularInfo } from './components/ConsularInfo';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { UserDashboard } from './components/UserDashboard';
import { RescheduleModal } from './components/RescheduleModal';
import { CancelConfirmModal } from './components/CancelConfirmModal';

export function App() {
  // Global Language: English default with Indonesian toggle
  const [lang, setLang] = useState<Language>('en');

  // Active View State: 'landing' (public portal) or 'dashboard' (authenticated member portal)
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Authenticated User State & Profile
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);

  // Pending service for redirection after login
  const [pendingService, setPendingService] = useState<ServiceItem | null>(null);

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeTrackingApp, setActiveTrackingApp] = useState<ApplicationRecord | null>(null);
  const [eTicketApp, setETicketApp] = useState<ApplicationRecord | null>(null);
  const [rescheduleApp, setRescheduleApp] = useState<ApplicationRecord | null>(null);
  const [cancelApp, setCancelApp] = useState<ApplicationRecord | null>(null);

  // Application records list (mock data + newly submitted records)
  const [applications, setApplications] = useState<ApplicationRecord[]>(mockApplications);

  // Handlers
  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setPendingService(null);
    setCurrentView('landing');
  };

  const handleLoginSuccess = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      email: user.email
    }));
    setIsAuthOpen(false);

    // If user attempted to apply for a service before logging in, launch the wizard!
    if (pendingService) {
      setSelectedService(pendingService);
      setPendingService(null);
    }
    // Remain on current public page (do not redirect to dashboard)
  };

  // Enforce authentication gate: User MUST be logged in before applying
  const handleSelectService = (service: ServiceItem) => {
    if (!currentUser) {
      setPendingService(service);
      setIsAuthOpen(true);
      return;
    }
    setSelectedService(service);
  };

  // Scroll down smoothly to all consular services section or trigger wizard
  const handleBookFromHero = () => {
    if (currentView === 'dashboard') {
      setSelectedService(servicesData[0]);
      return;
    }
    const elem = document.getElementById('services');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrackFromHero = () => {
    const elem = document.getElementById('tracker');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchTracking = (query: string) => {
    const trimmed = query.trim().toUpperCase();
    const found = applications.find(
      (app) =>
        app.id.toUpperCase() === trimmed ||
        app.passportNumber.toUpperCase() === trimmed ||
        app.nik === trimmed
    );

    if (found) {
      setActiveTrackingApp(found);
    } else {
      // Create a fallback simulation record for the demo if not matched
      const fallbackApp: ApplicationRecord = {
        id: trimmed.startsWith('FRA-') ? trimmed : `FRA-2026-${trimmed.slice(-4) || '9901'}`,
        serviceId: 'passport-expired',
        serviceName: 'Passport Renewal (Expired / Expiring)',
        applicantName: currentUser?.name || 'Warga Negara Indonesia',
        nik: '3273012304910002',
        passportNumber: trimmed.startsWith('FRA-') ? 'B9018274' : trimmed,
        email: currentUser?.email || 'pemohon@kemlu.go.id',
        phone: '+49 176 12345678',
        germanAddress: 'Zeppelinallee 23, 60325 Frankfurt am Main',
        passportType: 'electronic',
        status: 'verified',
        submissionDate: '2026-11-06',
        appointmentDate: '2026-11-18',
        appointmentTime: '10:00 - 10:30 CET',
        notes: 'Document verification passed. Ready for biometric photograph session at the consular chancery.',
        feePaid: 65,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://demo-crm.sunny.co.id/service/case')}`,
        dhlTrackingNumber: `JJD00039${Math.floor(10000000 + Math.random() * 90000000)}DE`,
        dhlStatus: 'Out for delivery via DHL Express Germany'
      };
      setActiveTrackingApp(fallbackApp);
    }
  };

  const handleWizardSubmitSuccess = (newRecord: ApplicationRecord) => {
    // Add to records
    setApplications((prev) => [newRecord, ...prev]);
    // Close wizard
    setSelectedService(null);
    // Show E-ticket modal immediately
    setETicketApp(newRecord);
  };

  // Reschedule Appointment Handler
  const handleConfirmReschedule = (applicationId: string, newDate: string, newTime: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          return {
            ...app,
            appointmentDate: newDate,
            appointmentTime: newTime,
            status: 'appointment_ready',
            rescheduledAt: new Date().toISOString(),
            notes: `Jadwal termin telah diperbarui menjadi ${newDate} pk. ${newTime}. Harap hadir 15 menit sebelum slot.`
          };
        }
        return app;
      })
    );
  };

  // Cancel Appointment Handler
  const handleConfirmCancel = (applicationId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          return {
            ...app,
            status: 'cancelled',
            cancellationReason: reason,
            notes: `Permohonan dibatalkan oleh pemohon dengan alasan: ${reason}`
          };
        }
        return app;
      })
    );
  };

  // Peduli WNI Sync Handler
  const handleSyncPeduliWni = () => {
    setUserProfile((prev) => ({
      ...prev,
      peduliWniStatus: 'verified',
      peduliWniId: 'PWNI-DE-FRA-2026-0042'
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sticky Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onBookClick={handleBookFromHero}
        currentView={currentView}
        onNavigateView={(view) => setCurrentView(view)}
      />

      {/* Main Content: Conditional View */}
      {currentView === 'dashboard' && currentUser ? (
        <UserDashboard
          lang={lang}
          userProfile={userProfile}
          applications={applications}
          onBackToLanding={() => setCurrentView('landing')}
          onNewApplication={() => setSelectedService(servicesData[0])}
          onViewETicket={(app) => setETicketApp(app)}
          onTrackProgress={(app) => setActiveTrackingApp(app)}
          onOpenReschedule={(app) => setRescheduleApp(app)}
          onOpenCancel={(app) => setCancelApp(app)}
          onSyncPeduliWni={handleSyncPeduliWni}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            lang={lang}
            onBookClick={handleBookFromHero}
            onTrackClick={handleTrackFromHero}
          />

          {/* Core Consular Services */}
          <ServiceCatalog
            lang={lang}
            onSelectService={handleSelectService}
          />

          {/* Quick Search & Application Tracking (for quick lookup without login) */}
          <QuickTracker
            lang={lang}
            onSearch={handleSearchTracking}
            recentApplications={applications}
            currentUser={currentUser}
          />

          {/* Categorized FAQ Section with Search */}
          <FaqSection lang={lang} />

          {/* Consular Location, Hours & Emergency Contacts */}
          <ConsularInfo lang={lang} />
        </main>
      )}

      {/* Official Footer */}
      <Footer lang={lang} />

      {/* 3-Step Simple Application Wizard Modal */}
      <WizardModal
        lang={lang}
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => {
          setSelectedService(null);
          setPendingService(null);
        }}
        onSubmitSuccess={handleWizardSubmitSuccess}
        currentUser={currentUser}
      />

      {/* Live 5-Stage Stepper Tracking Modal */}
      <TrackingModal
        lang={lang}
        application={activeTrackingApp}
        isOpen={Boolean(activeTrackingApp)}
        onClose={() => setActiveTrackingApp(null)}
        onOpenETicket={(app) => {
          setActiveTrackingApp(null);
          setETicketApp(app);
        }}
      />

      {/* Official Printable E-Ticket with QR Code Modal */}
      <ETicketModal
        lang={lang}
        application={eTicketApp}
        isOpen={Boolean(eTicketApp)}
        onClose={() => setETicketApp(null)}
      />

      {/* Reschedule Termin Modal */}
      <RescheduleModal
        lang={lang}
        application={rescheduleApp}
        isOpen={Boolean(rescheduleApp)}
        onClose={() => setRescheduleApp(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Cancel Appointment Modal */}
      <CancelConfirmModal
        lang={lang}
        application={cancelApp}
        isOpen={Boolean(cancelApp)}
        onClose={() => setCancelApp(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Quick Authentication Modal */}
      <AuthModal
        lang={lang}
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingService(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
