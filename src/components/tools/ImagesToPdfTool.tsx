import React, { useState, useRef } from 'react';
import { ToolLayout } from './ToolLayout';
import { imagesToPdf } from '../../utils/pdfEngine';
import { validateImageBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  FileImage,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number;
}

interface ImagesToPdfToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const ImagesToPdfTool: React.FC<ImagesToPdfToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4'>('fit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState('');

  // Handle file addition with strict byte validation
  const handleFilesAdded = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);
    setResultBlob(null);

    const newItems: ImageItem[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // File size safety check (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds the maximum allowed size of 50MB.`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Strict magic bytes inspection (CRITICAL: rejects PDF renamed to .jpg or corrupt files)
        const check = validateImageBytes(bytes, file.name);
        if (!check.isValid) {
          errors.push(check.error || `"${file.name}" is not a valid image.`);
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl,
          rotation: 0,
        });
      } catch (err: any) {
        errors.push(`Error reading "${file.name}": ${err.message || 'unknown error'}`);
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesAdded(e.dataTransfer.files);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
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
    setImages((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const rotateItem = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], rotation: (copy[index].rotation + 90) % 360 };
      return copy;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setErrorMessage('Please add at least one valid image.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressMsg('Initializing PDF generator...');

    try {
      const blob = await imagesToPdf(
        images.map((img) => ({ file: img.file, rotation: img.rotation })),
        pageSize,
        (msg) => setProgressMsg(msg)
      );

      setResultBlob(blob);
      setResultFileName(`ZakaTy_Converted_${Date.now()}.pdf`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to convert images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFileName || 'ZakaTy_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setResultBlob(null);
    setErrorMessage(null);
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.imagesToPdf.title}
      description={t.tools.imagesToPdf.desc}
      categoryName={t.categories.pdf}
      supportedFormats={['JPG', 'JPEG', 'PNG', 'WEBP']}
      maxSize="50 MB per file"
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Select Images', desc: 'Choose genuine JPEG, PNG, or WebP photos from your device.' },
        { step: 2, title: 'Arrange & Rotate', desc: 'Reorder your images with arrow controls and rotate orientation as needed.' },
        { step: 3, title: 'Create & Download', desc: 'Choose natural fit or standard A4 format and download your unified PDF.' },
      ]}
      faqs={[
        {
          q: 'Will PDF files be accepted as images?',
          a: 'No. ZakaTy strictly inspects binary file headers. A PDF file renamed to .jpg or .png is immediately detected and rejected to protect document integrity.',
        },
        {
          q: 'Is there a limit on how many images I can convert?',
          a: 'You can convert dozens of images in one batch. Processing is executed in your browser without uploading to any server.',
        },
      ]}
    >
      {/* Upload Zone */}
      {images.length === 0 && !resultBlob && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/20"
        >
          {/* Strictly image accept filter */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleFilesAdded(e.target.files)}
            className="hidden"
            aria-label="Upload Images"
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
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            JPEG, PNG, WebP only • PDF rejected automatically
          </span>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Selected Images List & Ordering */}
      {images.length > 0 && !resultBlob && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <FileImage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{images.length} Image(s) selected</span>
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              + Add More Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Grid of Preview Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Page number badge */}
                <span className="absolute top-3 start-3 z-10 w-6 h-6 rounded-full bg-slate-900/80 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>

                {/* Thumbnail image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center relative">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full h-full object-contain transition-transform"
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                  />
                </div>

                <div className="mt-2 text-start">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={item.file.name}>
                    {item.file.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>

                {/* Controls (Move Up/Down, Rotate, Delete) */}
                <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      aria-label="Move left/up"
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === images.length - 1}
                      aria-label="Move right/down"
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => rotateItem(index)}
                      aria-label="Rotate image"
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Rotate 90°"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    aria-label="Remove image"
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Configuration Options */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Page Layout Format:
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pageSize"
                    checked={pageSize === 'fit'}
                    onChange={() => setPageSize('fit')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Natural Fit (Match photo dimensions)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pageSize"
                    checked={pageSize === 'a4'}
                    onChange={() => setPageSize('a4')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Standard A4 Page (Centered)</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline font-medium"
            >
              Clear All Images
            </button>
          </div>

          {/* Action Button */}
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
                <FileCheck className="w-5 h-5" />
                <span>Convert {images.length} Image(s) to PDF</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Success & Download View */}
      {resultBlob && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              PDF Created Successfully!
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
