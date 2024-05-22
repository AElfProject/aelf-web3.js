/**
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
import descriptor from '@aelfqueen/protobufjs/ext/descriptor';
import bs58 from 'bs58';
import {
  base58
} from './utils';

const getByteCountByAddress = base58Str => {
  // convert a Base58 string to a binary array and get its byte count
  const buffer = bs58.decode(base58Str);
  // get byte
  const byteCount = buffer.length;
  // last four digits are the checksum
  return byteCount;
};

export const inputAddressFormatter = address => {
  let realAddress = address;
  if (address && address.value) {
    realAddress = address.value;
  }
  try {
    if (realAddress.indexOf('_') > 0) {
      const parts = realAddress.split('_');
      realAddress = parts?.[1];
    }
    if (getByteCountByAddress(realAddress) !== 36) {
      throw new Error('Invalid address');
    }
    base58.decode(realAddress, 'hex');
  } catch (e) {
    throw new Error('Invalid address');
  }
  return realAddress;
};

/**
 * @param {String} result base64 representation of serialized FileDescriptorSet
 * @returns {FileDescriptorSet} decoded FileDescriptorSet message
 */
export const outputFileDescriptorSetFormatter = result => {
  const buffer = Buffer.from(result, 'base64');
  return descriptor.FileDescriptorSet.decode(buffer);
};
