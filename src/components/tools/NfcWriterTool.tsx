import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { checkNfcSupport, writeNfcUrl } from '../../utils/nfcEngine';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  CreditCard,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Radio,
  Sparkles
} from 'lucide-react';

interface NfcWriterToolProps {
  currentLang: Language;
  onBack: () => void;
  initialUrl?: string;
}

export const NfcWriterTool: React.FC<NfcWriterToolProps> = ({
  currentLang,
  onBack,
  initialUrl = 'https://zakaty.tools/p/abdessamia-abderrazak',
}) => {
  const t = translations[currentLang];
  const support = checkNfcSupport();

  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [isWriting, setIsWriting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleWriteNfc = async () => {
    if (!targetUrl.trim()) {
      setErrorMessage('Please enter a valid URL to write to your NFC card.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsWriting(true);

    try {
      const res = await writeNfcUrl(targetUrl.trim(), (status) => setStatusMessage(status));
      setSuccessMessage(res.message);
      setStatusMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to write NFC tag.');
      setStatusMessage(null);
    } finally {
      setIsWriting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.nfcCard.title}
      description={t.tools.nfcCard.desc}
      categoryName={t.categories.qrNfc}
      supportedFormats={['NTAG213', 'NTAG215', 'NTAG216', 'NDEF URL']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Enter Profile Link', desc: 'Paste the public link of your digital business profile.' },
        { step: 2, title: 'Tap Card to Phone', desc: 'Hold your NFC card or sticker near the upper-back of your smartphone.' },
        { step: 3, title: 'Share with a Tap', desc: 'Any smartphone tapping your card will open your profile instantly.' },
      ]}
      faqs={[
        {
          q: 'Which physical NFC cards are compatible?',
          a: 'Any standard NTAG213, NTAG215, or NTAG216 card, sticker, or keyfob works seamlessly with both Apple iPhone (XS and newer) and modern Android devices.',
        },
        {
          q: 'Does someone need an app installed to read my NFC card?',
          a: 'No app is needed! Modern iPhones and Android phones read NDEF URLs automatically from the lock or home screen.',
        },
        {
          q: 'Why does Safari on iPhone not support writing directly in the browser?',
          a: 'Apple currently reserves direct Web NFC writing for native apps. You can use free apps like "NFC Tools" (search App Store) to write your ZakaTy URL to your tag in under 10 seconds.',
        },
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-8 text-start">
        {/* Support status badge */}
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
          support.isSupported
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
        }`}>
          <Radio className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold block mb-0.5">
              {support.isSupported ? 'Web NFC Detected!' : 'Universal NFC Card Setup'}
            </span>
            <span>
              {support.isSupported
                ? 'Your current browser supports direct Web NFC tag programming.'
                : 'Web NFC writing in browser is active on Chrome for Android. On iPhones or other browsers, use our 1-click URL copy with any standard NFC card and the free "NFC Tools" app.'}
            </span>
          </div>
        </div>

        {/* Input Target URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Target URL to Write onto NFC Tag
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://zakaty.tools/p/your-profile"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleCopyUrl}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        {support.isSupported ? (
          <button
            onClick={handleWriteNfc}
            disabled={isWriting}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Radio className="w-5 h-5 animate-pulse" />
            <span>{isWriting ? 'Hold NFC Tag Near Phone...' : 'Write URL to NFC Tag'}</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Step-by-step for iPhone & Other Browsers:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Click <strong>"Copy"</strong> above to copy your profile link.</li>
              <li>Open the free <strong>NFC Tools</strong> app (free on iOS App Store & Google Play).</li>
              <li>Tap <strong>Write</strong> ➔ <strong>Add a record</strong> ➔ <strong>URL / URI</strong>.</li>
              <li>Paste your link and tap <strong>Write / Send</strong>, then touch your physical card!</li>
            </ol>
          </div>
        )}

        {/* Status / Success / Error feedback */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 text-indigo-800 dark:text-indigo-200 text-xs font-medium animate-pulse">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-700 dark:text-red-300 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Visual card preview illustration */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-indigo-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">
                ZakaTy Smart NFC Card
              </span>
            </div>
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-bold tracking-tight">Tap to Connect</h3>
            <p className="text-xs text-slate-300">Compatible with all modern iPhones & Androids</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
            <span>NDEF Standard Tag</span>
            <span>Zero App Required</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
