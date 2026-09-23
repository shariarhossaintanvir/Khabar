/**
 * KHABAR — Cryptographic Security Utilities
 * Implements PBKDF2 with SHA-256 for password hashing and verification,
 * cryptographically secure token generation, and constant-time string comparison.
 */

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH_BYTES = 32; // 256 bits

/**
 * Generates a cryptographically secure random hex string
 */
export const generateSecureRandomToken = (bytesCount = 32): string => {
  const array = new Uint8Array(bytesCount);
  (globalThis.crypto || window.crypto).getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Generates a cryptographically secure dynamic numeric OTP
 */
export const generateSecureNumericOTP = (length = 6): string => {
  const digits = new Uint32Array(length);
  (globalThis.crypto || window.crypto).getRandomValues(digits);
  return Array.from(digits)
    .map((num) => (num % 10).toString())
    .join('');
};

/**
 * Hashes a plaintext password using PBKDF2 (SHA-256) with a unique cryptographic salt.
 * Returns a serialized string: "pbkdf2$iterations$saltHex$hashHex"
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const salt = new Uint8Array(16);
  (globalThis.crypto || window.crypto).getRandomValues(salt);

  const passwordKey = await (globalThis.crypto || window.crypto).subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await (globalThis.crypto || window.crypto).subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LENGTH_BYTES * 8
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `pbkdf2$${PBKDF2_ITERATIONS}$${saltHex}$${hashHex}`;
};

/**
 * Verifies a plaintext password against a serialized PBKDF2 hash
 * using constant-time comparison.
 */
export const verifyPassword = async (password: string, serializedHash: string): Promise<boolean> => {
  try {
    const parts = serializedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const saltHex = parts[2];
    const expectedHashHex = parts[3];

    // Reconstruct salt
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const encoder = new TextEncoder();
    const passwordKey = await (globalThis.crypto || window.crypto).subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await (globalThis.crypto || window.crypto).subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      passwordKey,
      KEY_LENGTH_BYTES * 8
    );

    const computedHashHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return timingSafeEqual(computedHashHex, expectedHashHex);
  } catch {
    return false;
  }
};

/**
 * Constant-time string comparison to neutralize timing attacks
 */
export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
};

/**
 * Generates an HMAC-SHA256 digest for message signing & webhook verification
 */
export const createHMACSHA256 = async (message: string, secretKey: string): Promise<string> => {
  const encoder = new TextEncoder();
  const key = await (globalThis.crypto || window.crypto).subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await (globalThis.crypto || window.crypto).subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

