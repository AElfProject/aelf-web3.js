'use strict'
var sha256 = require('js-sha256').sha256;
// var crypto = require('crypto');
var base58 = require('bs58');


module.exports.encode = (data, encoding = 'hex') => {
  if (typeof data === 'string') {
    data = new Buffer(data, encoding)
  }
  if (!(data instanceof Buffer)) {
    throw new TypeError('"data" argument must be an Array of Buffers')
  }
  var hash = data;
  hash = Buffer.from(sha256(hash), 'hex');
  hash = Buffer.from(sha256(hash), 'hex');
  hash = Buffer.from(data.toString('hex')+hash.slice(0, 4).toString('hex'), 'hex');
  return base58.encode(hash)
}

module.exports.decode = (string, encoding) => {
  var buffer = new Buffer(base58.decode(string));
  var data = buffer.slice(0, -4);
  var hash = data;
  hash = Buffer.from(sha256(hash), 'hex');
  hash = Buffer.from(sha256(hash), 'hex');
  buffer.slice(-4).forEach((check, index) => {
    if (check !== hash[index]) {
      throw new Error('Invalid checksum');
    }
  });
  if (encoding) {
    data = data.toString(encoding);
  }
  return data;
}