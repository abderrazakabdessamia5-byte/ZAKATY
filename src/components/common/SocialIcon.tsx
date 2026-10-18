import React from 'react';

interface SocialIconProps {
  name: string;
  className?: string;
  size?: number;
  interactive?: boolean;
}

/**
 * 100% Realistic 3D Social Media Icons Component
 * Crafted with realistic claymorphic / skeuomorphic 3D lighting:
 * - Ambient occlusion & multi-layered soft drop shadows
 * - Beveled metallic / glossy specular rim highlights
 * - Embossed 3D brand glyphs with depth engraving
 * - Interactive physics: 3D hover lift, tilt, scale, and color bloom glow
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  name,
  className = '',
  size = 46,
  interactive = true,
}) => {
  const norm = name.toLowerCase().trim();
  const id = `icon3d-${norm}-${Math.random().toString(36).substring(2, 8)}`;

  // 3D physics container styling: hover lift, dynamic glow, tactile push
  const containerClass = interactive
    ? `relative inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-110 active:scale-95 active:translate-y-0 group cursor-pointer select-none ${className}`
    : `relative inline-flex items-center justify-center select-none ${className}`;

  switch (norm) {
    /* -------------------------------------------------------------------------
       1. WHATSAPP - 3D Realistic Emerald Glass Capsule with Embossed Phone
       ------------------------------------------------------------------------- */
    case 'whatsapp':
      return (
        <span className={containerClass} title="WhatsApp">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(37,211,102,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(37,211,102,0.65)] transition-all duration-300"
          >
            <defs>
              {/* Rich 3D Sphere/Squircle Gradient */}
              <linearGradient id={`${id}-body`} x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#58f77a" />
                <stop offset="35%" stopColor="#25D366" />
                <stop offset="85%" stopColor="#159c4b" />
                <stop offset="100%" stopColor="#0b6330" />
              </linearGradient>

              {/* Glossy Top Convex Arc Reflection */}
              <linearGradient id={`${id}-gloss`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
              </linearGradient>

              {/* Inner 3D Bevel Border */}
              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#25D366" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#04391a" stopOpacity="0.8" />
              </linearGradient>

              {/* Deep 3D Shadow for Embossed Glyph */}
              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#06421f" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Bottom 3D Bevel Base Rim */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#0b5e2b" />

            {/* Main 3D Squircle Body */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Specular Curved Reflection Dome */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.35"
            />

            {/* Shiny 3D Bevel Stroke */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Embossed WhatsApp Speech Bubble */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M32 14 C21.8 14 13.5 22.3 13.5 32.5 C13.5 35.8 14.4 38.9 16.1 41.6 L14.5 49.5 L22.8 47.9 C25.5 49.4 28.6 50.3 32 50.3 C42.2 50.3 50.5 42 50.5 31.8 C50.5 21.6 42.2 14 32 14 Z"
                fill="#ffffff"
              />
              {/* WhatsApp Receiver Glyph in Deep Emerald */}
              <path
                d="M39.8 37.4 C39.4 38.4 38 39.2 37 39.4 C36.3 39.6 35.4 39.7 32.3 38.4 C28.4 36.8 25.9 32.8 25.7 32.5 C25.5 32.2 24.1 30.3 24.1 28.4 C24.1 26.5 25.1 25.5 25.5 25.1 C25.8 24.8 26.3 24.7 26.8 24.7 C27 24.7 27.2 24.7 27.3 24.7 C27.7 24.7 27.9 24.7 28.2 25.4 C28.5 26.2 29.3 28.1 29.4 28.3 C29.5 28.5 29.6 28.8 29.5 29 C29.4 29.3 29.3 29.4 29.1 29.6 C28.9 29.8 28.7 30 28.5 30.2 C28.3 30.4 28.1 30.6 28.3 31 C28.5 31.4 29.3 32.7 30.5 33.7 C32 35 33.2 35.4 33.6 35.6 C33.9 35.7 34.3 35.7 34.5 35.5 C34.8 35.2 35.2 34.7 35.5 34.2 C35.8 33.8 36.1 33.7 36.5 33.9 C36.9 34 38.7 34.9 39.1 35.1 C39.5 35.3 39.7 35.4 39.8 35.6 C39.9 35.7 39.9 36.5 39.8 37.4 Z"
                fill="#159c4b"
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       2. INSTAGRAM - 3D Iridescent Multi-Color Squircle with Glass Lens
       ------------------------------------------------------------------------- */
    case 'instagram':
      return (
        <span className={containerClass} title="Instagram">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(225,48,108,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(225,48,108,0.7)] transition-all duration-300"
          >
            <defs>
              {/* Instagram Radiant 3D Sunset Glow */}
              <radialGradient id={`${id}-insta-rad`} cx="22%" cy="105%" r="120%">
                <stop offset="0%" stopColor="#ffee55" />
                <stop offset="15%" stopColor="#ff7730" />
                <stop offset="45%" stopColor="#f72585" />
                <stop offset="70%" stopColor="#b5179e" />
                <stop offset="100%" stopColor="#4361ee" />
              </radialGradient>

              {/* Glossy Dome Reflection */}
              <linearGradient id={`${id}-gloss`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#300060" stopOpacity="0.8" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#400030" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Bottom 3D Bevel Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#48003a" />

            {/* Main Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-insta-rad)`} />

            {/* Glossy Arc Reflection */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.32"
            />

            {/* 3D Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* 3D Embossed Camera Housing */}
            <g filter={`url(#${id}-shadow)`}>
              <rect x="17.5" y="17.5" width="29" height="29" rx="8.5" stroke="#ffffff" strokeWidth="3.6" />
              <circle cx="32" cy="32" r="7.5" stroke="#ffffff" strokeWidth="3.6" />
              <circle cx="40.5" cy="23.5" r="2.2" fill="#ffffff" />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       3. LINKEDIN - 3D Sapphire Blue Cube with Cushioned Bevels & Depth
       ------------------------------------------------------------------------- */
    case 'linkedin':
      return (
        <span className={containerClass} title="LinkedIn">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(10,102,194,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(10,102,194,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#3b9dfa" />
                <stop offset="35%" stopColor="#0A66C2" />
                <stop offset="85%" stopColor="#054b91" />
                <stop offset="100%" stopColor="#022d5a" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#011b36" stopOpacity="0.85" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#001830" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* 3D Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#012347" />

            {/* Main 3D Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Glass Curvature Highlight */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.32"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Embossed 'in' glyph with 3D shadow */}
            <g filter={`url(#${id}-shadow)`} fill="#ffffff">
              <circle cx="23" cy="22" r="3.6" />
              <rect x="19.5" y="27.5" width="6.8" height="19" rx="1.8" />
              <path d="M30.5 27.5 L37 27.5 L37 30.8 C38.5 28.4 41.2 27 44.8 27 C50.5 27 52.8 30.5 52.8 37 L52.8 46.5 L46 46.5 L46 38 C46 34.8 44.8 33.2 42.2 33.2 C39.5 33.2 37.5 35 37.5 38.5 L37.5 46.5 L30.5 46.5 Z" />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       4. FACEBOOK - 3D Royal Blue Cushion with Curvature & Beveled 'f'
       ------------------------------------------------------------------------- */
    case 'facebook':
      return (
        <span className={containerClass} title="Facebook">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(24,119,242,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(24,119,242,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#4ea3ff" />
                <stop offset="35%" stopColor="#1877F2" />
                <stop offset="85%" stopColor="#0d54b8" />
                <stop offset="100%" stopColor="#063273" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#04204d" stopOpacity="0.85" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#031e47" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#05285c" />

            {/* Main Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Convex Gloss Reflection */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.32"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* 3D Embossed Facebook 'f' */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M38.5 34.5 L44.5 34.5 L45.6 26.8 L38.5 26.8 L38.5 22.8 C38.5 20.4 39.5 18.7 43.3 18.7 L46 18.7 L46 12.2 C44.6 12 41.2 11.5 38 11.5 C30 11.5 25.5 16 25.5 24.5 L25.5 26.8 L19 26.8 L19 34.5 L25.5 34.5 L25.5 53 L38.5 53 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       5. X (TWITTER) - 3D Obsidian / Titanium Brushed Squircle with Sharp Chrome X
       ------------------------------------------------------------------------- */
    case 'x':
    case 'twitter':
      return (
        <span className={containerClass} title="X (Twitter)">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_18px_30px_rgba(100,100,120,0.45)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#353540" />
                <stop offset="40%" stopColor="#181820" />
                <stop offset="85%" stopColor="#0b0b0e" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="30%" stopColor="#a0a0b0" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#252530" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id={`${id}-x`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d5d5e2" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#050508" />

            {/* Obsidian Body */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Specular Glint */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.22"
            />

            {/* Titanium Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Crisp 3D X Emblem */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M41 16 L47 16 L33.8 31.2 L49 50 L37 50 L27.7 38 L17.3 50 L11.3 50 L25.4 33.8 L10.8 16 L23.2 16 L31.6 27.2 Z M39 46.5 L42.2 46.5 L21.3 19.3 L17.8 19.3 Z"
                fill={`url(#${id}-x)`}
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       6. YOUTUBE - 3D Crimson Gloss Block with Raised Play Pill
       ------------------------------------------------------------------------- */
    case 'youtube':
      return (
        <span className={containerClass} title="YouTube">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(255,0,0,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(255,0,0,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#ff5555" />
                <stop offset="35%" stopColor="#FF0000" />
                <stop offset="85%" stopColor="#b30000" />
                <stop offset="100%" stopColor="#700000" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#450000" stopOpacity="0.85" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#500000" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#660000" />

            {/* Main Red Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Gloss Reflection */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.32"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Embossed YouTube Screen & Triangle */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M48.5 23 C49.5 24.5 50 28 50 32 C50 36 49.5 39.5 48.5 41 C47.5 42.5 45.5 43 43.5 43.2 C38.5 43.6 32 43.6 32 43.6 C32 43.6 25.5 43.6 20.5 43.2 C18.5 43 16.5 42.5 15.5 41 C14.5 39.5 14 36 14 32 C14 28 14.5 24.5 15.5 23 C16.5 21.5 18.5 21 20.5 20.8 C25.5 20.4 32 20.4 32 20.4 C32 20.4 38.5 20.4 43.5 20.8 C45.5 21 47.5 21.5 48.5 23 Z"
                fill="#ffffff"
              />
              <path d="M28 26.5 L39.5 32 L28 37.5 Z" fill="#FF0000" />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       7. TIKTOK - 3D Vinyl Carbon Squircle with Cyan & Magenta Neon Extrusion
       ------------------------------------------------------------------------- */
    case 'tiktok':
      return (
        <span className={containerClass} title="TikTok">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(37,244,238,0.35)] group-hover:drop-shadow-[0_18px_30px_rgba(254,44,85,0.55)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#2c2c36" />
                <stop offset="40%" stopColor="#141419" />
                <stop offset="85%" stopColor="#08080b" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#25F4EE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FE2C55" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#050508" />

            {/* Carbon Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Specular Sheen */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.18"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Stereoscopic Neon 3D Note */}
            <g transform="translate(14, 12)">
              {/* Cyan shadow layer */}
              <path
                d="M21 2 C21.5 4.5 23.5 7.5 27 8 L27 12 C24.5 11.8 22.5 10.8 21 9.5 L21 22 C21 28 16 32 10.5 32 C5 32 1 27.8 1 22.5 C1 17.2 5.5 13 11 13.2 L11 17.5 C8.5 17.5 6 19.5 6 22.2 C6 24.8 8.2 27 11 27 C14.5 27 16.5 24.5 16.5 21 L16.5 2 Z"
                fill="#25F4EE"
                opacity="0.9"
              />
              {/* Magenta highlight layer */}
              <path
                d="M23 4 C23.5 6.5 25.5 9.5 29 10 L29 14 C26.5 13.8 24.5 12.8 23 11.5 L23 24 C23 30 18 34 12.5 34 C7 34 3 29.8 3 24.5 C3 19.2 7.5 15 13 15.2 L13 19.5 C10.5 19.5 8 21.5 8 24.2 C8 26.8 10.2 29 13 29 C16.5 29 18.5 26.5 18.5 23 L18.5 4 Z"
                fill="#FE2C55"
                opacity="0.9"
              />
              {/* Crisp white central core */}
              <path
                d="M22 3 C22.5 5.5 24.5 8.5 28 9 L28 13 C25.5 12.8 23.5 11.8 22 10.5 L22 23 C22 29 17 33 11.5 33 C6 33 2 28.8 2 23.5 C2 18.2 6.5 14 12 14.2 L12 18.5 C9.5 18.5 7 20.5 7 23.2 C7 25.8 9.2 28 12 28 C15.5 28 17.5 25.5 17.5 22 L17.5 3 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       8. TELEGRAM - 3D Aerodynamic Sky-Blue Sphere with Soaring Paper Plane
       ------------------------------------------------------------------------- */
    case 'telegram':
      return (
        <span className={containerClass} title="Telegram">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(42,171,238,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(42,171,238,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#55caff" />
                <stop offset="35%" stopColor="#2AABEE" />
                <stop offset="85%" stopColor="#1e88e5" />
                <stop offset="100%" stopColor="#115599" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0a3d73" stopOpacity="0.85" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#093869" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#0d4682" />

            {/* Sky Blue Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Gloss Curvature */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.32"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* 3D Paper Plane */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M48.5 17.5 L14.5 31.5 C12 32.5 12 34.5 14.5 35.3 L23.5 38.2 L42.5 25.8 C43.5 25 44.5 25.6 43.5 26.4 L27.8 40.8 L27.2 48.5 C28.8 48.5 29.8 47.5 30.8 46.5 L37.5 40.3 L45.8 46.5 C47.8 47.6 48.8 47 49.4 44.4 L53 19.6 C53.5 17 51.2 16 48.5 17.5 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       9. GITHUB - 3D Slate / Graphite Squircle with Silver Octocat
       ------------------------------------------------------------------------- */
    case 'github':
      return (
        <span className={containerClass} title="GitHub">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_18px_30px_rgba(0,0,0,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#434c5a" />
                <stop offset="35%" stopColor="#24292e" />
                <stop offset="85%" stopColor="#181b1d" />
                <stop offset="100%" stopColor="#0f1112" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#0d0e10" />

            {/* Graphite Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Gloss Arch */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.22"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* 3D Embossed Octocat */}
            <g filter={`url(#${id}-shadow)`} fill="#ffffff">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32 15 C21.5 15 13 23.5 13 34 C13 42.4 18.5 49.5 26 52 C27 52.2 27.3 51.5 27.3 51 L27.3 47.6 C22 48.8 20.8 45 20.8 45 C20 43 18.8 42.5 18.8 42.5 C17 41.3 19 41.3 19 41.3 C21 41.5 22 43.3 22 43.3 C23.8 46.2 26.5 45.4 27.6 45 C27.8 43.7 28.3 42.8 28.9 42.3 C24.7 41.8 20.3 40.2 20.3 33 C20.3 30.9 21 29.3 22.3 28 C22.1 27.5 21.5 25.5 22.5 23 C22.5 23 24.1 22.5 27.8 25 C29.4 24.5 31.1 24.3 32.8 24.3 C34.5 24.3 36.2 24.5 37.8 25 C41.5 22.5 43.1 23 43.1 23 C44.1 25.5 43.5 27.5 43.3 28 C44.5 29.3 45.3 30.9 45.3 33 C45.3 40.2 40.8 41.8 36.6 42.3 C37.3 42.9 38 44.1 38 46 L38 51 C38 51.5 38.3 52.2 39.3 52 C46.9 49.5 52.3 42.4 52.3 34 C52.3 23.5 43.8 15 32 15 Z"
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       10. GOOGLE MAPS / LOCATION - 3D Ceramic White Squircle with 4-Color Pin
       ------------------------------------------------------------------------- */
    case 'google':
    case 'maps':
    case 'googlemaps':
      return (
        <span className={containerClass} title="Google Maps">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(66,133,244,0.35)] group-hover:drop-shadow-[0_18px_30px_rgba(66,133,244,0.6)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-ceramic`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e9eef6" />
              </linearGradient>

              <linearGradient id={`${id}-pin`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5252" />
                <stop offset="100%" stopColor="#d32f2f" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1a3d75" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#cbd5e1" />

            {/* Ceramic Squircle */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-ceramic)`} />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke="#ffffff" strokeWidth="1.8" />

            {/* 3D Maps Pin with dimensional shadow */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M32 14 C23.5 14 16.5 21 16.5 29.5 C16.5 39.5 30 50.5 31.2 51.5 C31.7 51.8 32.3 51.8 32.8 51.5 C34 50.5 47.5 39.5 47.5 29.5 C47.5 21 40.5 14 32 14 Z"
                fill={`url(#${id}-pin)`}
              />
              <circle cx="32" cy="28.5" r="6.5" fill="#ffffff" />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       11. GOOGLE REVIEWS - 3D Golden Trophy Medal with Faceted Star
       ------------------------------------------------------------------------- */
    case 'reviews':
    case 'star':
      return (
        <span className={containerClass} title="Google Reviews">
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(251,188,5,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(251,188,5,0.7)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-gold`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#fff3b0" />
                <stop offset="35%" stopColor="#FBBC04" />
                <stop offset="85%" stopColor="#e39800" />
                <stop offset="100%" stopColor="#b36b00" />
              </linearGradient>

              <linearGradient id={`${id}-star`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fff0a0" />
              </linearGradient>

              <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#664400" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#8c5300" />

            {/* Gold Body */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-gold)`} />

            {/* Specular Highlight */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.38"
            />

            {/* Bevel Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke="#fff9d6" strokeWidth="1.8" />

            {/* 3D Faceted Star */}
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M32 15 L36.8 25.3 L48 26.9 L39.8 34.8 L41.8 46 L32 40.5 L22.2 46 L24.2 34.8 L16 26.9 L27.2 25.3 Z"
                fill={`url(#${id}-star)`}
              />
            </g>
          </svg>
        </span>
      );

    /* -------------------------------------------------------------------------
       DEFAULT / GENERIC 3D VIBRANT BADGE
       ------------------------------------------------------------------------- */
    default:
      return (
        <span className={containerClass} title={name}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_20px_rgba(99,102,241,0.4)] group-hover:drop-shadow-[0_18px_30px_rgba(99,102,241,0.65)] transition-all duration-300"
          >
            <defs>
              <linearGradient id={`${id}-body`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="35%" stopColor="#4F46E5" />
                <stop offset="85%" stopColor="#3730a3" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>

              <linearGradient id={`${id}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Depth Base */}
            <rect x="4" y="6" width="56" height="54" rx="17" fill="#1e1b4b" />

            {/* Body */}
            <rect x="4" y="4" width="56" height="54" rx="17" fill={`url(#${id}-body)`} />

            {/* Reflection */}
            <path
              d="M7 20 C7 10, 11 7, 21 6 L43 6 C53 6, 57 10, 57 20 C46 25, 18 27, 7 20 Z"
              fill="#ffffff"
              fillOpacity="0.3"
            />

            {/* Rim */}
            <rect x="5" y="5" width="54" height="52" rx="16" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />

            {/* Globe Symbol */}
            <circle cx="32" cy="31" r="13" stroke="#ffffff" strokeWidth="3" />
            <ellipse cx="32" cy="31" rx="6" ry="13" stroke="#ffffff" strokeWidth="2.2" />
            <line x1="19" y1="31" x2="45" y2="31" stroke="#ffffff" strokeWidth="2.2" />
          </svg>
        </span>
      );
  }
};
