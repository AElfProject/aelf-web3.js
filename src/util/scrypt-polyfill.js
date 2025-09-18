/**
 * @file Unified scrypt polyfill using scrypt-js
 * @author AI Assistant
 * @date 2025-09-18
 * @description This module provides a unified scrypt implementation using scrypt-js
 *              for both Node.js and browser environments for consistency
 */
import { syncScrypt } from 'scrypt-js';

// const defaultOptions = {
//   maxmem: 32 * 1024 * 1024
// };

/**
 * Scrypt key derivation function using scrypt-js
 * @param {Buffer|Uint8Array} password - The password
 * @param {Buffer|Uint8Array} salt - The salt
 * @param {number} N - CPU/memory cost parameter
 * @param {number} r - Block size parameter
 * @param {number} p - Parallelization parameter
 * @param {number} dklen - Desired key length
 * @param {Object} options - Additional options (unused in this implementation)
 * @returns {Buffer} Derived key
 */
// function scrypt(password, salt, N, r, p, dklen, options = defaultOptions) {
function scrypt(password, salt, N, r, p, dklen) {
  // Convert inputs to Uint8Array if they are Buffer
  const passwordUint8 = password instanceof Buffer ? new Uint8Array(password) : password;
  const saltUint8 = salt instanceof Buffer ? new Uint8Array(salt) : salt;

  // Use scrypt-js to derive the key
  const result = syncScrypt(passwordUint8, saltUint8, N, r, p, dklen);

  // Convert result back to Buffer for compatibility
  return Buffer.from(result);
}

export default scrypt;
