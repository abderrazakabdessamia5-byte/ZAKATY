import React, { useState, useEffect } from 'react';
import { Language, UserAccount, AdminSettings, ProfileData } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { HomeView } from './components/home/HomeView';
import { ImagesToPdfTool } from './components/tools/ImagesToPdfTool';
import { MergePdfTool } from './components/tools/MergePdfTool';
import { SplitPdfTool } from './components/tools/SplitPdfTool';
import { PdfToImagesTool } from './components/tools/PdfToImagesTool';
import { CompressPdfTool } from './components/tools/CompressPdfTool';
import { WatermarkRotatePdfTool } from './components/tools/WatermarkRotatePdfTool';
import { ImageConvertTool } from './components/tools/ImageConvertTool';
import { ImageResizeCropTool } from './components/tools/ImageResizeCropTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { QrScannerTool } from './components/tools/QrScannerTool';
import { NfcWriterTool } from './components/tools/NfcWriterTool';
import { ProfileList } from './components/profile/ProfileList';
import { ProfileEditor } from './components/profile/ProfileEditor';
import { PublicProfileView } from './components/profile/PublicProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LegalPages } from './components/legal/LegalPages';
import { AuthModal } from './components/auth/AuthModal';
import { getCurrentUser } from './services/auth';
import { getStoredAdminSettings, getProfileBySlug } from './services/storage';

export default function App() {
  // 1. Language state & RTL support
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zakaty_lang') as Language;
      if (saved && ['en', 'ar', 'fr', 'es'].includes(saved)) return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('zakaty_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // 2. Dark / Light mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zakaty_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('zakaty_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // 3. User & Admin settings state
  const [user, setUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getStoredAdminSettings());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // 4. Navigation & Route state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [editingProfile, setEditingProfile] = useState<ProfileData | null>(null);
  const [activeNfcUrl, setActiveNfcUrl] = useState<string>('');
  const [publicProfileSlug, setPublicProfileSlug] = useState<string | null>(null);

  // Sync route from URL Hash
  const syncRouteFromHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      setCurrentRoute('home');
      setPublicProfileSlug(null);
      return;
    }

    if (hash.startsWith('p/')) {
      const slug = hash.replace('p/', '').split('?')[0].split('/')[0];
      setPublicProfileSlug(slug);
      setCurrentRoute('public-profile');
    } else {
      setPublicProfileSlug(null);
      setCurrentRoute(hash);
    }
  };

  useEffect(() => {
    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route === 'home' ? '' : route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render content based on route
  const renderContent = () => {
    // 1. Standalone Public Digital Profile View (/p/:slug)
    if (currentRoute === 'public-profile' && publicProfileSlug) {
      const profile = getProfileBySlug(publicProfileSlug);
      if (!profile) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Not Found</h2>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              The digital business card you requested does not exist or has been unpublished.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Explore Free Tools on ZakaTy
            </button>
          </div>
        );
      }
      return (
        <PublicProfileView
          profile={profile}
          currentLang={currentLang}
          onNavigateHome={() => navigateTo('home')}
          onEdit={() => {
            setEditingProfile(profile);
            navigateTo('profile-editor');
          }}
        />
      );
    }

    // 2. Specific Tool Views
    switch (currentRoute) {
      case 'tool-images-to-pdf':
        return <ImagesToPdfTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-merge-pdf':
        return <MergePdfTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-split-pdf':
        return <SplitPdfTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-pdf-to-images':
        return <PdfToImagesTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-compress-pdf':
        return <CompressPdfTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-watermark-pdf':
        return <WatermarkRotatePdfTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-image-convert':
        return <ImageConvertTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-image-resize':
        return <ImageResizeCropTool currentLang={currentLang} defaultMode="resize" onBack={() => navigateTo('home')} />;
      case 'tool-image-crop':
        return <ImageResizeCropTool currentLang={currentLang} defaultMode="crop" onBack={() => navigateTo('home')} />;
      case 'tool-qr-generator':
        return <QrGeneratorTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-qr-scanner':
        return <QrScannerTool currentLang={currentLang} onBack={() => navigateTo('home')} />;
      case 'tool-nfc-card':
        return (
          <NfcWriterTool
            currentLang={currentLang}
            initialUrl={activeNfcUrl || undefined}
            onBack={() => navigateTo('home')}
          />
        );

      // 3. Profiles & Editor
      case 'profiles':
        return (
          <ProfileList
            currentLang={currentLang}
            onCreateNew={() => {
              setEditingProfile(null);
              navigateTo('profile-editor');
            }}
            onEdit={(prof) => {
              setEditingProfile(prof);
              navigateTo('profile-editor');
            }}
            onViewPublic={(slug) => {
              navigateTo(`p/${slug}`);
            }}
            onOpenNfc={(url) => {
              setActiveNfcUrl(url);
              navigateTo('tool-nfc-card');
            }}
          />
        );

      case 'profile-editor':
        return (
          <ProfileEditor
            initialProfile={editingProfile}
            currentLang={currentLang}
            onBack={() => navigateTo('profiles')}
            onSaved={(saved) => {
              navigateTo(`p/${saved.slug}`);
            }}
          />
        );

      // 4. Admin View
      case 'admin':
        return (
          <AdminDashboard
            currentLang={currentLang}
            onBack={() => navigateTo('home')}
            onSettingsUpdated={(updated) => setAdminSettings(updated)}
          />
        );

      // 5. Legal Pages
      case 'privacy':
      case 'terms':
      case 'cookies':
      case 'about':
      case 'contact':
      case 'acceptable-use':
      case 'data-deletion':
        return (
          <LegalPages
            page={currentRoute}
            currentLang={currentLang}
            onNavigate={(r) => navigateTo(r)}
            founderName={adminSettings.founderName}
            founderCountry={adminSettings.founderCountry}
            contactEmail={adminSettings.contactEmail}
          />
        );

      // 6. PDF / Image / QR filter shortcuts
      case 'pdf':
      case 'image':
      case 'qr-nfc':
      case 'home':
      default:
        return (
          <HomeView
            currentLang={currentLang}
            onNavigateToTool={(id) => navigateTo(id)}
            onNavigateToProfiles={() => navigateTo('profiles')}
            allowDonations={adminSettings.allowDonations}
            coffeeUrl={adminSettings.buyMeACoffeeUrl}
            paypalUrl={adminSettings.paypalDonateUrl}
          />
        );
    }
  };

  // If viewing a standalone public profile, render it cleanly without the standard app header/footer
  if (currentRoute === 'public-profile') {
    return <div className="min-h-screen">{renderContent()}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        user={user}
        onOpenAuth={() => {
          if (user?.role === 'admin') {
            navigateTo('admin');
          } else {
            setAuthModalOpen(true);
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1">{renderContent()}</main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={navigateTo}
        founderName={adminSettings.founderName}
        founderCountry={adminSettings.founderCountry}
        contactEmail={adminSettings.contactEmail}
      />

      {/* Auth & Google Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        onUserChange={setUser}
        currentLang={currentLang}
      />

      {/* GDPR Cookie Banner */}
      <CookieBanner onOpenPrivacy={() => navigateTo('privacy')} />
    </div>
  );
}
