/**
 * @file proto utils
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs/light';
import coreDescriptor from '../../proto/core.proto.json';
import * as utils from './utils';

export const coreRootProto = protobuf.Root.fromJSON(coreDescriptor);
/* eslint-disable no-unused-vars */

export const {
  Transaction,
  Hash,
  Address
} = coreRootProto;

/**
 * arrayBuffer To Hex
 *
 * @alias module:AElf/pbUtils
 * @param {Buffer} arrayBuffer arrayBuffer
 * @return {string} hex string
 */
export const arrayBufferToHex = arrayBuffer => Array.prototype.map.call(
  new Uint8Array(arrayBuffer),
  n => (`0${n.toString(16)}`).slice(-2)
).join('');

/**
 * get hex rep From Address
 *
 * @alias module:AElf/pbUtils
 * @param {protobuf} address kernel.Address
 * @return {string} hex rep of address
 */
export const getRepForAddress = address => {
  const message = Address.fromObject(address);
  let hex = '';
  if (message.value instanceof Buffer) {
    hex = message.value.toString('hex');
  } else {
    // Uint8Array
    hex = arrayBufferToHex(message.value);
  }
  return utils.encodeAddressRep(hex);
};

/**
 * get address From hex rep
 *
 * @alias module:AElf/pbUtils
 * @param {string} rep address
 * @return {protobuf} address kernel.Address
 */
export const getAddressFromRep = rep => {
  const hex = utils.decodeAddressRep(rep);
  return Address.create({
    value: Buffer.from(hex.replace('0x', ''), 'hex')
  });
};

/**
 * get address From hex rep
 *
 * @alias module:AElf/pbUtils
 * @param {string} rep address
 * @return {protobuf} address kernel.Address
 */
export const getAddressObjectFromRep = rep => Address.toObject(getAddressFromRep(rep));

/**
 * get hex rep From hash
 *
 * @alias module:AElf/pbUtils
 * @param {protobuf} hash kernel.Hash
 * @return {string} hex rep
 */
export const getRepForHash = hash => {
  const message = Address.fromObject(hash);
  let hex = '';
  if (message.value instanceof Buffer) {
    hex = message.value.toString('hex');
  } else {
    // Uint8Array
    hex = arrayBufferToHex(message.value);
  }
  return hex;
};

/**
 * get Hash From Hex
 *
 * @alias module:AElf/pbUtils
 * @param {string} hex string
 * @return {protobuf} kernel.Hash
 */
export const getHashFromHex = hex => Hash.create({
  value: Buffer.from(hex.replace('0x', ''), 'hex')
});

/**
 * get Hash Object From Hex
 *
 * @alias module:AElf/pbUtils
 * @param {string} hex string
 * @return {Object} kernel.Hash Hash ot Object
 */
export const getHashObjectFromHex = hex => Hash.toObject(getHashFromHex(hex));

/**
 * encode Transaction to protobuf type
 *
 * @alias module:AElf/pbUtils
 * @param {Object} tx object
 * @return {protobuf} kernel.Transaction
 */
export const encodeTransaction = tx => Transaction.encode(tx).finish();

/**
 * get Transaction
 *
 * @alias module:AElf/pbUtils
 * @param {string} from
 * @param {string} to
 * @param {string} methodName
 * @param {string} params
 * @return {protobuf} kernel.Transaction
 */
export const getTransaction = (from, to, methodName, params) => {
  const txn = {
    from: getAddressFromRep(from),
    to: getAddressFromRep(to),
    methodName,
    params
  };
  return Transaction.create(txn);
};

/* eslint-enable */
