import React from 'react';
import { Logo } from './Logo';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { ShieldCheck, Mail, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onNavigate: (route: string) => void;
  founderName: string;
  founderCountry: string;
  contactEmail: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  founderName,
  founderCountry,
  contactEmail,
}) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-left focus:outline-none"
              aria-label="ZakaTy Home"
            >
              <Logo size={36} />
            </button>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.footer.desc}
            </p>

            {/* Founder attribution & residency */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Heart className="w-3.5 h-3.5 text-pink-500" />
                <span>Founded by {founderName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Country of Residence: {founderCountry}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Client-side execution • Zero file retention</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              {t.categories.pdf}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('tool-merge-pdf')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.mergePdf.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-split-pdf')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.splitPdf.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-images-to-pdf')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.imagesToPdf.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-pdf-to-images')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.pdfToImages.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-compress-pdf')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.compressPdf.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-watermark-pdf')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.watermarkPdf.title}
                </button>
              </li>
            </ul>
          </div>

          {/* Image, QR & Profiles */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Images & Identity
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('tool-image-convert')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.imageConvert.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-image-resize')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.imageResize.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-image-crop')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.imageCrop.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-qr-generator')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.qrGenerator.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool-nfc-card')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.tools.nfcCard.title}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profiles')} className="hover:text-indigo-600 dark:hover:text-white transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  {t.tools.profileBuilder.title}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.termsOfService}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cookies')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.cookiePolicy}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('acceptable-use')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.acceptableUse}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('data-deletion')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.dataDeletion}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.aboutUs}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  {t.footer.contactUs}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{t.footer.copyright}</p>
          <p className="text-slate-400 dark:text-slate-500">
            {t.footer.founderText}
          </p>
        </div>
      </div>
    </footer>
  );
};
