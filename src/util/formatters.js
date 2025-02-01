/**
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
import descriptor from '@aelfqueen/protobufjs/ext/descriptor/index.js';
import bs58 from 'bs58';
import { base58 } from './utils.js';

const getByteCountByAddress = base58Str => {
  const buffer = bs58.decode(base58Str);
  return buffer.length;
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

export const outputFileDescriptorSetFormatter = result => {
  const buffer = Buffer.from(result, 'base64');
  return descriptor.FileDescriptorSet.decode(buffer);
};

export const formatTransactionHash = hash => {
  if (!hash || typeof hash !== 'string') {
    throw new Error('Invalid transaction hash');
  }
  return hash.toLowerCase();
};

export const formatBlockNumber = blockNumber => {
  if (typeof blockNumber === 'number') {
    return `0x${blockNumber.toString(16)}`;
  }
  if (typeof blockNumber === 'string' && /^0x[0-9a-fA-F]+$/.test(blockNumber)) {
    return blockNumber;
  }
  throw new Error('Invalid block number');
};

export const formatSignature = signature => {
  if (!signature || typeof signature !== 'string') {
    throw new Error('Invalid signature');
  }
  return signature.startsWith('0x') ? signature : `0x${signature}`;
};

export const formatHexToBytes = hex => {
  if (!/^0x[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Invalid hex format');
  }
  return Buffer.from(hex.slice(2), 'hex');
};

export const formatBytesToHex = bytes => {
  if (!Buffer.isBuffer(bytes)) {
    throw new Error('Invalid bytes input');
  }
  return `0x${bytes.toString('hex')}`;
};

export const formatTimestamp = timestamp => {
  if (typeof timestamp !== 'number') {
    throw new Error('Invalid timestamp');
  }
  return new Date(timestamp * 1000).toISOString();
};

export const formatBoolean = value => {
  return !!value;
};

export const formatGasLimit = gas => {
  if (typeof gas !== 'number' || gas < 0) {
    throw new Error('Invalid gas limit');
  }
  return `0x${gas.toString(16)}`;
};

export const formatDataPayload = data => {
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid data payload');
  }
  return data.startsWith('0x') ? data : `0x${Buffer.from(data).toString('hex')}`;
};

export const formatNonce = nonce => {
  if (typeof nonce !== 'number' || nonce < 0) {
    throw new Error('Invalid nonce');
  }
  return `0x${nonce.toString(16)}`;
};
