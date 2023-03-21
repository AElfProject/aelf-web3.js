import ContractMethod from '../../../src/contract/ContractMethod';
import ContractFactory from '../../../src/contract/index';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/chain';
import AElf from '../../../src/index';
import { Transaction } from '../../../src/util/proto';

describe('contract method', () => {
  let aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
  const chain = aelf.chain;
  const address = 'ELF_2sGZFRtqQ57F55Z2KvhmoozKrf7ik2htNVQawEAo3Vyvcx9Qwr_tDVW';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true,
  });
  const factory = new ContractFactory(chain, fds, AElf.wallet);
  test('constructor', () => {
    console.log(factory.services, 'xxx');
    const method = factory.services[0].methods['Register'].resolve();
    const contractMethod = new ContractMethod(
      chain,
      method,
      address,
      AElf.wallet
    );
    expect(contractMethod).toHaveProperty('_chain');
    expect(contractMethod).toHaveProperty('_method');
    expect(contractMethod).toHaveProperty('_inputType');
    expect(contractMethod).toHaveProperty('_outputType');
    expect(contractMethod).toHaveProperty('_name', 'Register');
    expect(contractMethod).toHaveProperty('_contractAddress', address);
    expect(contractMethod).toHaveProperty('sendTransaction');
    expect(contractMethod).toHaveProperty('unpackPackedInput');
    expect(contractMethod).toHaveProperty('packInput');
    expect(contractMethod).toHaveProperty('unpackOutput');
    expect(contractMethod).toHaveProperty('bindMethodToContract');
    expect(contractMethod).toHaveProperty('run');
    expect(contractMethod).toHaveProperty('request');
    expect(contractMethod).toHaveProperty('callReadOnly');
    expect(contractMethod).toHaveProperty('getSignedTx');
    expect(contractMethod).toHaveProperty('getRawTx');
  });
  test('test pack input', () => {
    const method = factory.services[0].methods['GetAward'].resolve();
    const contractMethod = new ContractMethod(
      chain,
      method,
      address,
      AElf.wallet
    );
    const result = contractMethod.packInput(
      '0a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb2754682'
    );
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString('hex')).toBe(
      '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb2754682'
    );
    expect(contractMethod.packInput()).toEqual(null);
  });
  test('test unpack packed input', () => {
    const method = factory.services[0].methods['GetAward'].resolve();
    const contractMethod = new ContractMethod(
      chain,
      method,
      address,
      AElf.wallet
    );
    const hash =
      '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb2754682';
    expect(contractMethod.unpackPackedInput(hash)).toEqual(
      '0a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb2754682'
    );
    expect(contractMethod.unpackPackedInput()).toEqual(null);
  });
  test('test unpack output', () => {
    const method = factory.services[0].methods['GetAward'].resolve();
    const contractMethod = new ContractMethod(
      chain,
      method,
      address,
      AElf.wallet
    );
    const hash = '088088deee9d92b4888a01';
    const result = contractMethod.unpackOutput(hash);
    expect(result).toEqual({ value: '-8498063171937401856' });
    expect(contractMethod.unpackOutput()).toEqual(null);
  });
  test('test output', () => {
    const method = factory.services[0].methods['GetAward'].resolve();
    const contractMethod = new ContractMethod(
      chain,
      method,
      address,
      AElf.wallet
    );
    const hash = {
      value: '4046e35079e2f2285347fbc70c3b1d2a6eacd069c521e3704f8cc6faa6fef989',
    };
    const result = contractMethod.packOutput(hash);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString('hex')).toBe('088088deee9d92b4888a01');
    expect(contractMethod.packOutput()).toEqual(null);
  });

  // test('contract method', async () => {
  //   // aelf = new AElf(
  //   //   new AElf.providers.HttpProvider('https://explorer-test.aelf.io/chain')
  //   // );
  //   const wallet = AElf.wallet.createNewWallet();
  //   const { GenesisContractAddress } = await aelf.chain.getChainStatus();
  //   const genesisContract = await aelf.chain.contractAt(
  //     GenesisContractAddress,
  //     wallet
  //   );
  //   const tokenContractAddress =
  //     await genesisContract.GetContractAddressByName.call(
  //       AElf.utils.sha256('AElf.ContractNames.Token')
  //     );

  //   console.log(tokenContractAddress);
  // });
});
