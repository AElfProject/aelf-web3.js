/**
 * @file scrypt.js for scrypt polyfill
 * @author atom-yang
 * @date 2019-07-25
 */
const crypto = require('crypto');

function scrypt(password, salt, N, r, p, dklen) {
  return crypto.scryptSync(password, salt, dklen, {
    N,
    r,
    p
  });
}

module.exports = scrypt;
