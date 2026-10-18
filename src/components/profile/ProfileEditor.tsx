import React, { useState } from 'react';
import { ProfileData, Language, ThemeColor, CardStyle } from '../../types';
import { translations } from '../../i18n/translations';
import { validateSlug, generateSlug } from '../../utils/slugify';
import { upsertProfile, getStoredProfiles } from '../../services/storage';
import { PublicProfileView } from './PublicProfileView';
import { SocialIcon } from '../common/SocialIcon';
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  Palette,
  Share2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  Camera,
  Layers
} from 'lucide-react';

interface ProfileEditorProps {
  initialProfile?: ProfileData | null;
  currentLang: Language;
  onBack: () => void;
  onSaved: (savedProfile: ProfileData) => void;
}

const COVER_PRESETS = [
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Digital Mesh Gradient',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Creative Abstract Studio',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cyber Tech & Code',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimal Nature Landscape',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Luxury Dark Marble',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
];

const SAMPLE_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialProfile,
  currentLang,
  onBack,
  onSaved,
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang === 'ar';

  const defaultNewProfile: ProfileData = {
    id: `prof_${Date.now()}`,
    slug: 'my-business-card',
    fullName: '',
    title: '',
    company: '',
    category: 'Consulting & Technology',
    bio: '',
    companyDescription: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    logoUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    ],
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    openingHours: '',
    socialLinks: {
      whatsapp: '',
      instagram: '',
      linkedin: '',
      facebook: '',
      x: '',
      youtube: '',
      tiktok: '',
      telegram: '',
      github: '',
    },
    googleLinks: {
      mapsUrl: '',
      reviewsUrl: '',
      businessUrl: '',
    },
    themeColor: 'indigo',
    cardStyle: 'modern',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
    vcardDownloadsCount: 0,
    sharesCount: 0,
  };

  const [formData, setFormData] = useState<ProfileData>(() => {
    if (!initialProfile) return defaultNewProfile;
    return {
      ...initialProfile,
      galleryImages: initialProfile.galleryImages || [],
      socialLinks: {
        ...defaultNewProfile.socialLinks,
        ...initialProfile.socialLinks,
      },
    };
  });

  const [slugError, setSlugError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'branding' | 'gallery' | 'contact' | 'social' | 'google' | 'theme'>('branding');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Handle Slug Change
  const handleSlugChange = (raw: string) => {
    const clean = raw.trim().toLowerCase();
    setFormData((prev) => ({ ...prev, slug: clean }));
    const val = validateSlug(clean);
    if (!val.isValid) {
      setSlugError(val.error || 'Invalid slug.');
    } else {
      const existing = getStoredProfiles().find(
        (p) => p.slug.toLowerCase() === clean && p.id !== formData.id
      );
      if (existing) {
        setSlugError(`"${clean}" is already in use by another profile.`);
      } else {
        setSlugError(null);
      }
    }
  };

  // Generate slug from Name
  const handleAutoSlug = () => {
    if (!formData.fullName) return;
    const generated = generateSlug(formData.fullName);
    handleSlugChange(generated);
  };

  // Upload Avatar
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Cover Photo
  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, coverUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Logo
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Gallery Image
  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), reader.result as string],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Gallery photo by URL
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  // Reorder Gallery
  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.galleryImages || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, galleryImages: list });
  };

  // Remove Gallery Image
  const removeGalleryImage = (index: number) => {
    const list = (formData.galleryImages || []).filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: list });
  };

  // Load sample portfolio
  const handleLoadSamplePortfolio = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: SAMPLE_GALLERY_IMAGES,
    }));
  };

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      alert(isRtl ? 'الرجاء إدخال الاسم الكامل أولاً.' : 'Please enter your full name.');
      setActiveTab('identity');
      return;
    }

    const val = validateSlug(formData.slug);
    if (!val.isValid) {
      setSlugError(val.error || 'Please enter a valid URL slug.');
      setActiveTab('theme');
      return;
    }

    const existing = getStoredProfiles().find(
      (p) => p.slug.toLowerCase() === formData.slug.toLowerCase() && p.id !== formData.id
    );
    if (existing) {
      setSlugError(isRtl ? 'هذا المعرف مأخوذ مسبقاً، الرجاء اختيار معرف آخر.' : 'This slug is already taken. Please choose another.');
      setActiveTab('theme');
      return;
    }

    upsertProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onSaved(formData);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isRtl ? 'العودة إلى البطاقات' : 'Back to Profiles'}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formData.status === 'published' ? t.common.published : t.common.draft}</span>
          </span>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? (isRtl ? 'تم الحفظ!' : 'Saved!') : (isRtl ? 'حفظ ونشر البروفايل' : 'Save & Publish Profile')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customization Form Tabs */}
        <div className="lg:col-span-7 space-y-6 text-start">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold gap-1 custom-scrollbar pb-1">
            {[
              { id: 'branding', label: isRtl ? '١. الغلاف والشعار' : '1. Cover & Logo', icon: Camera },
              { id: 'gallery', label: isRtl ? '٢. الصور الديناميكية' : '2. Dynamic Photos', icon: Layers },
              { id: 'identity', label: isRtl ? '٣. الهوية الشخصية' : '3. Identity', icon: Sparkles },
              { id: 'social', label: isRtl ? '٤. أيقونات التواصل 3D' : '4. 3D Socials', icon: Share2 },
              { id: 'contact', label: isRtl ? '٥. بيانات الاتصال' : '5. Contact', icon: Building2 },
              { id: 'google', label: isRtl ? '٦. أعمال جوجل' : '6. Google', icon: ExternalLink },
              { id: 'theme', label: isRtl ? '٧. الرابط والمظهر' : '7. URL & Style', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              TAB: COVER PHOTO & LOGO (قسم صورة الغلاف والشعار)
              ========================================================================= */}
          {activeTab === 'branding' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Cover Banner Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-pink-500" />
                      <span>{isRtl ? 'صورة الغلاف (Cover Photo / Banner)' : 'Cover Photo / Banner'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'تظهر أعلى بطاقتك الشخصية بمظهر جذاب ومتناسق مع الشعار والهوية (أبعاد مفضلة: 1200x450).'
                        : 'Displays as a prominent banner at the top of your profile card (recommended: 1200x450).'}
                    </p>
                  </div>
                  {formData.coverUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverUrl: '' })}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      {isRtl ? 'إزالة الغلاف' : 'Remove Cover'}
                    </button>
                  )}
                </div>

                {/* Live Cover Preview */}
                <div className="h-32 sm:h-40 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-700 mb-4 shadow-inner">
                  {formData.coverUrl ? (
                    <img
                      src={formData.coverUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white/80 text-xs font-semibold">
                      {isRtl ? 'تدرج افتراضي أنيق بدون صورة' : 'Default Brand Gradient'}
                    </div>
                  )}
                </div>

                {/* Upload & URL Input for Cover */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={formData.coverUrl || ''}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder={isRtl ? 'أدخل رابط صورة الغلاف https://...' : 'Enter cover image URL https://...'}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                  <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رفع من الجهاز' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
                  </label>
                </div>

                {/* One-Click Cover Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    {isRtl ? 'اختر غلافاً احترافياً جاهزاً بنقرة واحدة:' : 'Or Pick a Curated 4K Banner Preset:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COVER_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverUrl: p.url })}
                        className={`group relative h-16 rounded-xl overflow-hidden border-2 text-start transition-all ${
                          formData.coverUrl === p.url
                            ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-[1.02]'
                            : 'border-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <span className="absolute bottom-1 inset-x-1.5 text-[10px] font-bold text-white truncate drop-shadow">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Logo Section (الشعار الرسمي بجانب الصورة) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span>{isRtl ? 'شعار الشركة أو العلامة التجارية (Company Logo)' : 'Company / Brand Logo'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'يظهر في مربع ثلاثي الأبعاد بجانب صورتك الشخصية وفوق الغلاف مباشرة.'
                        : 'Displays alongside your profile avatar right over the cover banner.'}
                    </p>
                  </div>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      {isRtl ? 'إزالة الشعار' : 'Remove Logo'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Logo Preview box */}
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center p-2 shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Logo inputs */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder={isRtl ? 'رابط الشعار https://...' : 'Logo URL https://...'}
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                      />
                      <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'رفع' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={handleLogoFile} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DYNAMIC PHOTOS GALLERY (قسم الصور الديناميكية ومعرض الأعمال)
              ========================================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-pink-500" />
                      <span>{isRtl ? 'معرض الصور الديناميكية المتحرك' : 'Dynamic Photos & Portfolio'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'تتحرك هذه الصور تلقائياً وبسلاسة مع شريط تقدم وتكبير في شاشة كاملة.'
                        : 'Animated carousel that plays automatically with progress indicator & fullscreen lightbox.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoadSamplePortfolio}
                    className="px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-xs font-bold hover:bg-pink-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحميل صور تجريبية' : 'Load Sample Portfolio'}</span>
                  </button>
                </div>

                {/* Add Photo controls */}
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder={isRtl ? 'أدخل رابط صورة لإضافتها https://...' : 'Enter image URL to add https://...'}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إضافة' : 'Add'}</span>
                  </button>
                  <label className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رفع' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleGalleryFile} className="hidden" />
                  </label>
                </div>

                {/* Photo Items List with Reorder and Delete */}
                {(!formData.galleryImages || formData.galleryImages.length === 0) ? (
                  <div className="p-8 text-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                    <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isRtl ? 'لا توجد صور في المعرض بعد' : 'No photos in dynamic gallery yet'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      {isRtl ? 'أضف صور مشاريعك أو انقر على الزر أعلاه لتحميل نماذج فورية.' : 'Add your project photos or click above to load samples.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleLoadSamplePortfolio}
                      className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-sm"
                    >
                      {isRtl ? 'تحميل ٤ نماذج أعمال فوراً' : 'Load 4 Sample Photos Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {formData.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {isRtl ? `صورة ديناميكية #${idx + 1}` : `Photo #${idx + 1}`}
                          </span>
                          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                            {img}
                          </p>
                        </div>

                        {/* Order & Delete actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(idx, 'down')}
                            disabled={idx === (formData.galleryImages?.length || 0) - 1}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: IDENTITY (الهوية الشخصية)
              ========================================================================= */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. ABDESSAMIA ABDERRAZAK"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'المسمى الوظيفي / المهنة' : 'Job Title / Profession'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Lead Software Architect"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'اسم الشركة أو المؤسسة' : 'Company / Brand Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. ZakaTy Global"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'مجال العمل أو التخصص' : 'Industry / Business Category'}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Software, Design, Architecture, Healthcare"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'نبذة تعريفية قصيرة' : 'Short Biography / Elevator Pitch'}
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about your mission, services, or credentials..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'الصورة الشخصية (رابط أو رفع)' : 'Profile Photo (URL or Upload)'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                  <label className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{isRtl ? 'رفع' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: 3D REALISTIC SOCIAL MEDIA ICONS (أيقونات التواصل ثلاثية الأبعاد)
              ========================================================================= */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <p className="text-xs text-indigo-900 dark:text-indigo-200">
                  {isRtl
                    ? 'تم تصميم جميع الأيقونات بدقة ثلاثية الأبعاد 100% (3D Realistic) مع مؤثرات حركية فائقة وانعكاسات زجاجية عند التمرير.'
                    : 'All icons feature authentic 100% 3D realistic rendering with glassy bevels, specular reflections, and animated hover physics.'}
                </p>
              </div>

              {[
                { key: 'whatsapp', label: 'WhatsApp Direct (wa.me)', network: 'whatsapp' },
                { key: 'instagram', label: 'Instagram Profile', network: 'instagram' },
                { key: 'linkedin', label: 'LinkedIn Profile', network: 'linkedin' },
                { key: 'facebook', label: 'Facebook Page', network: 'facebook' },
                { key: 'x', label: 'X (Twitter) Profile', network: 'x' },
                { key: 'youtube', label: 'YouTube Channel', network: 'youtube' },
                { key: 'tiktok', label: 'TikTok Account', network: 'tiktok' },
                { key: 'telegram', label: 'Telegram Direct Link', network: 'telegram' },
                { key: 'github', label: 'GitHub Repository / Account', network: 'github' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="shrink-0 p-1">
                    <SocialIcon name={item.network} size={42} interactive={true} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      {item.label}
                    </label>
                    <input
                      type="url"
                      value={(formData.socialLinks as any)[item.key] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [item.key]: e.target.value },
                        })
                      }
                      placeholder={`https://${item.key}.com/...`}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================================
              TAB: CONTACT DETAILS (بيانات الاتصال)
              ========================================================================= */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'رقم الهاتف' : 'Telephone'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'رقم الواتساب' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'رابط الموقع الإلكتروني' : 'Website URL'}
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'العنوان الجغرافي' : 'Physical Address'}
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Madrid / Barcelona, Spain"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'أوقات وساعات العمل' : 'Business Opening Hours'}
                </label>
                <input
                  type="text"
                  value={formData.openingHours || ''}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="e.g. Mon - Fri: 09:00 - 18:00 (CET)"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: GOOGLE BUSINESS
              ========================================================================= */}
          {activeTab === 'google' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-slate-500">
                {isRtl
                  ? 'اربط حساب Google Business لتحصل على تقييمات 5 نجوم وتوجيه مباشر على خرائط جوجل.'
                  : 'Connect your verified Google Business profile to get instant 5-star reviews and direct map navigation.'}
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'رابط الموقع على خرائط جوجل' : 'Google Maps Location Link'}
                </label>
                <input
                  type="url"
                  value={formData.googleLinks.mapsUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleLinks: { ...formData.googleLinks, mapsUrl: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'رابط كتابة تقييم جوجل (Write Review)' : 'Google Reviews Write Link'}
                </label>
                <input
                  type="url"
                  value={formData.googleLinks.reviewsUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleLinks: { ...formData.googleLinks, reviewsUrl: e.target.value },
                    })
                  }
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: URL SLUG & THEME COLOR
              ========================================================================= */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* URL Handle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isRtl ? 'المعرف الفريد لرابط البروفايل *' : 'Profile Handle / Slug *'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    {isRtl ? 'توليد تلقائي من الاسم' : 'Generate from name'}
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 rounded-s-xl bg-slate-100 dark:bg-slate-800 border border-e-0 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                    #/p/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-company"
                    className="flex-1 px-4 py-2.5 rounded-e-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                  />
                </div>
                {slugError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{slugError}</p>
                )}
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {isRtl ? 'لون السمة والزر الرئيسي' : 'Accent Color'}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(['indigo', 'rose', 'emerald', 'amber', 'cyan', 'slate'] as ThemeColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, themeColor: c })}
                      className={`h-11 rounded-xl border-2 flex items-center justify-center transition-all ${
                        formData.themeColor === c ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent'
                      } ${
                        c === 'indigo'
                          ? 'bg-indigo-600'
                          : c === 'rose'
                          ? 'bg-rose-600'
                          : c === 'emerald'
                          ? 'bg-emerald-600'
                          : c === 'amber'
                          ? 'bg-amber-600'
                          : c === 'cyan'
                          ? 'bg-cyan-600'
                          : 'bg-slate-900'
                      }`}
                    >
                      {formData.themeColor === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {isRtl ? 'حالة النشر' : 'Publication Status'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'published' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.status === 'published'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isRtl ? 'منشور للعامة' : 'Publicly Published'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.status === 'draft'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isRtl ? 'مسودة (خاصة)' : 'Draft Mode (Private)'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Interactive Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isRtl ? 'معاينة الهاتف' : 'Mobile Card'}</span>
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isRtl ? 'معاينة الحاسوب' : 'Desktop Frame'}</span>
            </button>
          </div>

          {/* Interactive Mobile/Desktop Frame */}
          <div className="w-full max-w-sm rounded-[38px] p-2 bg-slate-900 shadow-2xl border-4 border-slate-800">
            {/* Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-1" />

            <div className="max-h-[660px] overflow-y-auto rounded-[30px] bg-slate-100 dark:bg-slate-950 custom-scrollbar">
              <PublicProfileView profile={formData} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
