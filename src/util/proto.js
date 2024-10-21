/**
 * @file proto utils
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs';
import * as utils from './utils';
import { transform, OUTPUT_TRANSFORMERS, transformArrayToMap } from './transform';
import coreDescriptor from '../../proto/transaction_fee.proto.json';
import VirtualTransactionDescriptor from '../../proto/virtual_transaction.proto.json';

// We cannot use loadSync because it's not supoort browsers
// https://github.com/protobufjs/protobuf.js/issues/1648
export const coreRootProto = protobuf.Root.fromJSON(coreDescriptor).nested.aelf;
export const {
  Transaction,
  TransactionAndChainId,
  MultiTransaction,
  Hash,
  Address,
  TransactionFeeCharged,
  ResourceTokenCharged
} = coreRootProto;
/**
 * @typedef {import('../../types/util/proto').ILog} ILog
 * @typedef {import('../../types/util/proto').TAddress} TAddress
 * @typedef {import('@aelfqueen/protobufjs')} protobuf
 */

/**
 * Decodes a base64 encoded string into a protobuf object of the specified type.
 * @param {string} base64Str - The base64 encoded string to decode.
 * @param {string} [type='TransactionFeeCharged'] - The type to decode into. Must be either 'ResourceTokenCharged' or 'TransactionFeeCharged'.
 * @throws {Error} Throws an error if the type is not valid.
 * @return {Object.<string, any> | undefined | null } The deserialized protobuf object.
 */

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
/**
 * Serializes log data into a string.
 * @param {ILog} log - The log object containing NonIndexed and Indexed fields.
 * @return {string} The serialized log data.
 */

export const getSerializedDataFromLog = log => {
  const { NonIndexed, Indexed = [] } = log;
  const serializedData = [...(Indexed || [])];
  if (NonIndexed) {
    serializedData.push(NonIndexed);
  }
  return serializedData.join('');
};
/**
 * Retrieves an array of resource fees from logs.
 * @param {Array<ILog>} [Logs=[]] - The array of log objects.
 * @return {Array<ILog>} The array of deserialized resource fee objects.
 */

export const getResourceFee = (Logs = []) => {
  if (!Array.isArray(Logs) || Logs.length === 0) {
    return [];
  }
  return Logs.filter(log => log.Name === 'ResourceTokenCharged').map(v =>
    getFee(getSerializedDataFromLog(v), 'ResourceTokenCharged')
  );
};
/**
 * Retrieves an array of transaction fees from logs.
 * @param {Array<ILog>} [Logs=[]] - The array of log objects.
 * @return {Array<ILog>} The array of deserialized transaction fee objects.
 */
export const getTransactionFee = (Logs = []) => {
  if (!Array.isArray(Logs) || Logs.length === 0) {
    return [];
  }
  return Logs.filter(log => log.Name === 'TransactionFeeCharged').map(v =>
    getFee(getSerializedDataFromLog(v), 'TransactionFeeCharged')
  );
};

/**
 * arrayBuffer To Hex
 *
 * @alias module:AElf/pbUtils
 * @param {Buffer} arrayBuffer arrayBuffer
 * @return {string} hex string
 */
export const arrayBufferToHex = arrayBuffer =>
  Array.prototype.map.call(new Uint8Array(arrayBuffer), n => `0${n.toString(16)}`.slice(-2)).join('');

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
 * @return {protobuf.Message<{ value: string }>} address kernel.Address
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
 * @return {Object.<string, any>} address kernel.Address
 */
export const getAddressObjectFromRep = rep => Address.toObject(getAddressFromRep(rep));

/**
 * get hex rep From hash
 *
 * @alias module:AElf/pbUtils
 * @param {protobuf.Message<{ value: string }>} hash kernel.Hash
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
 * @return {protobuf.Message<{ value: string }>} kernel.Hash
 */
export const getHashFromHex = hex =>
  Hash.create({
    value: Buffer.from(hex.replace('0x', ''), 'hex')
  });

/**
 * get Hash Object From Hex
 *
 * @alias module:AElf/pbUtils
 * @param {string} hex string
 * @return {Object.<string, any>} kernel.Hash Hash ot Object
 */
export const getHashObjectFromHex = hex => Hash.toObject(getHashFromHex(hex));

/**
 * encode Transaction to protobuf type
 *
 * @alias module:AElf/pbUtils
 * @param {Object.<string, any>} tx object
 * @return {Uint8Array} kernel.Transaction
 */
export const encodeTransaction = tx => Transaction.encode(tx).finish();

/**
 * get Transaction
 *
 * @alias module:AElf/pbUtils
 * @param {TAddress} from
 * @param {TAddress} to
 * @param {string} methodName
 * @param {any} params
 * @return {protobuf.Message<{from: protobuf.Message<{ value: string }>;to: protobuf.Message<{ value: string }>;methodName: string;params: any;}>} kernel.Transaction
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
/**
 * Constructs a transaction with a chain ID.
 * @param {TAddress} from
 * @param {TAddress} to
 * @param {string} methodName
 * @param {any} params
 * @param {string} chainId - The chain ID.
 * @return {protobuf.Message<{from: protobuf.Message<{ value: string }>;to: protobuf.Message<{ value: string }>;methodName: string;params: any;chainId: string;}>} The transaction with chain ID.
 */
export const getTransactionAndChainId = (from, to, methodName, params, chainId) => {
  const txn = getTransaction(from, to, methodName, params);
  return {
    ...txn,
    chainId
  };
};
/**
 * Deserializes indexed and non-indexed log data.
 * @param {Array<string>} serializedData - The serialized log data.
 * @param {protobuf.Type} dataType - The protobuf type to deserialize into.
 * @return {Object.<string, any>} The deserialized log result.
 */
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
      oneofs: true // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = transform(dataType, deserializeLogResult, OUTPUT_TRANSFORMERS);
  deserializeLogResult = transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
};
/**
 * Deserializes logs using the provided services and root.
 * @param {Array<ILog>} logs - The logs to deserialize.
 * @param {Array<Object.<string, any>>} services - The services used for deserialization.
 * @param {protobuf.Root} Root - The protobuf root descriptor.
 * @return {Array<Object.<string, any>>} The deserialized log results.
 */
const deserializeWithServicesAndRoot = (logs, services, Root) => {
  // filter by address and name
  if (!logs || logs.length === 0) {
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
          message: 'This log is not supported.'
        };
      }
      // other method
      return deserializeIndexedAndNonIndexed(serializedData, dataType);
    }
  });
  return results;
};
/**
 * deserialize logs
 *
 * @alias module:AElf/pbUtils
 * @param {Array<ILog>} logs array of log which enclude Address,Name,Indexed and NonIndexed.
 * @param {Array<Object.<string, any>>} services array of service which got from getContractFileDescriptorSet
 * @return {Array<Object.<string, any>>} deserializeLogResult
 */
export const deserializeLog = (logs, services) => {
  const Root = protobuf.Root.fromJSON(VirtualTransactionDescriptor);
  return deserializeWithServicesAndRoot(logs, services, Root);
};
/* eslint-enable */
