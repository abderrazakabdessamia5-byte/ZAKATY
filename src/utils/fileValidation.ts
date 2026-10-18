/**
 * File validation and magic byte inspection utilities.
 * Ensures genuine file integrity and prevents format mismatch attacks (e.g., PDF renamed to .jpg).
 */

export interface ValidationResult {
  isValid: boolean;
  detectedType?: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'unknown';
  mimeMatch?: boolean;
  error?: string;
}

/**
 * Inspects initial bytes of a binary buffer to detect actual file signature.
 */
export function detectMagicBytes(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'unknown' {
  if (bytes.length < 4) return 'unknown';

  // PDF signature: %PDF (0x25, 0x50, 0x44, 0x46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }

  // PNG signature: 0x89, 0x50, 0x4E, 0x47 (‰PNG)
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return 'image/png';
  }

  // JPEG signature: 0xFF, 0xD8, 0xFF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'image/jpeg';
  }

  // WebP signature: RIFF....WEBP (0x52, 0x49, 0x46, 0x46 ... 0x57, 0x45, 0x42, 0x50)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  return 'unknown';
}

/**
 * Validates that an uploaded image file is a genuine JPEG, PNG, or WebP.
 * Strictly prevents PDF files or other formats masquerading as images.
 */
export function validateImageBytes(bytes: Uint8Array, fileName: string): ValidationResult {
  const detected = detectMagicBytes(bytes);

  if (detected === 'application/pdf') {
    return {
      isValid: false,
      detectedType: 'application/pdf',
      error: `"${fileName}" is a PDF document, not a supported image file. Please upload JPEG, PNG, or WebP images only.`,
    };
  }

  if (detected === 'image/jpeg' || detected === 'image/png' || detected === 'image/webp') {
    return {
      isValid: true,
      detectedType: detected,
    };
  }

  return {
    isValid: false,
    detectedType: 'unknown',
    error: `"${fileName}" has an unsupported or corrupted image format. Please select valid JPEG, PNG, or WebP files.`,
  };
}

/**
 * Validates that an uploaded PDF file has the genuine %PDF header.
 */
export function validatePdfBytes(bytes: Uint8Array, fileName: string): ValidationResult {
  const detected = detectMagicBytes(bytes);

  if (detected === 'application/pdf') {
    return {
      isValid: true,
      detectedType: 'application/pdf',
    };
  }

  return {
    isValid: false,
    detectedType: detected,
    error: `"${fileName}" is not a valid PDF file. The file header does not match the PDF standard specification.`,
  };
}

/**
 * Formats byte size into human readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
