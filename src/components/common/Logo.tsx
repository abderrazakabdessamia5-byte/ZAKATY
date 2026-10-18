import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 36, showText = true }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Heart-shaped logo with subtle stylized 'Z' */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
        aria-label="ZakaTy Heart Logo"
        role="img"
      >
        <defs>
          <linearGradient id="zakatyHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="45%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Heart Base */}
        <path
          d="M50 88 C18 58, 4 38, 4 24 C4 11.5, 15.5 3, 28.5 3 C37.5 3, 45.5 8, 50 16 C54.5 8, 62.5 3, 71.5 3 C84.5 3, 96 11.5, 96 24 C96 38, 82 58, 50 88 Z"
          fill="url(#zakatyHeartGrad)"
          filter="url(#heartShadow)"
        />

        {/* Stylized 'Z' path inside heart */}
        <path
          d="M34 30 L66 30 L38 58 L66 58"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle sparkle accent */}
        <circle cx="74" cy="22" r="3.5" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>

      {showText && (
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
          Zaka<span className="text-indigo-600 dark:text-indigo-400">Ty</span>
        </span>
      )}
    </div>
  );
};
