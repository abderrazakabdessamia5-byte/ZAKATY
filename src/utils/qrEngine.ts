import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface QRCodeOptions {
  text: string;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  width?: number;
  includeHeartLogo?: boolean;
}

/**
 * Generates high-resolution QR code data URL (PNG) with optional center ZakaTy heart logo.
 */
export async function generateQrCode(options: QRCodeOptions): Promise<string> {
  const {
    text,
    darkColor = '#1e1b4b',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'H', // Use high error correction to support center logo
    width = 600,
    includeHeartLogo = false,
  } = options;

  if (!text || text.trim() === '') {
    throw new Error('QR code content cannot be empty.');
  }

  // Generate canvas
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, {
    width,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel,
  });

  if (includeHeartLogo) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const logoSize = width * 0.22;
      const x = (width - logoSize) / 2;
      const y = (width - logoSize) / 2;

      // Draw white circular/rounded shield behind logo for scannability
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(width / 2, width / 2, logoSize * 0.62, 0, Math.PI * 2);
      ctx.fill();

      // Draw modern gradient heart with subtle Z
      const heartSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ec4899"/>
              <stop offset="50%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <path d="M50 88 C20 60, 5 40, 5 25 C5 12, 16 3, 29 3 C38 3, 46 9, 50 16 C54 9, 62 3, 71 3 C84 3, 95 12, 95 25 C95 40, 80 60, 50 88 Z" fill="url(#g)"/>
          <path d="M36 28 L64 28 L40 54 L64 54" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      `;

      const blob = new Blob([heartSvg], { type: 'image/svg+xml' });
      const img = new Image();
      const url = URL.createObjectURL(blob);

      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, x, y, logoSize, logoSize);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Generates an SVG string of the QR code.
 */
export async function generateQrSvg(options: QRCodeOptions): Promise<string> {
  const { text, darkColor = '#000000', lightColor = '#ffffff', errorCorrectionLevel = 'M' } = options;
  return QRCode.toString(text, {
    type: 'svg',
    margin: 2,
    color: { dark: darkColor, light: lightColor },
    errorCorrectionLevel,
  });
}

/**
 * Decodes a QR code from an image file using jsQR.
 */
export async function scanQrFromImage(file: File): Promise<string | null> {
  const img = new Image();
  const url = URL.createObjectURL(file);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context.');

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  return code ? code.data : null;
}

/**
 * Decodes a QR code from a video canvas snapshot.
 */
export function scanQrFromVideo(video: HTMLVideoElement): string | null {
  if (video.readyState < 2) return null;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  return code ? code.data : null;
}
