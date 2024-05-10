/**
 * @file proto utils
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs';
import * as utils from './utils';
import {
  transform,
  OUTPUT_TRANSFORMERS,
  transformArrayToMap
} from './transform';

export const coreRootProto = protobuf.loadSync('proto/transaction_fee.proto').nested.aelf;

export const {
  Transaction,
  Hash,
  Address,
  TransactionFeeCharged,
  ResourceTokenCharged
} = coreRootProto;

export const getFee = (base64Str, type = 'TransactionFeeCharged') => {
  if (['ResourceTokenCharged', 'TransactionFeeCharged'].indexOf(type) === -1) {
    throw new Error('type needs to be one of ResourceTokenCharged and TransactionFeeCharged');
  }
  const dataType = coreRootProto[type];
  let deserialize = dataType.decode(Buffer.from(base64Str, 'base64'));
  deserialize = dataType.toObject(deserialize, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true // includes virtual oneof fields set to the present field's name
  });
  // eslint-disable-next-line max-len
  let deserializeLogResult = transform(dataType, deserialize, OUTPUT_TRANSFORMERS);
  deserializeLogResult = transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
};

export const getSerializedDataFromLog = log => {
  const {
    NonIndexed,
    Indexed = []
  } = log;
  const serializedData = [...(Indexed || [])];
  if (NonIndexed) {
    serializedData.push(NonIndexed);
  }
  return serializedData.join('');
};

export const getResourceFee = (Logs = []) => {
  if (!Array.isArray(Logs) || Logs.length === 0) {
    return [];
  }
  return Logs.filter(log => log.Name === 'ResourceTokenCharged')
    .map(v => getFee(getSerializedDataFromLog(v), 'ResourceTokenCharged'));
};

export const getTransactionFee = (Logs = []) => {
  if (!Array.isArray(Logs) || Logs.length === 0) {
    return [];
  }
  return Logs.filter(log => log.Name === 'TransactionFeeCharged')
    .map(v => getFee(getSerializedDataFromLog(v), 'TransactionFeeCharged'));
};

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

const deserializeIndexedAndNonIndexed = (serializedData, dataType) => {
  let deserializeLogResult = serializedData.reduce((acc, v) => {
    let deserialize = dataType.decode(Buffer.from(v, 'base64'));
    deserialize = dataType.toObject(deserialize, {
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      bytes: String, // bytes as base64 encoded strings
      defaults: false, // includes default values
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true, // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize,
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = transform(
    dataType,
    deserializeLogResult,
    OUTPUT_TRANSFORMERS
  );
  deserializeLogResult = transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
};
const deserializeWithServicesAndRoot = (logs, services, Root) => {
  // filter by address and name
  if (logs.length === 0) {
    return [];
  }
  const results = logs.map(item => {
    const { Name, NonIndexed, Indexed } = item;
    let dataType;
    // eslint-disable-next-line no-restricted-syntax
    for (const service of services) {
      try {
        dataType = service.lookupType(Name);
        break;
      } catch (e) {}
    }
    const serializedData = [...(Indexed || [])];
    if (NonIndexed) {
      serializedData.push(NonIndexed);
    }
    if (Name === 'VirtualTransactionCreated') {
      // VirtualTransactionCreated is system-default
      try {
        dataType = Root.VirtualTransactionCreated;
        return deserializeIndexedAndNonIndexed(serializedData, dataType);
      } catch (e) {
        // if normal contract has a method called VirtualTransactionCreated
        return deserializeIndexedAndNonIndexed(serializedData, dataType);
      }
    } else {
      // if dataType cannot be found and also is not VirtualTransactionCreated
      if (!dataType) {
        return {
          message: 'This log is not supported.',
        };
      }
      // other method
      return deserializeIndexedAndNonIndexed(serializedData, dataType);
    }
  });
  return results;
};
/**
 * deserialize logs async
 *
 * @alias module:AElf/pbUtils
 * @param {array} logs array of log which enclude Address,Name,Indexed and NonIndexed.
 * @param {array} services array of service which got from getContractFileDescriptorSet
 * @return {array} deserializeLogResult
 */
export const deserializeLog = async (logs = [], services) => {
  const Root = await protobuf.load('proto/virtual_transaction.proto');
  return deserializeWithServicesAndRoot(logs, services, Root);
};
/**
 * deserialize logs sync
 *
 * @alias module:AElf/pbUtils
 * @param {array} logs array of log which enclude Address,Name,Indexed and NonIndexed.
 * @param {array} services array of service which got from getContractFileDescriptorSet
 * @return {array} deserializeLogResult
 */
export const deserializeLogSync = (logs = [], services) => {
  const Root = protobuf.loadSync('proto/virtual_transaction.proto');
  return deserializeWithServicesAndRoot(logs, services, Root);
};

/* eslint-enable */
