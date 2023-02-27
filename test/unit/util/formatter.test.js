import {
  inputAddressFormatter,
  outputFileDescriptorSetFormatter,
} from '../../../src/util/formatters';
const gbk = require('gbk-string');

describe('test formatter', () => {
  test('test input address formatter', () => {
    expect(
      inputAddressFormatter(
        'ELF_rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v_AElf'
      )
    ).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
    expect(() => inputAddressFormatter('ELF_test_AElf')).toThrow();
    expect(
      inputAddressFormatter('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v')
    ).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
    expect(
      inputAddressFormatter(
        'ELF_rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v'
      )
    ).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
  });
  test('test output file descriptor set formatter', () => {
    const name = outputFileDescriptorSetFormatter(
      'CiIKIB7Dg+4T7eLv5hCby8b4g2IL6nkg/EerfNaAfWgby3SR'
    ).file[0].name;
    const str = gbk.encodeGBK(name);
    expect(str).toBe(
      '%1E%3F%3F%13%3F%3F%3F%3F%10%3F%3F%3F%3F%3Fb%B%3Fy%20%3FG%3F%7C%3F%7Dh%1B%3Ft%3F'
    );
  });
});
