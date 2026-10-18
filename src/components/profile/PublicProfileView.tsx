import React, { useState, useEffect } from 'react';
import { ProfileData, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { SocialIcon } from '../common/SocialIcon';
import { Logo } from '../common/Logo';
import { generateVCard } from '../../utils/vcard';
import { recordProfileView, recordVCardDownload, recordShare } from '../../services/storage';
import { generateQrCode } from '../../utils/qrEngine';
import { DynamicGallery } from './DynamicGallery';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Download,
  Share2,
  QrCode,
  Star,
  ExternalLink,
  Check,
  X,
  Edit,
  Camera,
  Maximize2,
  Building2,
  Sparkles
} from 'lucide-react';

interface PublicProfileViewProps {
  profile: ProfileData;
  currentLang: Language;
  onNavigateHome?: () => void;
  onEdit?: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  profile,
  currentLang,
  onNavigateHome,
  onEdit,
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang === 'ar';
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Track profile view on mount
  useEffect(() => {
    recordProfileView(profile.slug);
  }, [profile.slug]);

  // Generate QR for modal
  useEffect(() => {
    const url = window.location.href;
    generateQrCode({ text: url, includeHeartLogo: true }).then(setQrDataUrl);
  }, [profile.slug]);

  const handleDownloadVCard = () => {
    recordVCardDownload(profile.slug);
    const vcardContent = generateVCard({
      fullName: profile.fullName,
      title: profile.title,
      company: profile.company,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      email: profile.email,
      website: profile.website,
      address: profile.address,
      bio: profile.bio,
    });

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.slug}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    recordShare(profile.slug);
    const shareData = {
      title: `${profile.fullName} | ${profile.company}`,
      text: profile.bio || `Connect with ${profile.fullName} on ZakaTy`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        copyCurrentUrl();
      }
    } else {
      copyCurrentUrl();
    }
  };

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Theme color styles
  const getThemeStyles = () => {
    switch (profile.themeColor) {
      case 'rose':
        return {
          primary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
          accent: 'text-rose-600 dark:text-rose-400',
          gradient: 'from-rose-500 via-pink-600 to-rose-700',
          lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
        };
      case 'emerald':
        return {
          primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
          accent: 'text-emerald-600 dark:text-emerald-400',
          gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
          lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
        };
      case 'amber':
        return {
          primary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
          accent: 'text-amber-600 dark:text-amber-400',
          gradient: 'from-amber-500 via-orange-600 to-amber-700',
          lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
        };
      case 'cyan':
        return {
          primary: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25',
          accent: 'text-cyan-600 dark:text-cyan-400',
          gradient: 'from-cyan-500 via-blue-600 to-teal-700',
          lightBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
          border: 'border-cyan-200 dark:border-cyan-800',
        };
      case 'slate':
        return {
          primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25',
          accent: 'text-slate-900 dark:text-slate-200',
          gradient: 'from-slate-700 via-slate-800 to-slate-950',
          lightBg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
          border: 'border-slate-300 dark:border-slate-700',
        };
      default: // indigo
        return {
          primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
          accent: 'text-indigo-600 dark:text-indigo-400',
          gradient: 'from-indigo-600 via-purple-600 to-pink-600',
          lightBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
          border: 'border-indigo-200 dark:border-indigo-800',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white py-6 sm:py-12 px-4 flex flex-col items-center justify-center transition-colors">
      {/* Top Floating App Bar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-4 px-2">
        {onNavigateHome ? (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo size={28} showText={true} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Logo size={28} showText={true} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تعديل البروفايل' : t.common.edit}</span>
            </button>
          )}
          <button
            onClick={copyCurrentUrl}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            title="Copy Public Link"
            aria-label="Copy Public Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main HiHello-style Digital Card */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative transition-all">
        {/* =========================================================================
            SECTION 2: DEDICATED COVER PHOTO BANNER (صورة الغلاف الاحترافية)
            ========================================================================= */}
        <div className="h-48 sm:h-56 relative bg-slate-900 overflow-hidden group">
          {profile.coverUrl ? (
            <img
              src={profile.coverUrl}
              alt="Profile Cover Banner"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
              onClick={() => setCoverModalOpen(true)}
              title={isRtl ? 'اضغط لتكبير صورة الغلاف' : 'Click to view full cover photo'}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center relative`}>
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/40" />
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Top Cover Badges: Category & Quick Edit */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/95 text-[11px] font-bold tracking-wider uppercase border border-white/15 shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.company || profile.category || 'Digital Business Card'}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {profile.coverUrl && (
                <button
                  onClick={() => setCoverModalOpen(true)}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                  title={isRtl ? 'عرض الغلاف كاملاً' : 'View Full Cover'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 transition-colors border border-white/10"
                  title={isRtl ? 'تعديل صورة الغلاف والشعار' : 'Edit Cover & Logo'}
                >
                  <Camera className="w-3 h-3 text-pink-300" />
                  <span>{isRtl ? 'تعديل الغلاف' : 'Edit Cover'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROFILE AVATAR & COMPANY LOGO (الصورة الشخصية وبجانبها الشعار الرسمي)
            ========================================================================= */}
        <div className="px-6 relative -mt-16 sm:-mt-20 flex items-end justify-between">
          <div className="flex items-end gap-3.5">
            {/* Primary Profile Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 bg-white shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Official Company Logo Badge (شعار المؤسسة أو الشركة) */}
            {profile.logoUrl ? (
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-xl border-2 border-white dark:border-slate-800 overflow-hidden mb-1 flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer"
                title={`${profile.company} Official Logo`}
              >
                <img src={profile.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 dark:bg-slate-800/95 p-2 shadow-lg border-2 border-white dark:border-slate-800 mb-1 flex flex-col items-center justify-center shrink-0 text-slate-400 hover:text-indigo-500 transition-colors"
                title="Company / Brand"
              >
                <Building2 className="w-5 h-5 text-indigo-500" />
                <span className="text-[8px] font-bold uppercase mt-0.5 tracking-tight text-slate-500 dark:text-slate-400">
                  {isRtl ? 'شعار' : 'Logo'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons (QR Code & Native Share) */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-all shadow-sm hover:scale-105"
              title={isRtl ? 'رمز QR للمشاركة السريعة' : 'Show QR Code'}
              aria-label="Show QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-all shadow-sm hover:scale-105"
              title={isRtl ? 'مشاركة بطاقة العمل' : 'Share Card'}
              aria-label="Share Card"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="p-6 pt-4 text-start">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {profile.fullName}
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {profile.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${theme.accent}`}>
              {profile.company}
            </span>
            {profile.category && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 font-medium">{profile.category}</span>
              </>
            )}
          </div>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              {profile.bio}
            </p>
          )}

          {/* Primary Action Button: Save Contact (vCard) */}
          <button
            onClick={handleDownloadVCard}
            className={`w-full mt-6 py-3.5 px-4 rounded-2xl ${theme.primary} font-bold text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95`}
          >
            <Download className="w-4 h-4" />
            <span>{isRtl ? 'حفظ جهة الاتصال (vCard)' : t.profile.saveContact}</span>
          </button>

          {/* Google Business Highlights */}
          {(profile.googleLinks.mapsUrl || profile.googleLinks.reviewsUrl) && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Google Business
              </span>

              {profile.googleLinks.reviewsUrl && (
                <a
                  href={profile.googleLinks.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/70 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{isRtl ? 'اكتب تقييماً على جوجل (5 نجوم)' : t.profile.googleReview}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}

              {profile.googleLinks.mapsUrl && (
                <a
                  href={profile.googleLinks.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 text-blue-900 dark:text-blue-200 text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{isRtl ? 'الموقع الجغرافي على خرائط جوجل' : t.profile.googleMap}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
            </div>
          )}

          {/* Direct Contact Items */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {isRtl ? 'معلومات وبيانات الاتصال المباشر' : t.profile.contactDetails}
            </span>

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {isRtl ? 'الهاتف' : 'Telephone'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                    {profile.phone}
                  </p>
                </div>
              </a>
            )}

            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/40 transition-colors border border-emerald-100 dark:border-emerald-900/40"
              >
                <div className="p-1 rounded-xl">
                  <SocialIcon name="whatsapp" size={36} interactive={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">WhatsApp Direct</p>
                  <p className="text-xs sm:text-sm font-semibold truncate text-emerald-950 dark:text-emerald-200">
                    {profile.whatsapp}
                  </p>
                </div>
              </a>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                    {profile.email}
                  </p>
                </div>
              </a>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {isRtl ? 'الموقع الإلكتروني' : 'Website'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </a>
            )}

            {profile.address && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {isRtl ? 'العنوان' : 'Location'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {profile.address}
                  </p>
                </div>
              </div>
            )}

            {profile.openingHours && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {isRtl ? 'ساعات العمل' : 'Opening Hours'}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {profile.openingHours}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              SECTION 3: DYNAMIC PHOTOS GALLERY / PORTFOLIO (الصور الديناميكية)
              ========================================================================= */}
          {profile.galleryImages && profile.galleryImages.length > 0 && (
            <DynamicGallery
              images={profile.galleryImages}
              title={isRtl ? 'معرض الصور الديناميكية والأعمال' : 'Dynamic Photos & Portfolio'}
              isRtl={isRtl}
            />
          )}

          {/* =========================================================================
              SECTION 1: 100% REALISTIC 3D SOCIAL MEDIA ICONS
              ========================================================================= */}
          {Object.entries(profile.socialLinks).some(([_, val]) => !!val) && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isRtl ? 'تواصل عبر شبكات التواصل الاجتماعي' : t.profile.socialLinks}
                </span>
                <span className="text-[10px] font-bold text-indigo-500 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60">
                  3D Interactive
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                {Object.entries(profile.socialLinks).map(([network, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-2xl transition-transform"
                      title={network.toUpperCase()}
                      aria-label={network}
                    >
                      <SocialIcon name={network} size={50} interactive={true} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer note & Powered by ZakaTy */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <span>Card powered by</span>
              <strong className="text-slate-700 dark:text-slate-300">ZakaTy</strong>
              <span>• 100% Free & Private</span>
            </span>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {isRtl ? 'امسح رمز QR للاتصال' : 'Scan to Connect'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-6">
              {isRtl
                ? `افتح تطبيق الكاميرا على هاتفك لعرض ملف ${profile.fullName}`
                : `Open your camera app to view ${profile.fullName}'s profile`}
            </p>

            <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={copyCurrentUrl}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.common.copied : t.common.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Cover Banner Lightbox Modal */}
      {coverModalOpen && profile.coverUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setCoverModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCoverModalOpen(false)}
              className="absolute -top-12 end-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={profile.coverUrl}
              alt="Cover Photo Fullscreen"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
