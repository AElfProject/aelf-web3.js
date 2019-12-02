import {
  inputAddressFormatter
} from '../../../src/util/formatters';

describe('test formatter', () => {
  test('test input address formatter', () => {
    expect(inputAddressFormatter('ELF_rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v_AElf')).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
    expect(() => inputAddressFormatter('ELF_test_AElf')).toThrow();
    expect(inputAddressFormatter('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v')).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
    expect(inputAddressFormatter('ELF_rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v')).toBe('rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v');
  });
});
