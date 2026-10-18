import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { convertImage } from '../../utils/imageEngine';
import { validateImageBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileImage
} from 'lucide-react';

interface ConvertedResult {
  fileName: string;
  blob: Blob;
  previewUrl: string;
}

interface ImageConvertToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const ImageConvertTool: React.FC<ImageConvertToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertedResult | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setResult(null);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const check = validateImageBytes(bytes, file.name);

    if (!check.isValid) {
      setErrorMessage(check.error || 'Invalid image file.');
      return;
    }

    setSelectedFile(file);
    setSourcePreviewUrl(URL.createObjectURL(file));
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { blob, fileName } = await convertImage(selectedFile, {
        targetFormat,
        quality,
      });

      const previewUrl = URL.createObjectURL(blob);
      setResult({ fileName, blob, previewUrl });
    } catch (err: any) {
      setErrorMessage(err.message || 'Image conversion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setSelectedFile(null);
    setSourcePreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.imageConvert.title}
      description={t.tools.imageConvert.desc}
      categoryName={t.categories.image}
      supportedFormats={['JPG', 'JPEG', 'PNG', 'WEBP']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Upload Photo', desc: 'Choose any JPEG, PNG, or WebP image from your device.' },
        { step: 2, title: 'Select Target Format', desc: 'Choose WebP for modern web speed, PNG for transparency, or JPEG.' },
        { step: 3, title: 'Download Converted', desc: 'Get your converted image with proper MIME type and format.' },
      ]}
      faqs={[
        {
          q: 'Does WebP offer better compression than JPEG?',
          a: 'Yes! WebP typically achieves 25–35% smaller file sizes compared to JPEG at equivalent visual quality while supporting transparency.',
        },
      ]}
    >
      {!selectedFile && !result && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Upload image to convert"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Convert photos between JPEG, PNG, and WebP
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {selectedFile && !result && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            {sourcePreviewUrl && (
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                <img
                  src={sourcePreviewUrl}
                  alt={selectedFile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-center sm:text-start">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Current format: <strong>{selectedFile.type || 'image'}</strong> • {formatFileSize(selectedFile.size)}
              </p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline font-medium"
              >
                Choose another file
              </button>
            </div>
          </div>

          {/* Target Format Selector */}
          <div className="text-start space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Convert To Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'image/webp', label: 'WEBP', note: 'Modern & Compact' },
                { id: 'image/jpeg', label: 'JPEG / JPG', note: 'Universal Standard' },
                { id: 'image/png', label: 'PNG', note: 'Lossless & Alpha' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setTargetFormat(fmt.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    targetFormat === fmt.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block text-sm">{fmt.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{fmt.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider */}
          <div className="text-start space-y-1">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Compression Quality</span>
              <span className="font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Converting Image...</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>Convert to {targetFormat.replace('image/', '').toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Image Converted Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              File: <strong className="text-slate-800 dark:text-slate-200">{result.fileName}</strong> ({formatFileSize(result.blob.size)})
            </p>
          </div>

          <div className="max-w-xs mx-auto aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-inner">
            <img src={result.previewUrl} alt="Converted" className="w-full h-full object-contain" />
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
