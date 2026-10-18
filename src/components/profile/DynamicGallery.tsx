import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Sparkles,
  Layers,
  ZoomIn
} from 'lucide-react';

interface DynamicGalleryProps {
  images?: string[];
  title?: string;
  autoPlayInterval?: number;
  isRtl?: boolean;
}

/**
 * Dynamic Photos & Animated Portfolio Component
 * Offers smooth cinematic transitions, dynamic autoplay with animated timer progress,
 * filmstrip thumbnail switcher, and fullscreen immersive lightbox.
 */
export const DynamicGallery: React.FC<DynamicGalleryProps> = ({
  images = [],
  title = 'Dynamic Photos & Portfolio',
  autoPlayInterval = 4000,
  isRtl = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const validImages = images.filter((img) => Boolean(img && img.trim()));

  // Auto-slide effect with animated smooth progress bar
  useEffect(() => {
    if (!isPlaying || validImages.length <= 1) {
      setProgress(0);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % validImages.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, validImages.length, autoPlayInterval, currentIndex]);

  if (validImages.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setProgress(0);
  };

  const handleSelectThumb = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const currentImg = validImages[currentIndex];

  return (
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-start">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {title}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block">
              {validImages.length} {isRtl ? 'صور ديناميكية متحركة' : 'interactive photos'}
            </span>
          </div>
        </div>

        {validImages.length > 1 && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-pink-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              {currentIndex + 1} / {validImages.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Dynamic Viewport */}
      <div
        className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl group"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative flex items-center justify-center">
          {/* Active Image with subtle scale motion */}
          <img
            key={currentImg}
            src={currentImg}
            alt={`Portfolio showcase ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105"
          />

          {/* Dynamic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

          {/* Top Info Tag */}
          <div className="absolute top-3 start-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-semibold border border-white/10 shadow-sm">
            <Layers className="w-3 h-3 text-pink-400" />
            <span>{isRtl ? 'معرض الأعمال' : 'Portfolio Showcase'}</span>
          </div>

          {/* Lightbox / Zoom Button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 end-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
            title="Open Fullscreen"
            aria-label="Open Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Prev / Next Controls */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute start-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/10"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Progress Timer Line */}
          {validImages.length > 1 && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Bottom Indicator Dots */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
              {validImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Filmstrip Thumbnail Bar */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 pt-0.5 custom-scrollbar">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelectThumb(i)}
              className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all relative ${
                i === currentIndex
                  ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/20 opacity-100 ring-2 ring-pink-500/30'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'
              }`}
              title={`View Photo ${i + 1}`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              {i === currentIndex && (
                <div className="absolute inset-0 bg-pink-500/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-pink-500 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/70">
                {currentIndex + 1} / {validImages.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Container */}
          <div
            className="flex-1 w-full max-w-5xl flex items-center justify-center relative my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImg}
              alt="Fullscreen View"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute start-2 sm:start-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl border border-white/10"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute end-2 sm:end-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl border border-white/10"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {validImages.length > 1 && (
            <div
              className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto pt-2 custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectThumb(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    idx === currentIndex
                      ? 'border-pink-500 scale-105 ring-2 ring-pink-500/50'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
