import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { validateImageBytes, validatePdfBytes } from './fileValidation';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for browser rendering
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
}

/**
 * Merge multiple PDF files into a single unified PDF.
 */
export async function mergePdfs(files: File[], onProgress?: (msg: string) => void): Promise<Blob> {
  if (!files || files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  onProgress?.('Initializing PDF merger...');
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(`Reading file ${i + 1} of ${files.length}: ${file.name}...`);
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Validate genuine PDF signature
    const check = validatePdfBytes(bytes, file.name);
    if (!check.isValid) {
      throw new Error(check.error || `File ${file.name} is not a valid PDF.`);
    }

    const doc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.('Saving merged PDF document...');
  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes as any], { type: 'application/pdf' });
}

/**
 * Split a PDF into selected pages or page ranges (e.g. "1, 3-5").
 */
export async function splitPdf(file: File, pageRangeStr: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const check = validatePdfBytes(bytes, file.name);
  if (!check.isValid) {
    throw new Error(check.error || 'Invalid PDF file.');
  }

  const srcDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = srcDoc.getPageCount();

  const selectedIndices: number[] = [];

  if (!pageRangeStr || pageRangeStr.trim() === '' || pageRangeStr.trim().toLowerCase() === 'all') {
    for (let i = 0; i < totalPages; i++) selectedIndices.push(i);
  } else {
    const parts = pageRangeStr.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(totalPages, Math.max(start, end));
          for (let p = min; p <= max; p++) {
            if (!selectedIndices.includes(p - 1)) selectedIndices.push(p - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
          if (!selectedIndices.includes(p - 1)) selectedIndices.push(p - 1);
        }
      }
    }
  }

  if (selectedIndices.length === 0) {
    throw new Error(`No valid pages selected. Document contains ${totalPages} page(s). (e.g. 1-2, 4)`);
  }

  // Sort page indices
  selectedIndices.sort((a, b) => a - b);

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, selectedIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const splitBytes = await newDoc.save();
  return new Blob([splitBytes as any], { type: 'application/pdf' });
}

/**
 * Converts multiple genuine images into a clean PDF document.
 * Strictly verifies magic bytes to prevent renamed non-image files or PDFs from being treated as images.
 */
export async function imagesToPdf(
  images: { file: File; rotation?: number }[],
  pageSize: 'fit' | 'a4' = 'fit',
  onProgress?: (msg: string) => void
): Promise<Blob> {
  if (!images || images.length === 0) {
    throw new Error('Please select at least one image file.');
  }

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    onProgress?.(`Processing image ${i + 1} of ${images.length}: ${item.file.name}...`);

    const arrayBuffer = await item.file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // CRITICAL: Magic bytes check
    const validation = validateImageBytes(bytes, item.file.name);
    if (!validation.isValid) {
      throw new Error(validation.error || `Invalid image: ${item.file.name}`);
    }

    let embeddedImage;
    if (validation.detectedType === 'image/jpeg') {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    } else if (validation.detectedType === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      // For WebP or other supported images, convert to PNG in-memory via OffscreenCanvas / HTMLImage
      const pngBuffer = await convertBlobToPngArrayBuffer(item.file);
      embeddedImage = await pdfDoc.embedPng(pngBuffer);
    }

    const imgDims = embeddedImage.scale(1);

    if (pageSize === 'a4') {
      // Standard A4 dimensions in points: 595.28 x 841.89
      const a4Width = 595.28;
      const a4Height = 841.89;
      const page = pdfDoc.addPage([a4Width, a4Height]);

      const margin = 20;
      const maxWidth = a4Width - margin * 2;
      const maxHeight = a4Height - margin * 2;

      const scale = Math.min(maxWidth / imgDims.width, maxHeight / imgDims.height);
      const scaledWidth = imgDims.width * scale;
      const scaledHeight = imgDims.height * scale;

      const x = (a4Width - scaledWidth) / 2;
      const y = (a4Height - scaledHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
    } else {
      // Natural Fit
      const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
      });
    }
  }

  onProgress?.('Finalizing PDF document...');
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Rotates all or specified pages in a PDF.
 */
export async function rotatePdf(file: File, rotationDegrees: 90 | 180 | 270): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const check = validatePdfBytes(bytes, file.name);
  if (!check.isValid) throw new Error(check.error || 'Invalid PDF file.');

  const doc = await PDFDocument.load(arrayBuffer);
  const pages = doc.getPages();

  for (const page of pages) {
    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees((currentAngle + rotationDegrees) % 360));
  }

  const resultBytes = await doc.save();
  return new Blob([resultBytes as any], { type: 'application/pdf' });
}

/**
 * Adds custom watermark text to PDF pages.
 */
export async function watermarkPdf(file: File, watermarkText: string, opacity = 0.25): Promise<Blob> {
  if (!watermarkText || watermarkText.trim() === '') {
    throw new Error('Please enter watermark text.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const check = validatePdfBytes(bytes, file.name);
  if (!check.isValid) throw new Error(check.error || 'Invalid PDF file.');

  const doc = await PDFDocument.load(arrayBuffer);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = Math.max(24, Math.min(width, height) / 10);
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  }

  const resultBytes = await doc.save();
  return new Blob([resultBytes as any], { type: 'application/pdf' });
}

/**
 * Adds page numbering at the bottom of each page.
 */
export async function addPageNumbers(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const check = validatePdfBytes(bytes, file.name);
  if (!check.isValid) throw new Error(check.error || 'Invalid PDF file.');

  const doc = await PDFDocument.load(arrayBuffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = `Page ${i + 1} of ${total}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 20,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const resultBytes = await doc.save();
  return new Blob([resultBytes as any], { type: 'application/pdf' });
}

/**
 * Converts PDF pages into images (JPG or PNG) using canvas.
 */
export async function pdfToImages(
  file: File,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; blob: Blob; dataUrl: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const check = validatePdfBytes(bytes, file.name);
  if (!check.isValid) throw new Error(check.error || 'Invalid PDF file.');

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results: { pageNumber: number; blob: Blob; dataUrl: string }[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.(pageNum, numPages);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for crisp images

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to create canvas rendering context.');

    await (page.render({ canvasContext: ctx as any, viewport, canvas } as any).promise);

    const dataUrl = canvas.toDataURL(format, 0.92);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas to Blob conversion failed.'));
        },
        format,
        0.92
      );
    });

    results.push({ pageNumber: pageNum, blob, dataUrl });
  }

  return results;
}

/**
 * Compress PDF by rebuilding and stripping unneeded objects.
 */
export async function compressPdf(file: File): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const originalSize = file.size;

  const doc = await PDFDocument.load(arrayBuffer);
  // Re-save with object stream compression
  const compressedBytes = await doc.save({ useObjectStreams: true });
  const blob = new Blob([compressedBytes as any], { type: 'application/pdf' });

  return {
    blob,
    originalSize,
    compressedSize: blob.size,
  };
}

/**
 * Internal helper to convert any browser-supported image format (like WebP) to PNG buffer.
 */
async function convertBlobToPngArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  const img = new Image();
  const url = URL.createObjectURL(blob);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context.');
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to encode PNG'))), 'image/png');
  });

  return pngBlob.arrayBuffer();
}
