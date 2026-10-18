import React from 'react';
import { ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface ToolLayoutProps {
  currentLang: Language;
  title: string;
  description: string;
  categoryName: string;
  supportedFormats: string[];
  maxSize?: string;
  onBack: () => void;
  instructions?: { step: number; title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  currentLang,
  title,
  description,
  categoryName,
  supportedFormats,
  maxSize = '50 MB',
  onBack,
  instructions,
  faqs,
  children,
}) => {
  const t = translations[currentLang];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.common.backToTools}</span>
        </button>
        <span>/</span>
        <span>{categoryName}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">{title}</span>
      </div>

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Browser-side execution • 100% Private</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Formats and size badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {t.common.formats}: <strong className="text-slate-900 dark:text-white">{supportedFormats.join(', ')}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {t.common.maxSize}: <strong className="text-slate-900 dark:text-white">{maxSize}</strong>
          </span>
        </div>
      </div>

      {/* Main Tool Interactive Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80 mb-12">
        {children}
      </div>

      {/* Step by step instructions */}
      {instructions && instructions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">
            How to use {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructions.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-start"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  {step.step}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Specific FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
              >
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{faq.q}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
