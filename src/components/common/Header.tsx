import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language, UserAccount } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Shield,
  FileText,
  Image as ImageIcon,
  QrCode,
  CreditCard,
  HeartHandshake
} from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleDark: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDark,
  onToggleDark,
  currentRoute,
  onNavigate,
  user,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: null },
    { id: 'pdf', label: t.nav.pdfTools, icon: FileText },
    { id: 'image', label: t.nav.imageTools, icon: ImageIcon },
    { id: 'qr-nfc', label: t.nav.qrNfc, icon: QrCode },
    { id: 'profiles', label: t.nav.digitalProfiles, icon: CreditCard },
    { id: 'about', label: t.nav.about, icon: null },
    { id: 'contact', label: t.nav.contact, icon: null },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية (RTL)', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 text-left"
          aria-label="ZakaTy Home"
        >
          <Logo />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Utility Controls (Language, Theme, Account) */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase">{currentLang}</span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute end-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setLangMenuOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      currentLang === l.code
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {currentLang === l.code && <span className="text-indigo-600 dark:text-indigo-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label={isDark ? t.common.lightMode : t.common.darkMode}
            title={isDark ? t.common.lightMode : t.common.darkMode}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Account / Admin Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-slate-100 text-xs font-semibold transition-all shadow-sm"
          >
            {user?.role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-indigo-300 dark:text-indigo-600" />
                <span className="hidden sm:inline">{t.nav.admin}</span>
              </>
            ) : user ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>{t.nav.account}</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${
                currentRoute === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-slate-400" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
