import { useState } from 'react';
import { Language, ServiceItem, ApplicationRecord } from './types';
import { mockApplications } from './data/mockData';
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

export function App() {
  // Global Language: English default with Indonesian toggle
  const [lang, setLang] = useState<Language>('en');

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeTrackingApp, setActiveTrackingApp] = useState<ApplicationRecord | null>(null);
  const [eTicketApp, setETicketApp] = useState<ApplicationRecord | null>(null);

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
  };

  const handleLoginSuccess = (user: { name: string; email: string }) => {
    setCurrentUser(user);
  };

  const handleSelectService = (service: ServiceItem) => {
    // If not logged in, prompt auth first or directly open the wizard
    setSelectedService(service);
  };

  const handleBookFromHero = () => {
    // Scroll smoothly to service catalog
    const elem = document.getElementById('services');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedService(servicesData[0]);
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
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${trimmed}`
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sticky Navigation & Top Ribbon */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onBookClick={handleBookFromHero}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          lang={lang}
          onBookClick={handleBookFromHero}
          onTrackClick={handleTrackFromHero}
        />

        {/* 4 Core Consular Services */}
        <ServiceCatalog
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* Quick Search & Application Tracking */}
        <QuickTracker
          lang={lang}
          onSearch={handleSearchTracking}
          recentApplications={applications}
        />

        {/* Categorized FAQ Section with Search */}
        <FaqSection lang={lang} />

        {/* Consular Location, Hours & Emergency Contacts */}
        <ConsularInfo lang={lang} />
      </main>

      {/* Official Footer */}
      <Footer lang={lang} />

      {/* 3-Step Simple Application Wizard Modal */}
      <WizardModal
        lang={lang}
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
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

      {/* Quick Authentication Modal */}
      <AuthModal
        lang={lang}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
