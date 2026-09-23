/**
 * KHABAR — Input Validation & XSS Sanitization Engine
 * Validates formats, enforces bounds, and sanitizes untrusted user strings.
 */

// Regex for Bangladeshi mobile phone numbers:
// Matches +8801[3-9]XXXXXXXX, 8801[3-9]XXXXXXXX, 01[3-9]XXXXXXXX with optional hyphens/spaces
export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

// Standard RFC 5322 compatible email format
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Escapes HTML control characters to prevent Cross-Site Scripting (XSS)
 */
export const sanitizeHtml = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Strips script tags, Javascript protocol handlers, and dangerous attributes
 */
export const stripDangerousContent = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Sanitizes and truncates a user-supplied text string
 */
export const sanitizeText = (input: unknown, maxLength = 255): string => {
  if (typeof input !== 'string') return '';
  const cleaned = stripDangerousContent(input);
  return cleaned.slice(0, maxLength);
};

/**
 * Normalizes and validates Bangladeshi phone number
 */
export const validateBDPhone = (phone: string): { isValid: boolean; normalized: string; error?: string } => {
  const digitsOnly = phone.replace(/[\s\-\(\)]/g, '');
  if (!BD_PHONE_REGEX.test(digitsOnly)) {
    return {
      isValid: false,
      normalized: phone,
      error: 'Please enter a valid Bangladeshi mobile number (e.g. 01712-345678 or +8801819-223344)',
    };
  }
  let normalized = digitsOnly;
  if (!normalized.startsWith('+88')) {
    normalized = normalized.startsWith('88') ? `+${normalized}` : `+88${normalized}`;
  }
  return { isValid: true, normalized };
};

/**
 * Validates email address format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const trimmed = email.trim();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g. name@domain.com)',
    };
  }
  return { isValid: true };
};

/**
 * Validates password strength
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters in length',
    };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must contain both letters and numbers',
    };
  }
  return { isValid: true };
};

/**
 * Validates an integer within range
 */
export const validateInteger = (
  value: unknown,
  min: number,
  max: number,
  fieldName = 'Value'
): { isValid: boolean; parsedValue: number; error?: string } => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < min || num > max) {
    return {
      isValid: false,
      parsedValue: min,
      error: `${fieldName} must be an integer between ${min} and ${max}`,
    };
  }
  return { isValid: true, parsedValue: num };
};

/**
 * Validates reservation date is today or in future (up to 30 days ahead)
 */
export const validateReservationDate = (dateStr: string): { isValid: boolean; error?: string } => {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: 'Invalid reservation date format' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  if (parsed < today) {
    return { isValid: false, error: 'Reservation date cannot be in the past' };
  }
  if (parsed > maxDate) {
    return { isValid: false, error: 'Reservations can only be booked up to 30 days in advance' };
  }
  return { isValid: true };
};
