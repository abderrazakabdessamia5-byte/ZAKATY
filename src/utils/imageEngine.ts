import { validateImageBytes } from './fileValidation';

export interface ImageConvertOptions {
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0.1 - 1.0
}

export interface ImageResizeOptions {
  width: number;
  height: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
}

export interface ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
}

export interface ImageTransformOptions {
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
}

/**
 * Loads a File into an HTMLImageElement.
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const check = validateImageBytes(bytes, file.name);
  if (!check.isValid) {
    throw new Error(check.error || 'Invalid or corrupted image file.');
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${file.name}". File might be corrupted.`));
    };
    img.src = url;
  });
}

/**
 * Convert an image file between JPEG, PNG, and WebP.
 */
export async function convertImage(file: File, options: ImageConvertOptions): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context.');

  // If converting to JPEG, fill background with white (since JPEG does not support transparency)
  if (options.targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const ext = options.targetFormat === 'image/jpeg' ? 'jpg' : options.targetFormat === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newFileName = `${baseName}.${ext}`;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to convert image.'));
      },
      options.targetFormat,
      options.quality
    );
  });

  return { blob, fileName: newFileName };
}

/**
 * Resize an image by pixel dimensions.
 */
export async function resizeImage(file: File, options: ImageResizeOptions): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const format = options.format || (file.type as any) || 'image/jpeg';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, options.width, options.height);

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newFileName = `${baseName}_resized_${options.width}x${options.height}.${ext}`;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Resize failed.'))),
      format,
      options.quality ?? 0.92
    );
  });

  return { blob, fileName: newFileName };
}

/**
 * Crop an image using rectangular pixel coordinates.
 */
export async function cropImage(file: File, options: ImageCropOptions): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(options.width));
  canvas.height = Math.max(1, Math.round(options.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context.');

  const format = options.format || (file.type as any) || 'image/jpeg';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    img,
    options.x,
    options.y,
    options.width,
    options.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newFileName = `${baseName}_cropped.${ext}`;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Crop failed.'))),
      format,
      options.quality ?? 0.92
    );
  });

  return { blob, fileName: newFileName };
}

/**
 * Rotate (90, 180, 270) and/or flip an image.
 */
export async function rotateFlipImage(file: File, options: ImageTransformOptions): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');

  const rot = ((options.rotation % 360) + 360) % 360;
  const swapDims = rot === 90 || rot === 270;

  canvas.width = swapDims ? img.naturalHeight : img.naturalWidth;
  canvas.height = swapDims ? img.naturalWidth : img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context.');

  const format = options.format || (file.type as any) || 'image/jpeg';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newFileName = `${baseName}_transformed.${ext}`;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Transform failed.'))),
      format,
      options.quality ?? 0.92
    );
  });

  return { blob, fileName: newFileName };
}
