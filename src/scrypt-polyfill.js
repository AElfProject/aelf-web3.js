/**
 * @file scrypt.js for scrypt polyfill
 * @author atom-yang
 * @date 2019-07-25
 */
const crypto = require('crypto');

const defaultOptions = {
  maxmem: 32 * 1024 * 1024
};

function scrypt(password, salt, N, r, p, dklen, options = defaultOptions) {
  return crypto.scryptSync(password, salt, dklen, {
    ...options,
    N,
    r,
    p
  });
}

export default scrypt;
