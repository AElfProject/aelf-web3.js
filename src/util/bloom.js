/**
 * @file bloom
 * @author joshstevens19
 * @link https://github.com/joshstevens19/ethereum-bloom-filters
 */
import sha256 from './sha256';
import {
  Address,
  getAddressObjectFromRep
} from './proto';

function isBloom(bloom) {
  if (bloom instanceof Buffer || bloom instanceof Uint8Array) {
    return bloom.length === 256;
  }

  if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
    return false;
  }

  if (
    /^(0x)?[0-9a-f]{512}$/.test(bloom)
    || /^(0x)?[0-9A-F]{512}$/.test(bloom)
  ) {
    return true;
  }

  return false;
}

/**
 * @param codePoint
 * @return {number}
 */
function codePointToInt(codePoint) {
  if (codePoint >= 48 && codePoint <= 57) {
    /* ['0'..'9'] -> [0..9] */
    return codePoint - 48;
  }

  if (codePoint >= 65 && codePoint <= 70) {
    /* ['A'..'F'] -> [10..15] */
    return codePoint - 55;
  }

  if (codePoint >= 97 && codePoint <= 102) {
    /* ['a'..'f'] -> [10..15] */
    return codePoint - 87;
  }

  throw new Error('invalid bloom');
}

/**
 * @param {string} bloom hex string
 * @param {string} hash hex string
 * @return {boolean}
 */
export function isInBloom(bloom, hash) {
  if (!isBloom(bloom)) {
    throw new Error('Invalid Bloom');
  }
  for (let i = 0; i < 12; i += 4) {
    // calculate bit position in bloom filter that must be active
    const bitpos = ((parseInt(hash.substr(i, 2), 16) << 8)
      + parseInt(hash.substr(i + 2, 2), 16))
      & 2047;

    // test if bitpos in bloom is active
    const code = codePointToInt(
      bloom.charCodeAt(bloom.length - 1 - Math.floor(bitpos / 4)),
    );
    const offset = 1 << bitpos % 4;

    if ((code & offset) !== offset) {
      return false;
    }
  }
  return true;
}

/**
 * @param {string} bloom base64 string
 * @param {string} eventName utf-8 string, such as `Transferred`
 * @return {boolean}
 */
export function isEventInBloom(bloom, eventName) {
  return isInBloom(Buffer.from(bloom, 'base64').toString('hex'), sha256(eventName));
}

export function isIndexedInBloom(bloom, indexed) {
  return isInBloom(Buffer.from(bloom, 'base64').toString('hex'), sha256(Buffer.from(indexed, 'base64')));
}

export function isAddressInBloom(bloom, address) {
  const encodedAddress = Address.encode(getAddressObjectFromRep(address)).finish();
  return isInBloom(Buffer.from(bloom, 'base64').toString('hex'), sha256(encodedAddress));
}
