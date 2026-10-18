/**
 * Standard vCard (VCF 3.0) generator.
 * Produces compliant contact cards for mobile and desktop address books (Apple Contacts, Google Contacts, Outlook).
 */

export interface VCardInput {
  fullName: string;
  title?: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  bio?: string;
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r?\n/g, '\\n');
}

export function generateVCard(input: VCardInput): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(input.fullName || 'Contact')}`,
  ];

  // N (structured name): Family;Given;Additional;Prefix;Suffix
  const parts = (input.fullName || '').trim().split(/\s+/);
  if (parts.length > 1) {
    const given = parts[0];
    const family = parts.slice(1).join(' ');
    lines.push(`N:${escapeVCardValue(family)};${escapeVCardValue(given)};;;`);
  } else {
    lines.push(`N:${escapeVCardValue(input.fullName || 'Contact')};;;;`);
  }

  if (input.company) {
    lines.push(`ORG:${escapeVCardValue(input.company)}`);
  }

  if (input.title) {
    lines.push(`TITLE:${escapeVCardValue(input.title)}`);
  }

  if (input.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${input.phone.trim()}`);
  }

  if (input.whatsapp && input.whatsapp !== input.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${input.whatsapp.trim()}`);
  }

  if (input.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${input.email.trim()}`);
  }

  if (input.website) {
    lines.push(`URL:${input.website.trim()}`);
  }

  if (input.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(input.address)};;;;`);
  }

  if (input.bio) {
    lines.push(`NOTE:${escapeVCardValue(input.bio)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
