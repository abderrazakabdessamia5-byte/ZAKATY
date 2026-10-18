import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSlug, validateSlug } from './slugify.ts';

test('generates clean slug from company or person name', () => {
  assert.equal(generateSlug('Abdessamia Abderrazak'), 'abdessamia-abderrazak');
  assert.equal(generateSlug('  Studio & Co. 2026!  '), 'studio-co-2026');
  assert.equal(generateSlug('Café Délices Paris'), 'cafe-delices-paris');
});

test('validates valid slugs', () => {
  assert.equal(validateSlug('zakatydemo').isValid, true);
  assert.equal(validateSlug('my-cool-company').isValid, true);
  assert.equal(validateSlug('dev2026').isValid, true);
});

test('rejects too short or too long slugs', () => {
  assert.equal(validateSlug('ab').isValid, false);
  assert.equal(validateSlug('a'.repeat(45)).isValid, false);
});

test('rejects invalid characters and double hyphens', () => {
  assert.equal(validateSlug('bad_slug').isValid, false);
  assert.equal(validateSlug('bad--slug').isValid, false);
  assert.equal(validateSlug('-leading').isValid, false);
});

test('rejects reserved keywords like admin, api, login', () => {
  assert.equal(validateSlug('admin').isValid, false);
  assert.equal(validateSlug('api').isValid, false);
  assert.equal(validateSlug('privacy').isValid, false);
});
