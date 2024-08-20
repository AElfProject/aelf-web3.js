import AElf from '../../src/index';
import { aelfEndPoint, tdvwEndPoint } from './constant';

describe('test AElf', () => {
  test('test AElf is connected', () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(tdvwEndPoint));
    const result = aelf.isConnected();
    expect(result).toBeTruthy();
  });
  test('test AElf set provider', () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(aelfEndPoint));
    aelf.setProvider(new AElf.providers.HttpProvider(tdvwEndPoint));
    expect(aelf.currentProvider.host).toEqual(tdvwEndPoint);
  });
});
