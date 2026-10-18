import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { splitPdf } from '../../utils/pdfEngine';
import { validatePdfBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { PDFDocument } from 'pdf-lib';
import {
  Upload,
  Scissors,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileText
} from 'lucide-react';

interface SplitPdfToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const SplitPdfTool: React.FC<SplitPdfToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setResultBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const check = validatePdfBytes(bytes, file.name);

      if (!check.isValid) {
        setErrorMessage(check.error || 'Invalid PDF file.');
        return;
      }

      const doc = await PDFDocument.load(arrayBuffer);
      const count = doc.getPageCount();

      setSelectedFile(file);
      setTotalPages(count);
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err: any) {
      setErrorMessage(`Failed to open PDF: ${err.message}`);
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const blob = await splitPdf(selectedFile, pageRange);
      setResultBlob(blob);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !selectedFile) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZakaTy_Extracted_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTotalPages(0);
    setResultBlob(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.splitPdf.title}
      description={t.tools.splitPdf.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['PDF']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Upload PDF', desc: 'Choose the PDF you want to split or extract pages from.' },
        { step: 2, title: 'Specify Pages', desc: 'Enter page numbers or ranges, e.g. "1, 3-5", or "2-4".' },
        { step: 3, title: 'Extract & Download', desc: 'Click split to instantly receive your new extracted PDF.' },
      ]}
      faqs={[
        {
          q: 'How do I specify multiple separate pages?',
          a: 'Separate page numbers or ranges with commas. For example, "1, 3, 5-7" will extract pages 1, 3, 5, 6, and 7.',
        },
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
            aria-label="Upload PDF to split"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a PDF to split or extract specific pages
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
                <p className="text-xs text-slate-500">
                  Total pages: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{totalPages}</strong> • {formatFileSize(selectedFile.size)}
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

          <div className="space-y-2 text-start">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Page Range to Extract
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">
              Enter specific page numbers or ranges separated by commas (Document contains pages 1 to {totalPages}).
            </p>
          </div>

          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.common.processing}</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Extract Selected Pages</span>
              </>
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
              PDF Extracted Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Extracted size: {formatFileSize(resultBlob.size)}
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
