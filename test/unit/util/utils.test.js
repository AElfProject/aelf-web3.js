import BigNumber from 'bignumber.js';

import {
  padLeft,
  padRight,
  base58,
  chainIdConvertor,
  arrayToHex,
  decodeAddressRep,
  encodeAddressRep,
  isBigNumber,
  isString,
  isFunction,
  isObject,
  isBoolean,
  isJson,
  toBigNumber,
  getValueOfUnit,
  fromWei,
  toWei,
  toTwosComplement,
  uint8ArrayToHex,
  setPath,
  deserializeTransaction,
  getTransactionId,
  getAuthorization,
  validateMulti,
  byteStringToHex,
  noop,
  unpackSpecifiedTypeData,
} from '../../../src/util/utils';

describe('test utils', () => {
  test('test padLeft', () => {
    expect(padLeft('123', 2, '0')).toBe('123');
    expect(padLeft('123', 5, '1')).toBe('11123');
    expect(padLeft('123', -1)).toBe('123');
  });
  test('test padRight', () => {
    expect(padRight('123', 2, '0')).toBe('123');
    expect(padRight('123', 5, '1')).toBe('12311');
    expect(padRight('123', -1)).toBe('123');
  });

  test('test base58 decode and encode', () => {
    expect(base58.encode('18138372fad4', 'hex')).toBe('2MTJUAViVu6ctF');
    expect(base58.decode('2MTJUAViVu6ctF', 'hex')).toBe('18138372fad4');
    expect(base58.decode('2MTJUAViVu6ctF')).toBeInstanceOf(Buffer);
    expect(base58.decode('2MTJUAViVu6ctF').toString('hex')).toBe('18138372fad4');
    expect(() => base58.encode(null, 'hex')).toThrow('"data" argument must be an Array of Buffers');
    expect(base58.encode('qwe123', 'utf8')).toBe('7NjemqtmHiYjxe');
    expect(base58.decode('7NjemqtmHiYjxe', 'utf8')).toBe('qwe123');
    expect(() => base58.decode('2MTJUAViVu6ctF')).not.toThrow();
    expect(() => base58.decode('2MTJUAViVu6ctG')).toThrow('Invalid checksum');
  });

  test('test chainId convertor chainIdToBase58 and base58ToChainId', () => {
    expect(chainIdConvertor.chainIdToBase58('123456')).toBe('VxNu');
    expect(chainIdConvertor.base58ToChainId('VxNu').toString(16)).toBe('123456');
  });

  test('test array to hex', () => {
    let str = 'hello world';
    let buffer = Buffer.from(str);
    expect(arrayToHex(buffer)).toBe('68656c6c6f20776f726c64');
    let arrayBuffer = new ArrayBuffer(4);
    let view = new Uint32Array(arrayBuffer);
    view[0] = 12;
    expect(arrayToHex(arrayBuffer)).toBe('0c000000');
  });

  test('decode and encode address hex represent', () => {
    /* eslint-disable max-len */
    expect(decodeAddressRep('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v')).toBe(
      '70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119'
    );
    expect(encodeAddressRep('70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119')).toBe(
      'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v'
    );
    expect(encodeAddressRep('0x70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119')).toBe(
      'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v'
    );
  });

  test('is bigNumBer', () => {
    expect(isBigNumber(1231)).toBeFalsy();
    expect(isBigNumber(new BigNumber(1231))).toBeTruthy();
    expect(isBigNumber(null)).toBeFalsy();
    expect(isBigNumber(undefined)).toBeFalsy();
  });

  test('is string', () => {
    expect(isString(1231)).toBeFalsy();
    expect(isString('2131')).toBeTruthy();
    expect(isString(String(null))).toBeTruthy();
    expect(isString('undefined')).toBeTruthy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(null)).toBeFalsy();
  });

  test('is function', () => {
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction(console.log)).toBeTruthy();
    // eslint-disable-next-line no-new-func
    expect(isFunction(new Function())).toBeTruthy();
    expect(isFunction(null)).toBeFalsy();
  });

  test('is object', () => {
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject({})).toBeTruthy();
    expect(isObject(new Array(1))).toBeFalsy();
    expect(isObject(new Set())).toBeTruthy();
  });

  test('is boolean', () => {
    expect(isBoolean(null)).toBeFalsy();
    expect(isBoolean(undefined)).toBeFalsy();
    expect(isBoolean(0)).toBeFalsy();
    expect(isBoolean(false)).toBeTruthy();
    expect(isBoolean(true)).toBeTruthy();
  });

  test('is JSON', () => {
    expect(isJson({})).toBeFalsy();
    expect(isJson('{}')).toBeTruthy();
    expect(isJson('{{')).toBeFalsy();
    expect(isJson(undefined)).toBeFalsy();
    expect(isJson(null)).toBeFalsy();
  });

  test('transform into bigNumber', () => {
    expect(toBigNumber(1)).toStrictEqual(new BigNumber(1));
    expect(toBigNumber('0x1')).toStrictEqual(new BigNumber(1));
    expect(toBigNumber(new BigNumber(1213))).toStrictEqual(new BigNumber(1213));
    expect(toBigNumber(undefined)).toStrictEqual(new BigNumber(0));
  });

  test('convert to the unit', () => {
    expect(getValueOfUnit('wei')).toStrictEqual(new BigNumber(1));
    expect(getValueOfUnit()).toStrictEqual(new BigNumber(1000000000000000000));
    expect(() => getValueOfUnit('test')).toThrow();
  });
  test('takes a number of wei and converts it to any other ether unit, takes a number of a unit and converts it to wei', () => {
    expect(fromWei(100000, 'Kwei')).toBe('100');
    expect(toWei(100, 'Kwei')).toBe('100000');
    expect(fromWei(new BigNumber(1000000000000000000), 'Kwei')).toEqual(new BigNumber(1000000000000000));
    expect(toWei(new BigNumber(1000000000000000), 'Kwei')).toEqual(new BigNumber(1000000000000000000));
  });

  test('uint array into hex string', () => {
    expect(uint8ArrayToHex(new Uint8Array([1, 2, 3]))).toBe('010203');
    expect(uint8ArrayToHex(new Uint8Array([17, 27, 37]))).toBe('111b25');
  });

  test('set path in dot way', () => {
    const testSetPath = {};
    setPath(testSetPath, 'aa.bb.cc', 'test');
    expect(testSetPath).toEqual({
      aa: {
        bb: {
          cc: 'test'
        }
      }
    });
    setPath(testSetPath, 'test.est.aaaa', {
      inner: {}
    });
    expect(testSetPath).toEqual({
      aa: {
        bb: {
          cc: 'test'
        }
      },
      test: {
        est: {
          aaaa: {
            inner: {}
          }
        }
      }
    });
  });
  test('converts a negative numer into a two’s complement.', () => {
    expect(toTwosComplement('-1')).toEqual(
      new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    );
    expect(toTwosComplement(-1)).toEqual(
      new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    );
    expect(toTwosComplement('0x1')).toEqual(
      new BigNumber('0x0000000000000000000000000000000000000000000000000000000000000001')
    );
    expect(toTwosComplement(new BigNumber(-15))).toEqual(
      new BigNumber('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1')
    );
  });

  test('test deprecated deserializeTransaction function', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    deserializeTransaction('rawTx', 'paramsDataType');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'deprecated method (>=3.5.0),\n    please use use utils/transaction.js deserializeTransaction'
    );
    
    consoleSpy.mockRestore();
  });

  test('test deprecated getTransactionId function', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    getTransactionId('rawTx');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'deprecated method (>=3.5.0),\n    please use utils/transaction.js getTransactionId'
    );
    
    consoleSpy.mockRestore();
  });

  test('test getAuthorization function', () => {
    const result = getAuthorization('test', 'pass');
    expect(result).toBe('Basic dGVzdDpwYXNz');
    
    const result2 = getAuthorization('user', 'password');
    expect(result2).toBe('Basic dXNlcjpwYXNzd29yZA==');
  });

  test('test validateMulti function', () => {
    const validObj = {
      chain1: { chainUrl: 'http://test1.com', contractAddress: '0x123' },
      chain2: { chainUrl: 'http://test2.com', contractAddress: '0x456' }
    };
    expect(validateMulti(validObj)).toBe(true);
    
    const invalidObj1 = {
      chain1: { chainUrl: 'http://test1.com', contractAddress: '0x123' }
    };
    expect(validateMulti(invalidObj1)).toBe(false);
    
    const invalidObj2 = {
      chain1: { chainUrl: 'http://test1.com', contractAddress: '0x123' },
      chain2: { chainUrl: 'http://test2.com', contractAddress: '0x456' },
      chain3: { chainUrl: 'http://test3.com', contractAddress: '0x789' }
    };
    expect(validateMulti(invalidObj2)).toBe(false);
    
    const invalidObj3 = {
      chain1: { chainUrl: 'http://test1.com' },
      chain2: { chainUrl: 'http://test2.com', contractAddress: '0x456' }
    };
    expect(validateMulti(invalidObj3)).toBe(false);
  });

  test('test byteStringToHex function', () => {
    const result = byteStringToHex('hello');
    expect(result).toBe('68656c6c6f');
    
    const result2 = byteStringToHex('test');
    expect(result2).toBe('74657374');
    
    const result3 = byteStringToHex('');
    expect(result3).toBe('');
  });

  test('test noop function', () => {
    expect(noop()).toBeUndefined();
    expect(typeof noop).toBe('function');
  });

  test('test unpackSpecifiedTypeData function', () => {
    // Mock dataType with decode and toObject methods
    const mockDataType = {
      decode: vi.fn().mockReturnValue({ mockDecoded: true }),
      toObject: vi.fn().mockReturnValue({ mockObject: true })
    };
    
    const result = unpackSpecifiedTypeData({
      data: 'testdata',
      dataType: mockDataType,
      encoding: 'utf8'
    });
    
    expect(mockDataType.decode).toHaveBeenCalledWith(Buffer.from('testdata', 'utf8'));
    expect(mockDataType.toObject).toHaveBeenCalledWith(
      { mockDecoded: true },
      {
        enums: String,
        longs: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: true
      }
    );
    expect(result).toEqual({ mockObject: true });
    
    // Test with default encoding
    const result2 = unpackSpecifiedTypeData({
      data: 'testdata',
      dataType: mockDataType
    });
    
    expect(mockDataType.decode).toHaveBeenCalledWith(Buffer.from('testdata', 'hex'));
  });
});
