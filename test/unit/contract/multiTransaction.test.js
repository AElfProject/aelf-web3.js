import { CHAIN_MAP } from '../../../src/common/constants';
import ContractMethod from '../../../src/contract/contractMethod';
import ContractFactory from '../../../src/contract/index';
import AElf from '../../../src/index';
const stageEndpoint = 'https://tdvw-test-node.aelf.io/';
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
      AELF: {
        chainUrl: 'https://aelf-test-node.aelf.io/',
        contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE'
      },
      tDVW: {
        chainUrl: 'https://tdvw-test-node.aelf.io/',
        contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
      }
    },
    gatewayUrl: 'https://gateway-test.aelf.io'
  });
  test('test handle transaction', async () => {
    const chainStatus = await chain.getChainStatus();
    const results = contractMethod.handleMultiTransaction(chainStatus?.BestChainHeight, chainStatus?.BestChainHash, {
      AELF: {
        symbol: 'ELF',
        amount: '100000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      },
      tDVW: {
        symbol: 'ELF',
        amount: '150000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      }
    });
    expect(typeof results).toBe('string');
  });
  test('send multi transaction to gateway', async () => {
    const expectedKeys = [CHAIN_MAP['tDVW'].toString(), CHAIN_MAP['AELF'].toString()];
    const result = await contractMethod.sendMultiTransactionToGateway({
      AELF: {
        symbol: 'ELF',
        amount: '100000000',
        to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
      },
      tDVW: {
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
