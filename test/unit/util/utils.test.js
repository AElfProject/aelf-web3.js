import BigNumber from 'bignumber.js';

import {
  padLeft,
  base58,
  chainIdConvertor,
  decodeAddressRep,
  encodeAddressRep,
  isBigNumber,
  isString,
  isFunction,
  isObject,
  isBoolean,
  isJson,
  toBigNumber,
  uint8ArrayToHex,
  setPath,
} from '../../../src/util/utils';

describe('test utils', () => {
  test('test padLeft', () => {
    expect(padLeft('123', 2, '0')).toBe('123');
    expect(padLeft('123', 5, '1')).toBe('11123');
  });

  test('test base58 decode and encode', () => {
    expect(base58.encode('18138372fad4', 'hex')).toBe('2MTJUAViVu6ctF');
    expect(base58.decode('2MTJUAViVu6ctF', 'hex')).toBe('18138372fad4');
    expect(() => base58.encode(null, 'hex')).toThrow(
      '"data" argument must be an Array of Buffers'
    );
    expect(base58.encode('qwe123', 'utf8')).toBe('7NjemqtmHiYjxe');
    expect(base58.decode('7NjemqtmHiYjxe', 'utf8')).toBe('qwe123');
  });

  test('test chainId convertor chainIdToBase58 and base58ToChainId', () => {
    expect(chainIdConvertor.chainIdToBase58('123456')).toBe('VxNu');
    expect(chainIdConvertor.base58ToChainId('VxNu').toString(16)).toBe(
      '123456'
    );
  });

  test('decode and encode address hex represent', () => {
    /* eslint-disable max-len */
    expect(
      decodeAddressRep('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v')
    ).toBe('70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119');
    expect(
      encodeAddressRep(
        '70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119'
      )
    ).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
    expect(
      encodeAddressRep(
        '0x70fb1d6779d84f718966eb0558619bd70a2b56fe8f74d60737d1efabb701c119'
      )
    ).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
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

  test('uint array into hex string', () => {
    expect(uint8ArrayToHex(new Uint8Array([1, 2, 3]))).toBe('010203');
  });

  test('set path in dot way', () => {
    const testSetPath = {};
    setPath(testSetPath, 'aa.bb.cc', 'test');
    expect(testSetPath).toEqual({
      aa: {
        bb: {
          cc: 'test',
        },
      },
    });
    setPath(testSetPath, 'test.est.aaaa', {
      inner: {},
    });
    expect(testSetPath).toEqual({
      aa: {
        bb: {
          cc: 'test',
        },
      },
      test: {
        est: {
          aaaa: {
            inner: {},
          },
        },
      },
    });
  });
});
