import ContractMethod from '../../../src/contract/contractMethod';
import ContractFactory from '../../../src/contract/index';
import AElf from '../../../src/index';
const stageEndpoint = 'https://tdvw-test-node.aelf.io/';

// CHAIN_MAP = {
//   AELF: 9992731,
//   tDVV: 1866392,
//   tDVW: 1931928
// };

describe('multi transaction', () => {
  const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
  const wallet = AElf.wallet.getWalletByPrivateKey('943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096');
  const chain = aelf.chain;
  const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true
  });
  const factory = new ContractFactory(chain, fds, wallet);
  const method = factory.services[2].methods['Transfer'].resolve();
  const contractMethod = new ContractMethod(chain, method, address, wallet, {
    multi: {
      9992731: {
        chainUrl: 'https://aelf-test-node.aelf.io/',
        contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE'
      },
      1931928: {
        chainUrl: 'https://tdvw-test-node.aelf.io/',
        contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
      }
    },
    gatewayUrl: 'https://gateway-test.aelf.io'
  });
  test('test handle transaction', async () => {
    const chainStatus = await chain.getChainStatus();
    const results = contractMethod.handleMultiTransaction(chainStatus?.BestChainHeight, chainStatus?.BestChainHash, {
      9992731: {
        symbol: 'ELF',
        amount: '100000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      },
      1931928: {
        symbol: 'ELF',
        amount: '150000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      }
    });
    expect(typeof results).toBe('string');
  });
  test('send multi transaction to gateway', async () => {
    const expectedKeys = ['1931928', '9992731'];
    const result = await contractMethod.sendMultiTransactionToGateway({
      9992731: {
        symbol: 'ELF',
        amount: '100000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      },
      1931928: {
        symbol: 'ELF',
        amount: '150000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      }
    });
    expect(Object.keys(result)).toEqual(expectedKeys);
    expectedKeys.forEach(key => {
      expect(Array.isArray(result[key])).toBe(true);
      result[key].forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});
