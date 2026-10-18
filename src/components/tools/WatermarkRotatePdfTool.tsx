import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { watermarkPdf, rotatePdf, addPageNumbers } from '../../utils/pdfEngine';
import { validatePdfBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Stamp,
  RotateCw,
  Hash,
  FileText
} from 'lucide-react';

interface WatermarkRotatePdfToolProps {
  currentLang: Language;
  onBack: () => void;
  defaultTab?: 'watermark' | 'rotate' | 'numbers';
}

export const WatermarkRotatePdfTool: React.FC<WatermarkRotatePdfToolProps> = ({
  currentLang,
  onBack,
  defaultTab = 'watermark',
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'watermark' | 'rotate' | 'numbers'>(defaultTab);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setResultBlob(null);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const check = validatePdfBytes(bytes, file.name);

    if (!check.isValid) {
      setErrorMessage(check.error || 'Invalid PDF file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleExecute = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let blob: Blob;
      if (activeTab === 'watermark') {
        blob = await watermarkPdf(selectedFile, watermarkText, opacity);
      } else if (activeTab === 'rotate') {
        blob = await rotatePdf(selectedFile, rotationAngle);
      } else {
        blob = await addPageNumbers(selectedFile);
      }

      setResultBlob(blob);
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !selectedFile) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enhanced_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResultBlob(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.watermarkPdf.title}
      description={t.tools.watermarkPdf.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['PDF']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Choose Document', desc: 'Select any PDF document from your device.' },
        { step: 2, title: 'Configure Options', desc: 'Set watermark stamp text, rotate pages, or stamp automatic numbering.' },
        { step: 3, title: 'Apply & Save', desc: 'Download your stamped and formatted PDF in seconds.' },
      ]}
    >
      {!selectedFile && !resultBlob && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Upload PDF"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload PDF to watermark, rotate, or add page numbers
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {selectedFile && !resultBlob && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div className="text-start">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
            >
              Change file
            </button>
          </div>

          {/* Action Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('watermark')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'watermark'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Stamp className="w-4 h-4" />
              <span>Watermark Text</span>
            </button>
            <button
              onClick={() => setActiveTab('rotate')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'rotate'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate Pages</span>
            </button>
            <button
              onClick={() => setActiveTab('numbers')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'numbers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span>Page Numbers</span>
            </button>
          </div>

          {/* Tab Specific Options */}
          {activeTab === 'watermark' && (
            <div className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, COPY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Watermark Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'rotate' && (
            <div className="space-y-3 text-start">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rotation Angle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setRotationAngle(deg as any)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      rotationAngle === deg
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Rotate {deg}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-start text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">
                Standard "Page X of Y" Footer Stamp
              </p>
              <p>Numbers will be added cleanly to the bottom-center of every page in your document.</p>
            </div>
          )}

          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Process PDF Document</span>
            )}
          </button>
        </div>
      )}

      {resultBlob && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Document Ready!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Size: {formatFileSize(resultBlob.size)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{t.common.downloadResult}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
            >
              {t.common.reset}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
