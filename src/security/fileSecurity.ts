/**
 * KHABAR — File Upload Security & Validation
 * Enforces allowed image types, size caps, and filename sanitization.
 */

import { generateSecureRandomToken } from './crypto';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFilename?: string;
  error?: string;
}

export const validateUploadedImage = (
  file: File | { name: string; size: number; type: string }
): FileValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Size limit check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds maximum allowed size of 5 MB (File size: ${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
    };
  }

  // MIME type check
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: 'Invalid file format. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Extension check
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      error: 'Invalid file extension. Permitted extensions: .jpg, .jpeg, .png, .webp',
    };
  }

  // Generate cryptographically unique, sanitized storage filename
  const sanitizedFilename = `khabar_${Date.now()}_${generateSecureRandomToken(8)}.${ext}`;

  return {
    isValid: true,
    sanitizedFilename,
  };
};
