import test from 'node:test';
import assert from 'node:assert/strict';
import { detectMagicBytes, validateImageBytes, validatePdfBytes, formatFileSize } from './fileValidation.ts';

test('detects PDF magic bytes accurately', () => {
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]);
  assert.equal(detectMagicBytes(pdfBytes), 'application/pdf');
});

test('detects PNG magic bytes accurately', () => {
  const pngBytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  assert.equal(detectMagicBytes(pngBytes), 'image/png');
});

test('detects JPEG magic bytes accurately', () => {
  const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
  assert.equal(detectMagicBytes(jpegBytes), 'image/jpeg');
});

test('detects WebP magic bytes accurately', () => {
  // 'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P'
  const webpBytes = new Uint8Array([
    0x52, 0x49, 0x46, 0x46,
    0x24, 0x00, 0x00, 0x00,
    0x57, 0x45, 0x42, 0x50,
    0x56, 0x50, 0x38
  ]);
  assert.equal(detectMagicBytes(webpBytes), 'image/webp');
});

test('CRITICAL: Rejects PDF renamed to .jpg from image input', () => {
  // A fake image that contains PDF header
  const fakeJpg = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]);
  const result = validateImageBytes(fakeJpg, 'invoice_fake.jpg');
  assert.equal(result.isValid, false);
  assert.equal(result.detectedType, 'application/pdf');
  assert.match(result.error ?? '', /is a PDF document, not a supported image file/);
});

test('Accepts valid PNG in image input', () => {
  const validPng = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const result = validateImageBytes(validPng, 'photo.png');
  assert.equal(result.isValid, true);
  assert.equal(result.detectedType, 'image/png');
});

test('Validates genuine PDF header in PDF validator', () => {
  const validPdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35]);
  const result = validatePdfBytes(validPdf, 'contract.pdf');
  assert.equal(result.isValid, true);
});

test('Rejects non-PDF file in PDF validator', () => {
  const randomBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
  const result = validatePdfBytes(randomBytes, 'corrupt.pdf');
  assert.equal(result.isValid, false);
});

test('Formats file sizes correctly', () => {
  assert.equal(formatFileSize(0), '0 B');
  assert.equal(formatFileSize(1024), '1.0 KB');
  assert.equal(formatFileSize(1048576 * 2.5), '2.5 MB');
});
