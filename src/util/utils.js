/**
 * @file common utils
 * @author atom-yang
 */

import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
import { UNIT_MAP, UNSIGNED_256_INT } from '../common/constants';
import { Transaction } from './proto';
import { OUTPUT_TRANSFORMERS, encodeAddress, transform, transformArrayToMap } from './transform';
import sha256 from './sha256';
/**
 * @typedef {import('../../types/util/proto').TAddress} TAddress
 * @typedef {import('../../types/util/utils').IUnpackSpecifiedParams} IUnpackSpecifiedParams
 * @typedef {import('../../types/util/utils').ValidationObject} ValidationObject
 * @typedef {import('@aelfqueen/protobufjs/light')} protobuf
 */
export const base58 = {
  /**
   * Encodes data to Base58 format.
   * @param {ArrayBuffer | SharedArrayBuffer | string} data - The data to encode.
   * @param {string} [encoding='hex'] - The encoding of the input data.
   * @returns {string} The Base58 encoded string.
   * @throws {TypeError} If the data is not a Buffer.
   */

  encode(data, encoding = 'hex') {
    let result = data;
    if (typeof data === 'string') {
      result = Buffer.from(data, encoding);
    }
    if (!(result instanceof Buffer)) {
      throw new TypeError('"data" argument must be an Array of Buffers');
    }
    let hash = result;
    hash = Buffer.from(sha256(result), 'hex');
    hash = Buffer.from(sha256(hash), 'hex');
    hash = Buffer.from(result.toString('hex') + hash.slice(0, 4).toString('hex'), 'hex');
    return bs58.encode(hash);
  },
  /**
   * Decodes a Base58 encoded string.
   * @param {string} str - The Base58 encoded string.
   * @param {string} [encoding] - The encoding of the output data.
   * @returns {Buffer | ArrayBuffer | SharedArrayBuffer} The decoded data.
   * @throws {Error} If the checksum is invalid.
   */

  decode(str, encoding) {
    const buffer = Buffer.from(bs58.decode(str));
    let data = buffer.slice(0, -4);
    let hash = data;
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
};

export const chainIdConvertor = {
  /**
   * Converts a chain ID to a Base58 encoded string.
   * @param {string} chainId - The chain ID to convert.
   * @returns {string} The Base58 encoded string.
   */

  chainIdToBase58(chainId) {
    const bufferTemp = Buffer.alloc(4);
    bufferTemp.writeInt32LE(`0x${chainId.toString('16')}`, 0);
    const bytes = Buffer.concat([bufferTemp], 3);
    return bs58.encode(bytes);
  },
  /**
   * Converts a Base58 encoded string to a chain ID.
   * @param {string} base58String - The Base58 encoded string.
   * @returns {Buffer} The corresponding chain ID.
   */

  base58ToChainId(base58String) {
    return Buffer.concat([bs58.decode(base58String)], 4).readInt32LE(0);
  }
};

/**
 * Converts an ArrayBuffer to a hex string.
 * @param {ArrayBuffer} arrayBuffer - The input ArrayBuffer.
 * @returns {string} The hex representation.
 */

const arrayBufferToHex = arrayBuffer =>
  Array.prototype.map.call(new Uint8Array(arrayBuffer), n => `0${n.toString(16)}`.slice(-2)).join('');

/**
 * Converts various value types to hex.
 * @param {Buffer | ArrayBuffer} value - The value to convert.
 * @returns {string} The hex representation.
 */

export const arrayToHex = value => {
  let hex = '';
  if (value instanceof Buffer) {
    hex = value.toString('hex');
  } else {
    // Uint8Array
    hex = arrayBufferToHex(value);
  }
  return hex;
};

/**
 * Pads a string on the left to a specified length.
 * @param {string} string - The string to pad.
 * @param {number} charLen - The desired length of the padded string.
 * @param {string} [sign='0'] - The character to pad with.
 * @returns {string} The padded string.
 */
export const padLeft = (string, charLen, sign) => {
  const length = charLen - string.length + 1;
  return new Array(length < 0 ? 0 : length).join(sign || '0') + string;
};

/**
 * Pads a string on the right to a specified length.
 * @param {string} string - The string to pad.
 * @param {number} charLen - The desired length of the padded string.
 * @param {string} [sign='0'] - The character to pad with.
 * @returns {string} The padded string.
 */
export const padRight = (string, charLen, sign) => {
  const length = charLen - string.length + 1;
  return string + new Array(length < 0 ? 0 : length).join(sign || '0');
};

/**
 * Decodes an address representation to its hex representation.
 * @param {TAddress} address - The address to decode.
 * @returns {string} The hex representation of the address.
 */
export const decodeAddressRep = address => {
  if (address.indexOf('_') > -1) {
    const parts = address.split('_');
    const b58rep = parts[1];
    return base58.decode(b58rep, 'hex');
  }
  return base58.decode(address, 'hex');
};

/**
 * Encodes a hex representation to an address.
 * @param {string} hex - The hex representation.
 * @returns {string} The encoded address.
 */
export const encodeAddressRep = hex => {
  const buf = Buffer.from(hex.replace('0x', ''), 'hex');
  return base58.encode(buf, 'hex');
};

/**
 * Checks if the given object is an instance of BigNumber.
 * @param {number | string | BigNumber} object - The object to check.
 * @returns {boolean} True if the object is a BigNumber, otherwise false.
 */
export const isBigNumber = object =>
  object instanceof BigNumber || (object && object.constructor && object.constructor.name === 'BigNumber');

/**
 * Checks if the given object is a string.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is a string, otherwise false.
 */
export const isString = object =>
  typeof object === 'string' || (object && object.constructor && object.constructor.name === 'String');

/**
 * Checks if the given object is a function.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is a function, otherwise false.
 */
export const isFunction = object => typeof object === 'function';

/**
 * Checks if the given object is an object (not an array).
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an object, otherwise false.
 */
export const isObject = object => object !== null && !Array.isArray(object) && typeof object === 'object';

/**
 * Checks if the given object is a boolean.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is a boolean, otherwise false.
 */
export const isBoolean = object => typeof object === 'boolean';

/**
 * Checks if the given string is valid JSON.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is valid JSON, otherwise false.
 */
export const isJson = str => {
  try {
    return !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};

/**
 * Checks if the given value is a valid number.
 * @param {number} number - The value to check.
 * @returns {boolean} True if the value is a valid number, otherwise false.
 */
export const isNumber = number => number === +number;

/**
 * Converts an input to a BigNumber.
 * @param {number | string | BigNumber} number - The input value.
 * @returns {BigNumber} The BigNumber representation.
 */
export const toBigNumber = number => {
  const num = number || 0;
  if (isBigNumber(num)) {
    return num;
  }

  if (isString(num) && (num.indexOf('0x') === 0 || num.indexOf('-0x') === 0)) {
    return new BigNumber(num.replace('0x', ''), 16);
  }

  return new BigNumber(num.toString(10), 10);
};

/**
 * Returns the value of a unit in Wei.
 * @param {string} unit - The unit to convert to (default: 'ether').
 * @returns {BigNumber} The value of the unit in Wei.
 * @throws {Error} If the unit does not exist.
 */
export const getValueOfUnit = unit => {
  const unitValue = UNIT_MAP[unit ? unit.toLowerCase() : 'ether'];
  if (unitValue === undefined) {
    // eslint-disable-next-line max-len
    throw new Error(
      `This unit doesn\'t exists, please use the one of the following units ${JSON.stringify(UNIT_MAP, null, 2)}`
    );
  }
  return new BigNumber(unitValue, 10);
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 * @param {number | string} number - The number in Wei.
 * @param {string} unit - The unit to convert to.
 * @returns {string | BigNumber} The converted value.
 */
export const fromWei = (number, unit) => {
  const returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));

  return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 * @param {number | string | BigNumber} number - The number in the specified unit.
 * @param {string} unit - The unit to convert from.
 * @returns {string | BigNumber} The value in Wei.
 */
export const toWei = (number, unit) => {
  const returnValue = toBigNumber(number).times(getValueOfUnit(unit));

  return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes and input transforms it into bignumber and if it is negative value, into two's complement
 * bignumber.js get rid of round + floor in 6.0 https://github.com/MikeMcl/bignumber.js/issues/139
 * the method lessThan was named isLessThan after 6.0 https://github.com/MikeMcl/bignumber.js/issues/152
 * @method toTwosComplement
 * @param {number | string | BigNumber} number - The input number.
 * @returns {BigNumber} The two's complement representation.
 */
export const toTwosComplement = number => {
  const bigNumber = toBigNumber(number).integerValue();
  if (bigNumber.isLessThan(0)) {
    return new BigNumber(UNSIGNED_256_INT, 16).plus(bigNumber).plus(1);
  }
  return bigNumber;
};

/**
 * Converts a Uint8Array to its hex representation.
 * @param {Uint8Array} uint8Array - The input Uint8Array.
 * @returns {string} The hex representation.
 */
export const uint8ArrayToHex = uint8Array => {
  let string = '';
  uint8Array.forEach(item => {
    let hex = item.toString(16);
    if (hex.length <= 1) {
      hex = `0${hex}`;
    }
    string += hex;
  });
  return string;
};

export function byteStringToHex(byteString) {
  return Array.from(byteString)
    .map(byte => byte.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * empty function
 */
export const noop = () => {};

/**
 *
 * @param {object} obj The object to modify
 * @param {string} path The path of the property to set
 * @param {*} value The value to set
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * set(object, 'test.b.c', 4)
 * console.log(object.test.b.c)
 * // => 4
 */
export const setPath = (obj, path, value) => {
  const paths = path.split('.');
  paths.reduce((acc, p, index) => {
    if (index === paths.length - 1) {
      acc[p] = value;
      return acc;
    }
    acc[p] = {};
    return acc[p];
  }, obj);
};

/**
 * Unpacks specified type data from raw data.
 * @param {IUnpackSpecifiedParams} params - The parameters for unpacking.
 * @returns {Object.<string, any>} The unpacked data.
 */

export const unpackSpecifiedTypeData = ({ data, dataType, encoding = 'hex' }) => {
  const buffer = Buffer.from(data, encoding);
  const decoded = dataType.decode(buffer);
  const result = dataType.toObject(decoded, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true // includes virtual oneof fields set to the present field's name
  });
  return result;
};
/**
 * Deserializes a transaction from a raw transaction string.
 * @param {ArrayBuffer | SharedArrayBuffer} rawTx - The raw transaction data.
 * @param {protobuf.Type} paramsDataType - The data type for parameters.
 * @returns {Object.<string, any>} The deserialized transaction object.
 */
export function deserializeTransaction(rawTx, paramsDataType) {
  const { from, to, params, refBlockPrefix, signature, ...rest } = unpackSpecifiedTypeData({
    data: rawTx,
    dataType: Transaction
  });
  let methodParameters = unpackSpecifiedTypeData({
    data: params,
    encoding: 'base64',
    dataType: paramsDataType
  });
  methodParameters = transform(paramsDataType, methodParameters, OUTPUT_TRANSFORMERS);
  methodParameters = transformArrayToMap(paramsDataType, methodParameters);

  return {
    from: encodeAddress(from.value),
    to: encodeAddress(to.value),
    params: methodParameters,
    refBlockPrefix: Buffer.from(refBlockPrefix, 'base64').toString('hex'),
    signature: Buffer.from(signature, 'base64').toString('hex'),
    ...rest
  };
}
/**
 *
 * @param {string} userName Username
 * @param {string} password Password
 * @return {string} Authorization information
 *
 * const authorization = getAuthorization('test','pass')
 * console.log(authorization)
 * // => Basic dGVzdDpwYXNz
 */
export function getAuthorization(userName, password) {
  const base = Buffer.from(`${userName}:${password}`).toString('base64');
  return `Basic ${base}`;
}
/**
 *
 * Use rawTransaction to get transaction id
 * @param {string} rawTx rawTransaction
 * @return {string} string
 *
 * const txId = getTransactionId('0a220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd512220a2089ac786c8ad3b56f63a6f2767369a5273f801de2415b613c783cad3d148ce3ab18d5d3bb35220491cf6ba12a18537761704578616374546f6b656e73466f72546f6b656e73325008c0f7f27110bbe5947c1a09534752544553542d311a03454c4622220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd52a08088996ceb0061000320631323334353682f10441ec6ad50c4b210976ba0ba5c287ab6fabd0c444839e2505ecb1b5f52838095b290cb245ec1c97dade3bde6ac14c6892e526569e9b71240d3c120b1a6c8e41afba00');
 * console.log(txId);
 * // => cf564f3169012cb173efcf5543b2a71b030b16fad3ddefe3e04a5c1e1bc0047d
 */
export function getTransactionId(rawTx) {
  const hash = Buffer.from(rawTx.replace('0x', ''), 'hex');
  const decode = Transaction.decode(hash);
  decode.signature = null;
  const encode = Transaction.encode(decode).finish();
  return sha256(encode);
}
/**
 * Validates an object to ensure it has exactly two entries,
 * and that each entry contains the properties `chainUrl` and `contractAddress`.
 *
 * @param {Record<string, ValidationObject>} obj - The object to validate.
 * @returns {boolean} - Returns true if the object has exactly two entries
 * and each entry contains `chainUrl` and `contractAddress`, otherwise false.
 */
export function validateMulti(obj) {
  if (Object.keys(obj).length !== 2) {
    return false;
  }

  // check if every item has chainUrl and contractAddress
  return Object.values(obj).every(
    value =>
      // eslint-disable-next-line operator-linebreak
      Object.prototype.hasOwnProperty.call(value, 'chainUrl') &&
      Object.prototype.hasOwnProperty.call(value, 'contractAddress')
  );
}
