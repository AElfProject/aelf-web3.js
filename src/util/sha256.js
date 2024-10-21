import { Sha256 } from '@aws-crypto/sha256-js';
/**
 * Hashes a given value using the SHA-256 algorithm and returns the hash as a hexadecimal string.
 *
 * @param {any} value - The value to be hashed.
 * @returns {string} The resulting SHA-256 hash as a hexadecimal string.
 */
const sha256 = value => {
  const hexStr = value;
  const hash = new Sha256();
  hash.update(hexStr);
  const hashUint8Array = hash.digestSync();
  return Buffer.from(hashUint8Array).toString('hex');
};
/**
 * Hashes a given value using the SHA-256 algorithm and returns the raw Uint8Array hash result.
 *
 * @param {any} value - The value to be hashed.
 * @returns {Uint8Array} The resulting SHA-256 hash as a Uint8Array.
 */
sha256.digest = value => {
  const hexStr = value;
  const hash = new Sha256();
  hash.update(hexStr);
  const hashUint8Array = hash.digestSync();
  return hashUint8Array;
};
/**
 * Alias for sha256.digest. Hashes a given value using the SHA-256 algorithm and returns the raw Uint8Array hash result.
 *
 * @param {any} value - The value to be hashed.
 * @returns {Uint8Array} The resulting SHA-256 hash as a Uint8Array.
 */
sha256.array = sha256.digest;

export default sha256;
