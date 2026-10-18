import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { compressPdf } from '../../utils/pdfEngine';
import { validatePdfBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Minimize2,
  FileText
} from 'lucide-react';

interface CompressPdfToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const CompressPdfTool: React.FC<CompressPdfToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; compressedSize: number } | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setResult(null);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const check = validatePdfBytes(bytes, file.name);

    if (!check.isValid) {
      setErrorMessage(check.error || 'Invalid PDF file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await compressPdf(selectedFile);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compressed_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentageSaved = result
    ? Math.max(0, Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100))
    : 0;

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.compressPdf.title}
      description={t.tools.compressPdf.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['PDF']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Upload PDF', desc: 'Choose the document you wish to optimize and compress.' },
        { step: 2, title: 'Stream Compression', desc: 'Rebuild internal object streams and remove redundant metadata.' },
        { step: 3, title: 'Download Result', desc: 'Download your streamlined PDF with reduced file size.' },
      ]}
      faqs={[
        {
          q: 'Does compression degrade document text clarity?',
          a: 'No. Vector fonts, typography curves, and document text remain 100% crisp and readable.',
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
            accept="application/pdf,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Upload PDF to compress"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload PDF to optimize structure and shrink file footprint
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
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div className="text-start">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  Current size: <strong>{formatFileSize(selectedFile.size)}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
            >
              Change file
            </button>
          </div>

          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Optimizing PDF...</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Compress PDF Now</span>
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              PDF Compression Finished!
            </h3>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center min-w-28">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Original</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  {formatFileSize(result.originalSize)}
                </span>
              </div>
              <div className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">➔</div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center min-w-28">
                <span className="text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">Optimized</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">
                  {formatFileSize(result.compressedSize)}
                </span>
              </div>
            </div>
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
