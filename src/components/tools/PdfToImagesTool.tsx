import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { pdfToImages } from '../../utils/pdfEngine';
import { validatePdfBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileImage,
  Layers
} from 'lucide-react';

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
}

interface PdfToImagesToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const PdfToImagesTool: React.FC<PdfToImagesToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setPages([]);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const check = validatePdfBytes(bytes, file.name);

    if (!check.isValid) {
      setErrorMessage(check.error || 'Invalid PDF file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressMsg('Rendering PDF pages...');

    try {
      const rendered = await pdfToImages(
        selectedFile,
        outputFormat,
        (curr, total) => setProgressMsg(`Rendering page ${curr} of ${total}...`)
      );

      setPages(rendered);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to render PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSinglePage = (page: RenderedPage) => {
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
    const a = document.createElement('a');
    a.href = page.dataUrl;
    a.download = `Page_${page.pageNumber}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllPages = () => {
    pages.forEach((page, i) => {
      setTimeout(() => downloadSinglePage(page), i * 300);
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPages([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.pdfToImages.title}
      description={t.tools.pdfToImages.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['PDF']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Upload PDF', desc: 'Select the PDF document you want to convert into images.' },
        { step: 2, title: 'Choose Format', desc: 'Select JPG for smaller file sizes or PNG for crisp graphics.' },
        { step: 3, title: 'Download Images', desc: 'Download individual pages or save all pages at once.' },
      ]}
      faqs={[
        {
          q: 'What resolution are the extracted images?',
          a: 'Pages are rendered at high 2x DPI scale on HTML5 canvas, ensuring clean text and sharp details.',
        },
      ]}
    >
      {!selectedFile && pages.length === 0 && (
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
            aria-label="Upload PDF to convert to images"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a PDF to convert each page into a separate image
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {selectedFile && pages.length === 0 && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-start">
              <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
            >
              Change file
            </button>
          </div>

          <div className="text-start space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Output Image Format
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="outputFormat"
                  value="image/jpeg"
                  checked={outputFormat === 'image/jpeg'}
                  onChange={() => setOutputFormat('image/jpeg')}
                  className="text-indigo-600"
                />
                <span>JPG (Optimal file size)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="outputFormat"
                  value="image/png"
                  checked={outputFormat === 'image/png'}
                  onChange={() => setOutputFormat('image/png')}
                  className="text-indigo-600"
                />
                <span>PNG (Lossless clarity)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{progressMsg || t.common.processing}</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>Convert to Images</span>
              </>
            )}
          </button>
        </div>
      )}

      {pages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {pages.length} Page(s) Rendered
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadAllPages}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.common.downloadAll}</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t.common.reset}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Page {p.pageNumber}
                  </span>
                  <button
                    onClick={() => downloadSinglePage(p)}
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
