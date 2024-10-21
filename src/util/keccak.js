const createKeccakHash = require('keccak');
/**
 * Generates a keccak hash of the given string or hex-encoded string.
 * @param {string} str - The input string or hex-encoded string (with '0x' prefix).
 * @returns {string} The keccak hash of the input as a hex-encoded string prefixed with '0x'.
 */

const keccak = bits => str => {
  let msg;
  if (str.slice(0, 2) === '0x') {
    msg = [];
    for (let i = 2, l = str.length; i < l; i += 2) {
      msg.push(parseInt(str.slice(i, i + 2), 16));
    }
    msg = Buffer.from(msg);
  } else {
    msg = str;
  }
  const instance = createKeccakHash(`keccak${bits}`);
  return `0x${instance.update(msg).digest('hex')}`;
};

export const keccak256 = keccak(256);
export const keccak512 = keccak(512);
export const keccak256s = keccak(256);
export const keccak512s = keccak(512);
