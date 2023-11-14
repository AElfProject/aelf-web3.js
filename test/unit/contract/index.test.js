import ContractFactory from '../../../src/contract/index';
const stageEndpoint = 'https://tdvw-test-node.aelf.io';
import AElf from '../../../src/index';
describe('contract factory', () => {
  const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
  const chain = aelf.chain;
  const address = 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true,
  });
  const factory = new ContractFactory(chain, fds, AElf.wallet);
  test('constrcutor', () => {
    expect(factory.chain).toEqual(chain);
    expect(factory.services.length).toEqual(1);
    expect(factory.services[0].name).toEqual('BingoGameContract');
    expect(factory.wallet).toEqual(AElf.wallet);
  });
  test('test contract instance', () => {
    const contractInstance = factory.at(address);
    expect(contractInstance).toHaveProperty('_chain');
    expect(contractInstance).toHaveProperty('address', address);
    expect(contractInstance).toHaveProperty('services');
    expect(contractInstance).toHaveProperty('Register');
    expect(contractInstance).toHaveProperty('Play');
    expect(contractInstance).toHaveProperty('Bingo');
    expect(contractInstance).toHaveProperty('Quit');
    expect(contractInstance).toHaveProperty('GetAward');
    expect(contractInstance).toHaveProperty('GetPlayerInformation');
    expect(contractInstance.deserializeLog).toBeInstanceOf(Function);
  });
  test('test deserialize log', () => {
    const Logs = [
      {
        Address: 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW',
        Name: '.aelf.Hash',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    const contractInstance = factory.at(address);
    const result = contractInstance.deserializeLog(Logs, '.aelf.Hash');
    expect(result).toEqual(['454c46']);
    expect(contractInstance.deserializeLog()).toEqual([]);
  });
  test('test deserialize log with empty logs', () => {
    const contractInstance = factory.at(address);
    const result = contractInstance.deserializeLog();
    expect(result).toEqual([]);
  });
  test('test deserialize log with empty NonIndexed', () => {
    const Logs = [
      {
        Indexed: [
          'CiIKIPoq3y6L7T71F5BynCBXISeMFKrCt4QayljkLE4U8St4',
          'EiIKIKt0P1P3+jKuU4Y5rSGOfzleHFw0YXn5eNM88jWfUWYR',
        ],
        Name: '.aelf.Hash',
        Address: 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW',
      },
    ];
    const contractInstance = factory.at(address);
    const result = contractInstance.deserializeLog(Logs, '.aelf.Hash');
    expect(result).toEqual([
      '0a20fa2adf2e8bed3ef51790729c205721278c14aac2b7841aca58e42c4e14f12b78',
    ]);
  });
});
