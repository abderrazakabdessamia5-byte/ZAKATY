import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { resizeImage, cropImage, rotateFlipImage, loadImageFromFile } from '../../utils/imageEngine';
import { validateImageBytes, formatFileSize } from '../../utils/fileValidation';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Crop,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock
} from 'lucide-react';

interface ImageResizeCropToolProps {
  currentLang: Language;
  onBack: () => void;
  defaultMode?: 'resize' | 'crop' | 'transform';
}

export const ImageResizeCropTool: React.FC<ImageResizeCropToolProps> = ({
  currentLang,
  onBack,
  defaultMode = 'resize',
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'resize' | 'crop' | 'transform'>(defaultMode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Resize state
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Crop state
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9'>('1:1');

  // Transform state
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string; previewUrl: string } | null>(null);

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

    try {
      const img = await loadImageFromFile(file);
      setSelectedFile(file);
      setSourceImg(img);
      setPreviewUrl(img.src);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    } catch (err: any) {
      setErrorMessage(`Failed to load image: ${err.message}`);
    }
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && aspectRatio > 0) {
      setTargetHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && aspectRatio > 0) {
      setTargetWidth(Math.round(h * aspectRatio));
    }
  };

  const applyPercentage = (pct: number) => {
    if (!sourceImg) return;
    const w = Math.round((sourceImg.naturalWidth * pct) / 100);
    const h = Math.round((sourceImg.naturalHeight * pct) / 100);
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const handleExecute = async () => {
    if (!selectedFile || !sourceImg) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let res: { blob: Blob; fileName: string };

      if (activeTab === 'resize') {
        res = await resizeImage(selectedFile, {
          width: targetWidth,
          height: targetHeight,
        });
      } else if (activeTab === 'crop') {
        // Calculate crop box
        const naturalW = sourceImg.naturalWidth;
        const naturalH = sourceImg.naturalHeight;
        let cropW = naturalW;
        let cropH = naturalH;

        if (cropAspect === '1:1') {
          const side = Math.min(naturalW, naturalH);
          cropW = side;
          cropH = side;
        } else if (cropAspect === '4:3') {
          if (naturalW / naturalH > 4 / 3) {
            cropH = naturalH;
            cropW = Math.round(naturalH * (4 / 3));
          } else {
            cropW = naturalW;
            cropH = Math.round(naturalW * (3 / 4));
          }
        } else if (cropAspect === '16:9') {
          if (naturalW / naturalH > 16 / 9) {
            cropH = naturalH;
            cropW = Math.round(naturalH * (16 / 9));
          } else {
            cropW = naturalW;
            cropH = Math.round(naturalW * (9 / 16));
          }
        }

        const cropX = Math.round((naturalW - cropW) / 2);
        const cropY = Math.round((naturalH - cropH) / 2);

        res = await cropImage(selectedFile, {
          x: cropX,
          y: cropY,
          width: cropW,
          height: cropH,
        });
      } else {
        res = await rotateFlipImage(selectedFile, {
          rotation,
          flipHorizontal: flipH,
          flipVertical: flipV,
        });
      }

      const resPreview = URL.createObjectURL(res.blob);
      setResult({ ...res, previewUrl: resPreview });
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed.');
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
    setSelectedFile(null);
    setSourceImg(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout
      currentLang={currentLang}
      title={activeTab === 'resize' ? t.tools.imageResize.title : t.tools.imageCrop.title}
      description={activeTab === 'resize' ? t.tools.imageResize.desc : t.tools.imageCrop.desc}
      categoryName={t.categories.image}
      supportedFormats={['JPG', 'JPEG', 'PNG', 'WEBP']}
      onBack={onBack}
      instructions={[
        { step: 1, title: 'Upload Picture', desc: 'Select any photo or graphic from your computer or phone.' },
        { step: 2, title: 'Customize Dimensions', desc: 'Scale by exact pixels or choose 1:1, 4:3, 16:9 crop presets.' },
        { step: 3, title: 'Save & Download', desc: 'Download your resized or cropped image with maintained transparency.' },
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
            aria-label="Upload image"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.common.selectFiles}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resize, crop, and transform images in your browser
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 my-4">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {selectedFile && !result && sourceImg && (
        <div className="space-y-6">
          {/* Tool mode switch */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('resize')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'resize'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Resize Dimensions</span>
            </button>
            <button
              onClick={() => setActiveTab('crop')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'crop'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Crop className="w-4 h-4" />
              <span>Crop Ratio</span>
            </button>
            <button
              onClick={() => setActiveTab('transform')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'transform'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate & Flip</span>
            </button>
          </div>

          {/* Image visual preview box */}
          <div className="max-h-72 aspect-video bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center relative">
            <img
              src={sourceImg.src}
              alt="Source"
              className="max-h-full max-w-full object-contain transition-transform"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
            />
            <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-mono">
              Original: {sourceImg.naturalWidth} × {sourceImg.naturalHeight} px
            </span>
          </div>

          {/* Mode Specific Controls */}
          {activeTab === 'resize' && (
            <div className="space-y-4 text-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-medium"
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5 text-indigo-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Presets:</span>
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPercentage(pct)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crop' && (
            <div className="space-y-3 text-start">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Crop Ratio Presets
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1:1', label: '1:1 Square', note: 'Instagram / Avatar' },
                  { id: '4:3', label: '4:3 Standard', note: 'Classic Photo' },
                  { id: '16:9', label: '16:9 Widescreen', note: 'Banner / Video' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCropAspect(preset.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      cropAspect === preset.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{preset.note}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transform' && (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate 90°</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className={`px-4 py-2.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
                  flipH
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>Flip Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipV(!flipV)}
                className={`px-4 py-2.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
                  flipV
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlipVertical className="w-4 h-4" />
                <span>Flip Vertical</span>
              </button>
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
                <span>Applying Changes...</span>
              </>
            ) : (
              <span>Apply & Generate Image</span>
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
              Image Processed Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              File: <strong className="text-slate-800 dark:text-slate-200">{result.fileName}</strong> ({formatFileSize(result.blob.size)})
            </p>
          </div>

          <div className="max-w-xs mx-auto aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-inner">
            <img src={result.previewUrl} alt="Result" className="w-full h-full object-contain" />
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
