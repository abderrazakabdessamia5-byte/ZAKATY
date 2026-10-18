import React, { useState, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { generateQrCode, generateQrSvg } from '../../utils/qrEngine';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  MapPin,
  Star,
  Phone,
  Mail,
  Wifi,
  FileText,
  Palette
} from 'lucide-react';

interface QrGeneratorToolProps {
  currentLang: Language;
  onBack: () => void;
  initialText?: string;
}

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({
  currentLang,
  onBack,
  initialText = 'https://zakaty.tools',
}) => {
  const t = translations[currentLang];

  const [contentType, setContentType] = useState<'url' | 'maps' | 'reviews' | 'phone' | 'email' | 'wifi' | 'text'>('url');
  const [contentVal, setContentVal] = useState(initialText);

  // Content type helpers
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');

  // Styling options
  const [darkColor, setDarkColor] = useState('#1e1b4b');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [includeHeartLogo, setIncludeHeartLogo] = useState(true);

  // Result
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute final QR payload
  const getPayload = (): string => {
    switch (contentType) {
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'phone':
        return `tel:${contentVal.trim()}`;
      case 'email':
        return `mailto:${contentVal.trim()}`;
      default:
        return contentVal.trim();
    }
  };

  const updateQr = async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const url = await generateQrCode({
        text: payload,
        darkColor,
        lightColor,
        includeHeartLogo,
      });
      setQrDataUrl(url);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate QR Code.');
    }
  };

  useEffect(() => {
    updateQr();
  }, [contentType, contentVal, wifiSsid, wifiPass, wifiType, darkColor, lightColor, includeHeartLogo]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'ZakaTy_QRCode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = async () => {
    const payload = getPayload();
    if (!payload) return;
    const svgStr = await generateQrSvg({
      text: payload,
      darkColor,
      lightColor,
    });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ZakaTy_QRCode.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const payload = getPayload();
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.qrGenerator.title}
      description={t.tools.qrGenerator.desc}
      categoryName={t.categories.qrNfc}
      supportedFormats={['PNG', 'SVG', 'URL', 'vCard']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Choose Type', desc: 'Select website, Google Maps, Wi-Fi, phone, or custom link.' },
        { step: 2, title: 'Customize Colors', desc: 'Personalize colors and embed the signature ZakaTy heart logo.' },
        { step: 3, title: 'Export & Print', desc: 'Download in ultra-high resolution PNG or vector SVG format.' },
      ]}
      faqs={[
        {
          q: 'Will this QR code expire?',
          a: 'Never! Standard static QR codes encode the data directly into the pixel pattern. They work permanently without third-party redirects.',
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
        {/* Left Form: Content & Customization */}
        <div className="lg:col-span-7 space-y-6">
          {/* Content Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              QR Code Destination
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: 'url', label: 'Website / Profile', icon: Globe },
                { id: 'maps', label: 'Google Maps', icon: MapPin },
                { id: 'reviews', label: 'Google Review', icon: Star },
                { id: 'phone', label: 'Phone Call', icon: Phone },
                { id: 'email', label: 'Email Address', icon: Mail },
                { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
                { id: 'text', label: 'Plain Text', icon: FileText },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setContentType(item.id as any);
                    if (item.id === 'maps') setContentVal('https://maps.google.com/?q=Spain');
                    if (item.id === 'reviews') setContentVal('https://search.google.com/local/writereview?placeid=ChIJgTwKgJcpQg0RaSKMYcHeNsQ');
                    if (item.id === 'url') setContentVal('https://zakaty.tools');
                    if (item.id === 'phone') setContentVal('+34 600 000 000');
                    if (item.id === 'email') setContentVal('abderrazak.abdessamia5@gmail.com');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    contentType === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input field based on type */}
          {contentType !== 'wifi' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                {contentType === 'phone'
                  ? 'Phone Number'
                  : contentType === 'email'
                  ? 'Email Address'
                  : contentType === 'text'
                  ? 'Text Content'
                  : 'Destination Link / URL'}
              </label>
              <input
                type={contentType === 'email' ? 'email' : 'text'}
                value={contentVal}
                onChange={(e) => setContentVal(e.target.value)}
                placeholder={contentType === 'url' ? 'https://...' : 'Enter value...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wi-Fi Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="My Home Wi-Fi"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wi-Fi Password
                </label>
                <input
                  type="password"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Secret password"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>
          )}

          {/* Color & Style Customization */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Design & Colors</span>
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <span className="font-mono text-xs">{darkColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <span className="font-mono text-xs">{lightColor}</span>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={includeHeartLogo}
                onChange={(e) => setIncludeHeartLogo(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Embed ZakaTy Heart-Z emblem in center</span>
            </label>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-[280px] w-full aspect-square flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-20 h-20 text-slate-300 animate-pulse" />
            )}
          </div>

          <p className="text-xs text-slate-500 mt-4 max-w-xs truncate" title={getPayload()}>
            Target: <strong>{getPayload() || 'None'}</strong>
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 w-full mt-6">
            <button
              onClick={handleDownloadPng}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full mt-2 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.common.copied : 'Copy Target Content'}</span>
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};
