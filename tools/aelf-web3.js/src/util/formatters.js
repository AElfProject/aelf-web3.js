/**
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
import descriptor from '@aelfqueen/protobufjs/ext/descriptor';
import {
  base58
} from './utils';

export const inputAddressFormatter = address => {
  let realAddress = address;
  if (address && address.value) {
    realAddress = address.value;
  }
  if (realAddress.indexOf('_') > 0) {
    const parts = realAddress.split('_');
    const list = parts.filter(v => {
      try {
        base58.decode(v, 'hex');
        return true;
      } catch (e) {
        return false;
      }
    });
    if (list.length === 0) {
      throw new Error('Invalid address');
    }
    [realAddress] = list;
  }
  try {
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
