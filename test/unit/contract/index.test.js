import ContractFactory from '../../../src/contract/index';
import AElf from '../../../src/index';
import { tdvwEndPoint } from '../constant';
describe('contract factory', () => {
  const aelf = new AElf(new AElf.providers.HttpProvider(tdvwEndPoint));
  const chain = aelf.chain;
  const address = 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true
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
        NonIndexed: 'CgNFTEYQoI/hGQ=='
      }
    ];
    const contractInstance = factory.at(address);
    const result = contractInstance.deserializeLog(Logs, '.aelf.Hash');
    expect(result).toEqual(['454c46']);
    expect(contractInstance.deserializeLog()).toEqual([]);
  });
  test('test deserialize log with VirtualTransactionCreated', () => {
    const Logs = [
      {
        Address: '238X6iw1j8YKcHvkDYVtYVbuYk2gJnK8UoNpVCtssynSpVC8hb',
        Name: 'VirtualTransactionCreated',
        Indexed: [
          'CiIKIA8J04pLJGNHl4y2KWuBJipdXjtJ2ForrSRRuRx9w2LY',
          'EiIKIAR/b9iJa/+kT2+h9XAdQE0UX9wFZogfPtn9YvtlCnB2',
          'GiIKICeR6ZKlfyjnWhHxOvLArsiw6zXS8EjULrqJAckuA3jc',
          'IghUcmFuc2Zlcg==',
          'MiIKICWmXUMWhKDuXFdYz8/uF7ze4kC5r3i7boxM5Dj+RE4G'
        ],
        NonIndexed: 'KjAKIgogIKCTibOwFJNFp0zUNEXymkyazYKz8LLwLqOZxEqKRF0SA09NSRiA0NvD9AI='
      }
    ];
    const contractInstance = factory.at('238X6iw1j8YKcHvkDYVtYVbuYk2gJnK8UoNpVCtssynSpVC8hb');
    const result = contractInstance.deserializeLog(Logs, 'VirtualTransactionCreated');
    expect(result).toEqual([
      {
        from: '2ytdtA2PDX7VLYWkqf36MQQ8wUtcXWRdpovX7Wxy8tJZXumaY',
        methodName: 'Transfer',
        params: 'CiIKICCgk4mzsBSTRadM1DRF8ppMms2Cs/Cy8C6jmcRKikRdEgNPTUkYgNDbw/QC',
        signatory: 'HaiUnezHpBieiVZNuyQV4uLFspYDGxsEwt8wSFYqGSpXY3CzJ',
        to: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        virtualHash: '0f09d38a4b246347978cb6296b81262a5d5e3b49d85a2bad2451b91c7dc362d8'
      }
    ]);
    expect(contractInstance.deserializeLog()).toEqual([]);
  });
  test('test deserialize log with normal contract which has a method called VirtualTransactionCreated', () => {
    const Logs = [
      {
        Address: 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW',
        Name: 'VirtualTransactionCreated',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ=='
      }
    ];
    const contractInstance = factory.at(address);
    expect(() => contractInstance.deserializeLog(Logs, 'VirtualTransactionCreated')).toThrow();
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
          'EiIKIKt0P1P3+jKuU4Y5rSGOfzleHFw0YXn5eNM88jWfUWYR'
        ],
        Name: '.aelf.Hash',
        Address: 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW'
      }
    ];
    const contractInstance = factory.at(address);
    const result = contractInstance.deserializeLog(Logs, '.aelf.Hash');
    expect(result).toEqual(['0a20fa2adf2e8bed3ef51790729c205721278c14aac2b7841aca58e42c4e14f12b78']);
  });
});
