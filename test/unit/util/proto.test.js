import {
  getFee,
  getResourceFee,
  getTransactionFee
} from '../../../src/util/proto';

describe('test proto', () => {
  test('deserialize fee', () => {
    const Logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'TransactionFeeCharged',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ=='
      }
    ];
    expect(getTransactionFee(Logs).length).toEqual(1);
    expect(getFee('CgNFTEYQoI/hGQ==', 'TransactionFeeCharged')).toEqual(getTransactionFee(Logs)[0]);
    expect(getResourceFee(Logs).length).toEqual(0);
    expect(() => getFee('CgNFTEYQoI/hGQ==', 'ResourceToken')).toThrow();
  })
});
