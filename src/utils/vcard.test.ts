import test from 'node:test';
import assert from 'node:assert/strict';
import { generateVCard } from './vcard.ts';

test('generates valid vCard 3.0 structure', () => {
  const vcard = generateVCard({
    fullName: 'Abdessamia Abderrazak',
    title: 'Lead Architect',
    company: 'ZakaTy International',
    phone: '+34 600 000 000',
    email: 'abderrazak.abdessamia5@gmail.com',
    website: 'https://zakaty.example.com',
    address: 'Madrid, Spain',
    bio: 'Software engineer and founder.',
  });

  assert.ok(vcard.startsWith('BEGIN:VCARD\r\nVERSION:3.0'));
  assert.ok(vcard.includes('FN:Abdessamia Abderrazak'));
  assert.ok(vcard.includes('ORG:ZakaTy International'));
  assert.ok(vcard.includes('TITLE:Lead Architect'));
  assert.ok(vcard.includes('TEL;TYPE=CELL,VOICE:+34 600 000 000'));
  assert.ok(vcard.includes('EMAIL;TYPE=INTERNET,PREF:abderrazak.abdessamia5@gmail.com'));
  assert.ok(vcard.includes('URL:https://zakaty.example.com'));
  assert.ok(vcard.endsWith('END:VCARD'));
});

test('escapes special characters like commas and semicolons in vCard', () => {
  const vcard = generateVCard({
    fullName: 'Doe, John; Jr.',
    company: 'Acme, Inc.; Global',
  });

  assert.ok(vcard.includes('FN:Doe\\, John\\; Jr.'));
  assert.ok(vcard.includes('ORG:Acme\\, Inc.\\; Global'));
});
