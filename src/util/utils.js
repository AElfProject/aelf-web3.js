/**
 * @file common utils
 * @author atom-yang
 */

import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
import { UNIT_MAP, UNSIGNED_256_INT } from '../common/constants';
import { Transaction } from './proto';
import {
  OUTPUT_TRANSFORMERS,
  encodeAddress,
  transform,
  transformArrayToMap
} from './transform';
import sha256 from './sha256';


export const base58 = {
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
  // chainIdToBase58 (int32 chainId)
  chainIdToBase58(chainId) {
    const bufferTemp = Buffer.alloc(4);
    bufferTemp.writeInt32LE(`0x${chainId.toString('16')}`, 0);
    const bytes = Buffer.concat([bufferTemp], 3);
    return bs58.encode(bytes);
  },
  base58ToChainId(base58String) {
    return Buffer.concat([bs58.decode(base58String)], 4).readInt32LE(0);
  }
};

const arrayBufferToHex = arrayBuffer => Array.prototype.map.call(
  new Uint8Array(arrayBuffer),
  n => (`0${n.toString(16)}`).slice(-2)
).join('');

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
 * Should be called to pad string to expected length
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} charLen that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
export const padLeft = (string, charLen, sign) => {
  const length = charLen - string.length + 1;
  return new Array(length < 0 ? 0 : length).join(sign || '0') + string;
};

/**
 * Should be called to pad string to expected length
 *
 * @method padRight
 * @param {String} string to be padded
 * @param {Number} charLen that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
export const padRight = (string, charLen, sign) => {
  const length = charLen - string.length + 1;
  return string + (new Array(length < 0 ? 0 : length).join(sign || '0'));
};


/**
 * Returns a hex rep from the encoded address
 *
 * @method decodeAddressRep
 * @param {String} address
 * @return {String}
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
 * Returns a encoded address from the hex rep
 *
 * @method encodeAddressRep
 * @param {String} hex
 * @return {String}
 */
export const encodeAddressRep = hex => {
  const buf = Buffer.from(hex.replace('0x', ''), 'hex');
  return base58.encode(buf, 'hex');
};

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object} object
 * @return {Boolean}
 */
export const isBigNumber = object => object instanceof BigNumber
  || (object && object.constructor && object.constructor.name === 'BigNumber');

/**
 * Returns true if object is string, otherwise false
 *
 * @method isString
 * @param {Object} object
 * @return {Boolean}
 */
export const isString = object => typeof object === 'string'
    || (object && object.constructor && object.constructor.name === 'String');

/**
 * Returns true if object is function, otherwise false
 *
 * @method isFunction
 * @param {Object} object
 * @return {Boolean}
 */
export const isFunction = object => typeof object === 'function';

/**
 * Returns true if object is Object, otherwise false
 *
 * @method isObject
 * @param {Object} object
 * @return {Boolean}
 */
export const isObject = object => object !== null && !(Array.isArray(object)) && typeof object === 'object';

/**
 * Returns true if object is boolean, otherwise false
 *
 * @method isBoolean
 * @param {Object} object
 * @return {Boolean}
 */
export const isBoolean = object => typeof object === 'boolean';

/**
 * Returns true if given string is valid json object
 *
 * @method isJson
 * @param {String} str
 * @return {Boolean}
 */
export const isJson = str => {
  try {
    return !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if given number is valid number
 *
 * @method isNumber
 * @param {Number} number
 * @return {Boolean}
 */
export const isNumber = number => number === +number;

/**
 * Takes an input and transforms it into an bignumber
 *
 * @method toBigNumber
 * @param {Number|String|BigNumber} number, a number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
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
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
export const getValueOfUnit = unit => {
  const unitValue = UNIT_MAP[unit ? unit.toLowerCase() : 'ether'];
  if (unitValue === undefined) {
    // eslint-disable-next-line max-len
    throw new Error(`This unit doesn\'t exists, please use the one of the following units ${JSON.stringify(UNIT_MAP, null, 2)}`);
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
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
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
 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
export const toWei = (number, unit) => {
  const returnValue = toBigNumber(number).times(getValueOfUnit(unit));

  return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes and input transforms it into bignumber and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BigNumber} number
 * @return {BigNumber}
 */
export const toTwosComplement = number => {
  const bigNumber = toBigNumber(number).round();
  if (bigNumber.lessThan(0)) {
    return new BigNumber(UNSIGNED_256_INT, 16)
      .plus(bigNumber).plus(1);
  }
  return bigNumber;
};


/**
 * Returns hex
 *
 * @method uint8ArrayToHex
 * @param {Array} uint8Array
 * @return {String}
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

export const unpackSpecifiedTypeData = ({ data, dataType, encoding = 'hex' }) => {
  const buffer = Buffer.from(data, encoding || 'hex');
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

export function deserializeTransaction(rawTx, paramsDataType) {
  const {
    from,
    to,
    params,
    refBlockPrefix,
    signature,
    ...rest
  } = unpackSpecifiedTypeData({
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
 * @param {String} userName Username
 * @param {String} password Password
 * @return {any} Authorization information
 *
 * const authorization = getAuthorization('test','pass')
 * console.log(authorization)
 * // => Basic dGVzdDpwYXNz
 */
export function getAuthorization(userName, password) {
  const base = Buffer.from(`${userName}:${password}`).toString('base64');
  return `Basic ${base}`;
}

// /**
//  * Converts value to it's hex representation
//  *
//  * @method fromDecimal
//  * @param {String|Number|BigNumber}
//  * @return {String}
//  */
// export const fromDecimal = value => {
//   const number = toBigNumber(value);
//   const result = number.toString(16);
//
//   return number.lessThan(0) ? `-0x${result.substr(1)}` : `0x${result}`;
// };
//
// /**
//  * Should be called to get hex representation (prefixed by 0x) of utf8 string
//  *
//  * @method fromUtf8
//  * @param {String} string
//  * @param {Boolean} allowZero to convert code point zero to 00 instead of end of string
//  * @returns {String} hex representation of input string
//  */
// export const fromUtf8 = (str, allowZero) => {
//   const encodeStr = utf8.encode(str);
//   let hex = '';
//   for (let i = 0; i < encodeStr.length; i++) {
//     const code = encodeStr.charCodeAt(i);
//     if (code === 0) {
//       if (allowZero) {
//         hex += '00';
//       } else {
//         break;
//       }
//     } else {
//       const n = code.toString(16);
//       hex += n.length < 2 ? `0${n}` : n;
//     }
//   }
//   return `0x${hex}`;
// };
