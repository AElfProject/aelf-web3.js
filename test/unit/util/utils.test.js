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
  getTransactionId
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
  test('test getTransactionId', () => {
    const txId = getTransactionId(
      '0a220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd512220a2089ac786c8ad3b56f63a6f2767369a5273f801de2415b613c783cad3d148ce3ab18d5d3bb35220491cf6ba12a18537761704578616374546f6b656e73466f72546f6b656e73325008c0f7f27110bbe5947c1a09534752544553542d311a03454c4622220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd52a08088996ceb0061000320631323334353682f10441ec6ad50c4b210976ba0ba5c287ab6fabd0c444839e2505ecb1b5f52838095b290cb245ec1c97dade3bde6ac14c6892e526569e9b71240d3c120b1a6c8e41afba00'
    );
    expect(txId).toEqual('cf564f3169012cb173efcf5543b2a71b030b16fad3ddefe3e04a5c1e1bc0047d');
  });
});
