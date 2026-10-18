import React, { useState } from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  ShieldCheck,
  FileText,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Heart,
  Lock,
  Send,
  Trash2
} from 'lucide-react';

interface LegalPagesProps {
  page: 'privacy' | 'terms' | 'cookies' | 'about' | 'contact' | 'acceptable-use' | 'data-deletion';
  currentLang: Language;
  onNavigate: (route: string) => void;
  founderName: string;
  founderCountry: string;
  contactEmail: string;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  page,
  currentLang,
  onNavigate,
  founderName,
  founderCountry,
  contactEmail,
}) => {
  const t = translations[currentLang];

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactFromEmail, setContactFromEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactFromEmail || !contactMessage) return;

    // Simulate validated delivery & provide mailto option
    setContactSubmitted(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-start">
      {/* Privacy Policy */}
      {page === 'privacy' && (
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR & Spanish LOPD-GDD Compliant</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Core Privacy Principle: Zero File Retention</h2>
            <p>
              At <strong>ZakaTy</strong>, privacy is not an afterthought; it is our fundamental architectural design. All PDF files, photographs, graphic assets, and documents processed using ZakaTy tools are handled <strong>entirely inside your client web browser</strong> using WebAssembly, JavaScript, and HTML5 Canvas.
            </p>
            <p>
              <strong>Your files are never transmitted, uploaded, stored, or copied to any remote server or third party.</strong> Once you close or reload your browser tab, memory allocated to your documents is immediately purged by your device operating system.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">2. Digital Business Profiles Data</h2>
            <p>
              When you intentionally create and publish a digital business card, the information you explicitly provide (such as your full name, title, contact numbers, email address, social media links, and avatar image) is stored in local browser persistence to serve your public profile URL.
            </p>
            <p>
              You maintain 100% control over your profile at all times: you may edit, unpublish, or permanently delete your profile at any time with a single click.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">3. Data Controller & Rights</h2>
            <p>
              Responsible Party: <strong>{founderName}</strong> (Country of residence: <strong>{founderCountry}</strong>).
            </p>
            <p>
              Under the European Union General Data Protection Regulation (GDPR) and the Spanish Organic Law 3/2018 (LOPD-GDD), you have the right to access, rectify, restrict, or request permanent erasure of any data associated with your account by contacting <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a>.
            </p>
          </section>
        </article>
      )}

      {/* Terms of Service */}
      {page === 'terms' && (
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026</p>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ZakaTy, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">2. Permitted Use</h2>
            <p>
              ZakaTy tools are provided free of charge for personal and commercial file processing and digital business profile creation. You agree not to use the platform to publish defamatory, infringing, abusive, or unlawful content.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">3. Disclaimer of Warranties</h2>
            <p>
              ZakaTy is provided "as is" and "as available" without warranties of any kind. While we rigorously test all browser file processing algorithms, you should always maintain backups of important documents.
            </p>
          </section>
        </article>
      )}

      {/* Cookie Policy */}
      {page === 'cookies' && (
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cookie & Storage Policy
          </h1>
          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              ZakaTy strictly minimizes data storage. We do not use third-party tracking cookies or advertising pixels.
            </p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">Essential Storage Keys</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><code>zakaty_lang</code>: Remembers your selected language (English, Arabic, French, Spanish).</li>
              <li><code>zakaty_theme</code>: Remembers your light or dark mode preference.</li>
              <li><code>zakaty_cookie_consent</code>: Stores your cookie preference decision.</li>
              <li><code>zakaty_digital_profiles_v1</code>: Locally caches your created digital business profiles.</li>
            </ul>
          </section>
        </article>
      )}

      {/* About Us */}
      {page === 'about' && (
        <article className="space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About ZakaTy
          </h1>

          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span>Our Mission & Origin</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>ZakaTy</strong> was created to solve a persistent frustration on the modern web: basic online file tools (like merging two PDFs or resizing a photo) that demand monthly subscriptions, lock files behind paywalls, or secretly upload confidential contracts to overseas servers.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We paired 100% free, private browser utilities with an intuitive digital business card builder inspired by HiHello, allowing professionals, freelancers, and businesses worldwide to share their identities instantly via QR codes and NFC cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Founder & Lead Architect
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {founderName}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Residence: {founderCountry}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{contactEmail}</span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Security & Philosophy
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Client-Side Engine
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We believe security begins by never possessing what we don't need. Your documents stay exclusively on your hardware.
              </p>
            </div>
          </div>
        </article>
      )}

      {/* Contact Us */}
      {page === 'contact' && (
        <article className="space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact ZakaTy
          </h1>
          <p className="text-sm text-slate-500">
            Have questions, feedback, or a partnership inquiry? Get in touch with our team.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Message Prepared!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your message has been validated. You can also send directly from your email client to <a href={`mailto:${contactEmail}`} className="text-indigo-600 font-semibold">{contactEmail}</a>.
                  </p>
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactMessage)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Email App</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={contactFromEmail}
                      onChange={(e) => setContactFromEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Inquiry about ZakaTy"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Official Communication
                </span>
                <p className="text-slate-500 leading-relaxed">
                  For formal inquiries, bug reports, and data protection requests:
                </p>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contactEmail}`} className="underline">
                    {contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>Spain (EU)</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Acceptable Use */}
      {page === 'acceptable-use' && (
        <article className="prose dark:prose-invert max-w-none space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Acceptable Use Policy
          </h1>
          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Users must not use ZakaTy tools or digital business cards to distribute malicious software, phishing links, hate speech, or deceptive fraudulent profiles.
            </p>
            <p>
              Profiles found to be in violation of public safety or intellectual property rights are subject to immediate termination.
            </p>
          </section>
        </article>
      )}

      {/* Data Deletion Instructions */}
      {page === 'data-deletion' && (
        <article className="space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Deletion Instructions
          </h1>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
              <Trash2 className="w-5 h-5" />
              <span>Self-Service & Instant Erasure</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Because all document processing takes place directly on your computer without being stored on our servers, there are no remote document copies to delete.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To delete a digital business card you published:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              <li>Navigate to <strong>Digital Profiles</strong> in the top menu.</li>
              <li>Locate your profile card.</li>
              <li>Click the trash can icon (<strong>Delete</strong>).</li>
              <li>The profile and all associated data will be erased immediately.</li>
            </ol>
            <p className="text-xs text-slate-500 pt-2">
              For any additional inquiries, email <a href={`mailto:${contactEmail}`} className="text-indigo-600 underline">{contactEmail}</a>.
            </p>
          </div>
        </article>
      )}
    </div>
  );
};
