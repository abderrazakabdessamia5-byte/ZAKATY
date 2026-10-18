import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { scanQrFromImage, scanQrFromVideo } from '../../utils/qrEngine';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Camera,
  Upload,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  StopCircle,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface QrScannerToolProps {
  currentLang: Language;
  onBack: () => void;
}

export const QrScannerTool: React.FC<QrScannerToolProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanningCamera(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setDecodedData(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanningCamera(true);
        scanLoop();
      }
    } catch (err: any) {
      setCameraError(err.message || 'Camera permission was not granted.');
    }
  };

  const scanLoop = () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    const result = scanQrFromVideo(videoRef.current);
    if (result) {
      setDecodedData(result);
      stopCamera();
      return;
    }

    animFrameRef.current = requestAnimationFrame(scanLoop);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setCameraError(null);
    setDecodedData(null);

    try {
      const code = await scanQrFromImage(file);
      if (code) {
        setDecodedData(code);
      } else {
        setCameraError('No readable QR code found in this image. Please ensure the code is clear and well-lit.');
      }
    } catch (err: any) {
      setCameraError(err.message || 'Failed to scan image.');
    }
  };

  const handleCopy = () => {
    if (!decodedData) return;
    navigator.clipboard.writeText(decodedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = decodedData && /^https?:\/\//i.test(decodedData.trim());

  return (
    <ToolLayout
      currentLang={currentLang}
      title={t.tools.qrScanner.title}
      description={t.tools.qrScanner.desc}
      categoryName={t.categories.qrNfc}
      supportedFormats={['Camera', 'PNG', 'JPG', 'WEBP']}
      onBack={() => {
        stopCamera();
        onBack();
      }}
      instructions={[
        { step: 1, title: 'Choose Mode', desc: 'Scan live with your camera or upload any picture containing a QR.' },
        { step: 2, title: 'Decode Content', desc: 'The code is deciphered instantly without sending data to any server.' },
        { step: 3, title: 'Preview Safely', desc: 'Inspect the destination URL safely before deciding to open it.' },
      ]}
    >
      <div className="space-y-6 max-w-xl mx-auto">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => {
              stopCamera();
              setMode('upload');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => {
              setMode('camera');
              startCamera();
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'camera'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Device Camera</span>
          </button>
        </div>

        {/* Camera Scanner View */}
        {mode === 'camera' && (
          <div className="space-y-4 text-center">
            <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />

              {/* Scanning Target Box Overlay */}
              <div className="absolute inset-8 border-2 border-indigo-400/80 rounded-2xl pointer-events-none animate-pulse flex items-center justify-center">
                <span className="text-[11px] text-white/80 bg-black/60 px-2 py-1 rounded">
                  Align QR Code inside box
                </span>
              </div>
            </div>

            {isScanningCamera ? (
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restart Camera</span>
              </button>
            )}
          </div>
        )}

        {/* Upload Image View */}
        {mode === 'upload' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upload QR Code Image
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select or drop any screenshot, photo, or graphic containing a QR code
            </p>
          </div>
        )}

        {/* Error Alert */}
        {cameraError && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 font-medium">{cameraError}</div>
          </div>
        )}

        {/* Decoded Result View */}
        {decodedData && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-start space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Check className="w-4 h-4" />
              <span>QR Code Decoded Successfully</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 break-all font-mono text-xs text-slate-800 dark:text-slate-200">
              {decodedData}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Content'}</span>
              </button>

              {isUrl && (
                <a
                  href={decodedData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Safe Link</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
