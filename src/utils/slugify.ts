/**
 * URL Slug generation and validation utilities for digital business profiles.
 */

const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'dashboard',
  'login',
  'signup',
  'register',
  'account',
  'p',
  'profile',
  'profiles',
  'tools',
  'pdf',
  'image',
  'qr',
  'nfc',
  'settings',
  'terms',
  'privacy',
  'contact',
  'about',
  'cookies',
  'donate',
  'sitemap',
  'robots',
]);

/**
 * Normalizes text to a clean URL-friendly slug.
 */
export function generateSlug(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // spaces to hyphen
    .replace(/-+/g, '-') // collapse hyphens
    .replace(/^-|-$/g, '') // trim hyphens
    .slice(0, 40);
}

/**
 * Validates a profile slug.
 */
export function validateSlug(slug: string): { isValid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { isValid: false, error: 'Slug cannot be empty.' };
  }

  const clean = slug.trim().toLowerCase();

  if (clean.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters long.' };
  }

  if (clean.length > 40) {
    return { isValid: false, error: 'Slug cannot exceed 40 characters.' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(clean)) {
    return {
      isValid: false,
      error: 'Slug can only contain lowercase letters, numbers, and single hyphens between words.',
    };
  }

  if (RESERVED_SLUGS.has(clean)) {
    return { isValid: false, error: `"${clean}" is a reserved system URL path. Please choose another.` };
  }

  return { isValid: true };
}
