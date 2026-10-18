import React, { useState } from 'react';
import { Language, ToolCategory, ToolItem } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Search,
  FileText,
  Image as ImageIcon,
  QrCode,
  CreditCard,
  Radio,
  Scissors,
  Layers,
  FileImage,
  Minimize2,
  Stamp,
  RotateCw,
  Crop,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';

interface HomeViewProps {
  currentLang: Language;
  onNavigateToTool: (toolId: string) => void;
  onNavigateToProfiles: () => void;
  allowDonations: boolean;
  coffeeUrl: string;
  paypalUrl: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLang,
  onNavigateToTool,
  onNavigateToProfiles,
  allowDonations,
  coffeeUrl,
  paypalUrl,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');

  const allTools: {
    id: string;
    category: 'pdf' | 'image' | 'qr-nfc' | 'profile';
    title: string;
    description: string;
    icon: any;
    formats: string[];
    badge?: string;
  }[] = [
    {
      id: 'tool-merge-pdf',
      category: 'pdf',
      title: t.tools.mergePdf.title,
      description: t.tools.mergePdf.desc,
      icon: Layers,
      formats: ['PDF'],
      badge: 'Popular',
    },
    {
      id: 'tool-split-pdf',
      category: 'pdf',
      title: t.tools.splitPdf.title,
      description: t.tools.splitPdf.desc,
      icon: Scissors,
      formats: ['PDF'],
    },
    {
      id: 'tool-images-to-pdf',
      category: 'pdf',
      title: t.tools.imagesToPdf.title,
      description: t.tools.imagesToPdf.desc,
      icon: FileImage,
      formats: ['JPG', 'PNG', 'WEBP'],
      badge: 'High Quality',
    },
    {
      id: 'tool-pdf-to-images',
      category: 'pdf',
      title: t.tools.pdfToImages.title,
      description: t.tools.pdfToImages.desc,
      icon: ImageIcon,
      formats: ['PDF'],
    },
    {
      id: 'tool-compress-pdf',
      category: 'pdf',
      title: t.tools.compressPdf.title,
      description: t.tools.compressPdf.desc,
      icon: Minimize2,
      formats: ['PDF'],
    },
    {
      id: 'tool-watermark-pdf',
      category: 'pdf',
      title: t.tools.watermarkPdf.title,
      description: t.tools.watermarkPdf.desc,
      icon: Stamp,
      formats: ['PDF'],
    },
    {
      id: 'tool-image-convert',
      category: 'image',
      title: t.tools.imageConvert.title,
      description: t.tools.imageConvert.desc,
      icon: FileImage,
      formats: ['JPG', 'PNG', 'WEBP'],
      badge: 'Fast',
    },
    {
      id: 'tool-image-resize',
      category: 'image',
      title: t.tools.imageResize.title,
      description: t.tools.imageResize.desc,
      icon: Crop,
      formats: ['JPG', 'PNG', 'WEBP'],
    },
    {
      id: 'tool-image-crop',
      category: 'image',
      title: t.tools.imageCrop.title,
      description: t.tools.imageCrop.desc,
      icon: Crop,
      formats: ['JPG', 'PNG', 'WEBP'],
    },
    {
      id: 'tool-qr-generator',
      category: 'qr-nfc',
      title: t.tools.qrGenerator.title,
      description: t.tools.qrGenerator.desc,
      icon: QrCode,
      formats: ['PNG', 'SVG'],
      badge: 'No Expiry',
    },
    {
      id: 'tool-qr-scanner',
      category: 'qr-nfc',
      title: t.tools.qrScanner.title,
      description: t.tools.qrScanner.desc,
      icon: QrCode,
      formats: ['Camera', 'Image'],
    },
    {
      id: 'tool-nfc-card',
      category: 'qr-nfc',
      title: t.tools.nfcCard.title,
      description: t.tools.nfcCard.desc,
      icon: Radio,
      formats: ['NTAG213/215/216'],
      badge: 'Tap to Share',
    },
  ];

  const filteredTools = allTools.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.formats.some((f) => f.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 2. Hero Section */}
      <section className="pt-10 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.hero.privacyPill}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
          {t.hero.title1}{' '}
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.hero.description}
        </p>

        {/* 3. Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="w-5 h-5 absolute start-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full ps-11 pe-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm shadow-lg shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'all', label: t.categories.all },
            { id: 'pdf', label: t.categories.pdf },
            { id: 'image', label: t.categories.image },
            { id: 'qr-nfc', label: t.categories.qrNfc },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4, 5, 6. Filtered Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between text-start hover:-translate-y-1 duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    {tool.formats.join(', ')}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t.common.open}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <p className="text-sm text-slate-500">{t.hero.noResults}</p>
          </div>
        )}
      </section>

      {/* 7. Digital Business Profile Featured Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden text-start">
          <div className="absolute top-0 end-0 -mt-12 -me-12 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                HiHello Alternative • 100% Free
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Create Your Professional Digital Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Build your independent card with vCard contact export, verified social media icons, Google Review button, and physical NFC compatibility. Share via QR code or tap to phone with zero app download required.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onNavigateToProfiles}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Build Your Free Digital Card</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-56 rounded-3xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden bg-white shadow">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Demo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Abdessamia A.</h4>
                  <p className="text-[11px] text-indigo-300">Lead Architect • Spain</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10 text-[10px] text-slate-200">
                  Tap to Save Contact (vCard)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          How ZakaTy Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10">
          Streamlined, private, and effortless workflow in three simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
              Select or Drop Files
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose your PDF, photos, or enter your contact details. Strict file inspection guarantees only genuine formats are accepted.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
            <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
              Client-Side Processing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Merging, splitting, compressing, and cropping execute entirely inside your device sandbox with WebAssembly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
              Instant Download & Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Save your converted documents instantly or share your published digital card URL with customized QR and NFC tags.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Privacy & Security Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-[32px] bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-start">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.privacy.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.privacy.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
            {t.privacy.desc}
          </p>
        </div>
      </section>

      {/* 10. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center mb-10">
          {t.faq.title}
        </h2>

        <div className="space-y-4">
          {[
            { q: t.faq.q1, a: t.faq.a1 },
            { q: t.faq.q2, a: t.faq.a2 },
            { q: t.faq.q3, a: t.faq.a3 },
            { q: t.faq.q4, a: t.faq.a4 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            >
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {item.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Optional Donation Section */}
      {allowDonations && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <HeartHandshake className="w-10 h-10 text-pink-500 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.donate.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
              {t.donate.desc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {coffeeUrl && (
                <a
                  href={coffeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>☕ {t.donate.buttonCoffee}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {paypalUrl && (
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>💳 {t.donate.buttonPaypal}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
