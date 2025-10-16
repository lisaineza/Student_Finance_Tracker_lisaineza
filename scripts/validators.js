// Regex catalog and validation utilities for the app
// - Includes 4+ rules and one advanced rule (back-reference).
// - validateRecord returns a map of field -> human-friendly error message.

export const RE = {
  // Description: must not start or end with whitespace and not be just empty
  description: /^\S(?:[\s\S]*\S)?$/,
  // Amount: integer or decimal with up to 2 places (allows 0 but validateRecord will enforce >0)
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  // Date ISO YYYY-MM-DD (basic validation)
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  // Category: letters, spaces and hyphens only (no leading/trailing spaces)
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  // Advanced: duplicate adjacent word (back-reference)
  duplicateWord: /\b(\w+)\s+\1\b/i,
  // Check for cents shown explicitly (e.g. .00)
  centsPresent: /\.\d{2}\b/,
  // Example domain-specific regex: beverage detection
  beverage: /(coffee|tea)/i,
};

/**
 * Collapse repeated whitespace and trim.
 * @param {string} value
 * @returns {string}
 */
export function sanitizeDescription(value){
  if (typeof value !== 'string') return '';
  return value.replace(/\s{2,}/g,' ').trim(); // collapse doubles, trim
}

/**
 * Validate a record object and return errors map: { field: message }
 * Rules include:
 * - date format and not in the future
 * - description format and max length
 * - amount numeric, two decimals max, and > 0
 * - category format
 */
export function validateRecord({date, description, amount, category}){
  const errs = {};

  // Date
  if (!date || !RE.date.test(date)) errs.date = 'Use YYYY-MM-DD';
  else {
    // disallow future dates
    const d = new Date(date + 'T00:00:00');
    const now = new Date(); now.setHours(0,0,0,0);
    if (d > now) errs.date = 'Date cannot be in the future';
  }

  // Description
  if (!description || !RE.description.test(description)) errs.description = 'No leading/trailing spaces';
  else if (description.length > 200) errs.description = 'Description too long (max 200 chars)';

  // Amount
  if (amount === '' || amount === null || amount === undefined || String(amount).trim() === '') errs.amount = 'Amount required';
  else if (!RE.amount.test(String(amount))) errs.amount = 'Number with up to 2 decimals';
  else if (Number(amount) <= 0) errs.amount = 'Amount must be greater than 0';

  // Category
  if (!category || !RE.category.test(category)) errs.category = 'Letters, spaces, hyphens only';

  return errs;
}

/**
 * Safely compile a user-provided regex. Returns RegExp or null on compile error.
 * @param {string} input
 * @param {string} flags
 */
export function compileRegex(input, flags='i'){
  try{ return input ? new RegExp(input, flags) : null; } catch { return null; }
}

/**
 * Highlight matches in a string with <mark> for UI rendering.
 * @param {string} text
 * @param {RegExp|null} re
 */
export function highlight(text, re){
  if (!re) return text;
  return String(text).replace(re, m => `<mark>${m}</mark>`);
}
