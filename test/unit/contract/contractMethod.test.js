import ContractMethod from '../../../src/contract/contractMethod';
import ContractFactory from '../../../src/contract/index';
import AElf from '../../../src/index';
import { noop, uint8ArrayToHex } from '../../../src/util/utils';
const stageEndpoint = 'https://tdvw-test-node.aelf.io/';
describe('token contract with transfer method', () => {
  const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
  const wallet = AElf.wallet.getWalletByPrivateKey(
    '943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096'
  );
  const chain = aelf.chain;
  const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true,
  });
  const factory = new ContractFactory(chain, fds, wallet);
  const method = factory.services[2].methods['Transfer'].resolve();
  const contractMethod = new ContractMethod(chain, method, address, wallet);
  test('test constructor', () => {
    expect(contractMethod).toHaveProperty('_chain');
    expect(contractMethod).toHaveProperty('_method');
    expect(contractMethod).toHaveProperty('_inputType');
    expect(contractMethod).toHaveProperty('_outputType');
    expect(contractMethod).toHaveProperty('_name', 'Transfer');
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
    const rawTransactionBuffer = contractMethod.packInput({
      to: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
      amount: '10000000',
      symbol: 'ELF',
    });
    expect(rawTransactionBuffer).toBeInstanceOf(Buffer);
    expect(rawTransactionBuffer.toString('hex')).toBe(
      '0a220a201570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e61203454c461880ade204'
    );
    expect(contractMethod.packInput()).toEqual(null);
  });
  test('test unpack packed input', () => {
    const rawTransaction =
      '0a220a201570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e61203454c461880ade204';
    expect(contractMethod.unpackPackedInput(rawTransaction)).toEqual({
      amount: '10000000',
      memo: '',
      symbol: 'ELF',
      to: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    });
    expect(contractMethod.unpackPackedInput()).toEqual(null);
  });
});
describe('token contract with GetBalance method', () => {
  const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
  const wallet = AElf.wallet.getWalletByPrivateKey(
    '943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096'
  );
  const chain = aelf.chain;
  const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
  const fds = chain.getContractFileDescriptorSet(address, {
    sync: true,
  });
  const factory = new ContractFactory(chain, fds, wallet);
  const method = factory.services[2].methods['GetBalance'].resolve();
  const contractMethod = new ContractMethod(chain, method, address, wallet);
  test('test unpack output', () => {
    const result = contractMethod.unpackOutput(
      '0a220a209af13552202a457f0d77465a41b5bd55821e1f889ac7b530587100d422fa294412220a201570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e618cc81e5162204fcef5c252a085472616e73666572322e0a220a201570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e61203454c461880ade20482f10441596ffafb80b1d3185f87ba6fdfa0e42915f54d6d464b9b2b80ed77134c16a4523422e781ce7e3583ee24e76c7ed931fc9455618e7192ffcfd1508454d1bff6ff01'
    );
    expect(result.balance).toEqual('47792332');
    expect(result.owner).toEqual(
      'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
    );
    expect(typeof result.symbol).toBe('string');
    expect(contractMethod.unpackOutput()).toEqual(null);
  });
  test('test output', () => {
    const result = contractMethod.packOutput({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString('hex')).toBe(
      '0a03454c4612220a207356a44986bbf671cfa3214fe4b65928c0102d6a1f36d0d16173a98b9cb13590'
    );
    expect(contractMethod.packOutput()).toEqual(null);
  });
  test('test handle transaction', async () => {
    const chainStatus = await chain.getChainStatus();
    const result = contractMethod.handleTransaction(
      chainStatus?.BestChainHeight,
      chainStatus?.BestChainHash,
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      }
    );
    expect(typeof result).toBe('string');
  }, 10000);
  test('test prepare parameters async', async () => {
    const result = await contractMethod.prepareParametersAsync([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);
  test('test prepare parameters sync', () => {
    const result = contractMethod.prepareParameters([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);
  test('test prepare parameters with block info', () => {
    const result = contractMethod.prepareParametersWithBlockInfo([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      {
        height: 49978717,
        hash: 'ec8ac1d87127082903d29553778425d56c339ee30070c716a4c27ab714c42bb5',
      },
    ]);
    expect(result).toBe(
      '0a220a209af13552202a457f0d77465a41b5bd55821e1f889ac7b530587100d422fa294412220a201570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e618ddbaea172204ec8ac1d82a0a47657442616c616e636532290a03454c4612220a207356a44986bbf671cfa3214fe4b65928c0102d6a1f36d0d16173a98b9cb1359082f104410b80d69ea94d5484fb3c857b57ccd06d95f1b8d503fbfced80dae64f9ac1522a4c006055ede758555bae4ee359894b49d58338729d184cfcf675e80430c991a601'
    );
  });
  test('test send transaction', async () => {
    const result = await contractMethod.sendTransaction({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
    expect(typeof result.TransactionId).toBe('string');
  }, 10000);
  test('test send transaction sync', async () => {
    const result = contractMethod.sendTransaction(
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      {
        sync: true,
      }
    );
    expect(typeof result.TransactionId).toBe('string');
  }, 10000);
  test('test call read only', async () => {
    const result = await contractMethod.callReadOnly({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
    expect(result).toEqual({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      balance: '120000000',
    });
    const resultSync = contractMethod.callReadOnly(
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      { sync: true }
    );
    expect(resultSync).toEqual({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      balance: '120000000',
    });
  }, 10000);
  test('test extract arguments into object', () => {
    const mockCallback = jest.fn((x) => x);
    const result = contractMethod.extractArgumentsIntoObject([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      mockCallback,
    ]);
    expect(result.isSync).toBe(false);
    expect(result.callback).toEqual(mockCallback);
  });
  test('test extract arguments into object with empty args', () => {
    const result = contractMethod.extractArgumentsIntoObject([]);
    expect(result.isSync).toBe(false);
    expect(result.callback).toEqual(noop);
  });
  test('test get signed tx', async () => {
    const result = await contractMethod.getSignedTx(
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      {
        height: 49978717,
        hash: 'ec8ac1d87127082903d29553778425d56c339ee30070c716a4c27ab714c42bb5',
      }
    );
    expect(typeof result).toEqual('string');
  });
  test('test get signed tx with only one param', async () => {
    const result = await contractMethod.getSignedTx({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
    expect(typeof result).toEqual('string');
  });
  test('test get signed tx without hash or height', async () => {
    expect(() =>
      contractMethod.getSignedTx(
        {
          symbol: 'ELF',
          owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
        },
        {
          height: 49978717,
        }
      )
    ).toThrow('The second param is the height & hash of a block');
  });
  test('test get raw tx', async () => {
    const result = contractMethod.getRawTx(
      49988688,
      '7251887cfdae9c39ec6d6209ce9c4444166c8eb805a8592e2603ddf48dcd85ec',
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      }
    );
    expect(result.from.value).toBeInstanceOf(Buffer);
    expect(result.from.value.toString('hex')).toBe(
      '9af13552202a457f0d77465a41b5bd55821e1f889ac7b530587100d422fa2944'
    );
    expect(result.to.value).toBeInstanceOf(Buffer);
    expect(result.to.value.toString('hex')).toBe(
      '1570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e6'
    );
    expect(result.refBlockNumber).toBe(49988688);
    expect(result.refBlockPrefix).toBeInstanceOf(Buffer);
    expect(result.refBlockPrefix.toString('hex')).toBe('7251887c');
    expect(result.methodName).toBe('GetBalance');
    expect(result.params).toEqual({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
  });
  test('test get raw tx with hex hashInput', async () => {
    const result = contractMethod.getRawTx(
      49988688,
      '0x7251887cfdae9c39ec6d6209ce9c4444166c8eb805a8592e2603ddf48dcd85ec',
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      }
    );
    expect(result.from.value).toBeInstanceOf(Buffer);
    expect(result.from.value.toString('hex')).toBe(
      '9af13552202a457f0d77465a41b5bd55821e1f889ac7b530587100d422fa2944'
    );
    expect(result.to.value).toBeInstanceOf(Buffer);
    expect(result.to.value.toString('hex')).toBe(
      '1570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e6'
    );
    expect(result.refBlockNumber).toBe(49988688);
    expect(result.refBlockPrefix).toBeInstanceOf(Buffer);
    expect(result.refBlockPrefix.toString('hex')).toBe('7251887c');
    expect(result.methodName).toBe('GetBalance');
    expect(result.params).toEqual({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
  });
  test('test request', async () => {
    const mockCallback = jest.fn((x) => x);
    const result = contractMethod.request(
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
      mockCallback
    );
    expect(result.method).toBe('broadcast_tx');
    expect(result.callback).toEqual(mockCallback);
    expect(typeof result.params).toBe('string');
  });
  test('test run', async () => {
    const result = await contractMethod.run({
      symbol: 'ELF',
      owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
    });
    expect(typeof result.TransactionId).toBe('string');
  }, 10000);
  test('test bind method to contract', () => {
    contractMethod.bindMethodToContract(factory);
    expect(factory.GetBalance.request).toBeInstanceOf(Function);
    expect(factory.GetBalance.unpackPackedInput).toBeInstanceOf(Function);
    expect(factory.GetBalance.packInput).toBeInstanceOf(Function);
    expect(factory.GetBalance.packOutput).toBeInstanceOf(Function);
    expect(factory.GetBalance.unpackOutput).toBeInstanceOf(Function);
    expect(factory.GetBalance.sendTransaction).toBeInstanceOf(Function);
    expect(factory.GetBalance.getSignedTx).toBeInstanceOf(Function);
    expect(factory.GetBalance.getRawTx).toBeInstanceOf(Function);
    expect(factory.GetBalance.call).toBeInstanceOf(Function);
    expect(factory.GetBalance.inputTypeInfo).toEqual(
      contractMethod._inputType.toJSON()
    );
    expect(factory.GetBalance.inputType).toEqual(contractMethod._inputType);
    expect(factory.GetBalance.outputTypeInfo).toEqual(
      contractMethod._outputType.toJSON()
    );
    expect(factory.GetBalance.outputType).toEqual(contractMethod._outputType);
  });

  test('test prepareParametersAsync with valid refBlockNumberStrategy', async () => {
    const result = await contractMethod.prepareParametersAsync([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
        refBlockNumberStrategy: -1,
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);
  
  test('test prepareParametersAsync with invalid refBlockNumberStrategy type', async () => {
    await expect(
      contractMethod.prepareParametersAsync([
        {
          symbol: 'ELF',
          owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
          refBlockNumberStrategy: 'invalid type',
        },
      ])
    ).rejects.toThrow('Invalid type, refBlockNumberStrategy must be number');
  }, 10000);
  
  test('test prepareParametersAsync with positive refBlockNumberStrategy', async () => {
    await expect(
      contractMethod.prepareParametersAsync([
        {
          symbol: 'ELF',
          owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
          refBlockNumberStrategy: 1,
        },
      ])
    ).rejects.toThrow('refBlockNumberStrategy must be less than 0');
  }, 10000);
  
  test('test prepareParametersAsync without refBlockNumberStrategy', async () => {
    const result = await contractMethod.prepareParametersAsync([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);

  test('test prepareParameters with valid refBlockNumberStrategy', () => {
    const result = contractMethod.prepareParameters([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
        refBlockNumberStrategy: -1,
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);
  
  test('test prepareParameters with invalid refBlockNumberStrategy type', () => {
    expect(() => {
      contractMethod.prepareParameters([
        {
          symbol: 'ELF',
          owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
          refBlockNumberStrategy: 'invalid-type', // invalid type
        },
      ]);
    }).toThrow('Invalid type, refBlockNumberStrategy must be number');
  }, 10000);
  
  test('test prepareParameters with refBlockNumberStrategy greater than 0', () => {
    expect(() => {
      contractMethod.prepareParameters([
        {
          symbol: 'ELF',
          owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
          refBlockNumberStrategy: 1, // invalid value
        },
      ]);
    }).toThrow('refBlockNumberStrategy must be less than 0');
  }, 10000);
  
  test('test prepareParameters without refBlockNumberStrategy', () => {
    const result = contractMethod.prepareParameters([
      {
        symbol: 'ELF',
        owner: 'soAcchsFZGEsFeaEsk9tyMnFauPgJfMyZMRrfcntGjrtC7YvE',
      },
    ]);
    expect(typeof result).toBe('string');
  }, 10000);
});
