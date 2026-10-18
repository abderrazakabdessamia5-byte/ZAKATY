import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { mergePdfs } from '../../utils/pdfEngine';
import { validatePdfBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Layers
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
}

interface MergePdfToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const MergePdfTool: React.FC<MergePdfToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState('');

  const handleFilesAdded = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);
    setResultBlob(null);

    const newItems: PdfFileItem[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 80 * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds the 80MB size limit.`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const check = validatePdfBytes(bytes, file.name);

        if (!check.isValid) {
          errors.push(check.error || `"${file.name}" is not a valid PDF.`);
          continue;
        }

        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
        });
      } catch (err: any) {
        errors.push(`Error reading "${file.name}": ${err.message}`);
      }
    }

    if (errors.length > 0) setErrorMessage(errors.join(' '));
    if (newItems.length > 0) setFiles((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setFiles((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMessage('Please select at least two PDF documents to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressMsg('Combining PDF documents...');

    try {
      const blob = await mergePdfs(
        files.map((f) => f.file),
        (msg) => setProgressMsg(msg)
      );

      setResultBlob(blob);
      setResultFileName(`ZakaTy_Merged_${Date.now()}.pdf`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to merge PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFileName || 'Merged_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setErrorMessage(null);
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.mergePdf.title}
      description={t.tools.mergePdf.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['PDF']}
      maxSize="80 MB per document"
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Select PDFs', desc: 'Choose two or more PDF files you want to combine into one.' },
        { step: 2, title: 'Order Pages', desc: 'Use the up/down arrows to position files in your desired order.' },
        { step: 3, title: 'Merge & Download', desc: 'Click merge to assemble all pages and download the combined document.' },
      ]}
      faqs={[
        {
          q: 'Will my original PDFs be altered?',
          a: 'No. Your original files remain completely untouched on your device. A new merged document is created.',
        },
        {
          q: 'Are bookmarks or links preserved?',
          a: 'Standard page content, vector graphics, and text fonts are preserved cleanly across all merged pages.',
        },
      ]}
    >
      {files.length === 0 && !resultBlob && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFilesAdded(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf,.pdf"
            onChange={(e) => handleFilesAdded(e.target.files)}
            className="hidden"
            aria-label="Upload PDF files"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {t.common.dropFilesHere}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {files.length > 0 && !resultBlob && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{files.length} Document(s) selected</span>
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              + Add More PDFs
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden"
            />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
            {files.map((item, index) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0 text-start">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === files.length - 1}
                    aria-label="Move down"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    aria-label="Remove"
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline font-medium"
            >
              Clear All
            </button>
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{progressMsg || t.common.processing}</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Merge {files.length} PDFs</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {resultBlob && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              PDFs Merged Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              File: <strong className="text-slate-800 dark:text-slate-200">{resultFileName}</strong> ({formatFileSize(resultBlob.size)})
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
