import AElf from '../../src/index';

const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// const defaultPrivateKey = 'cf2207002d1ab7c152a84da7df52632c42d9818206eb144aaff96f0d9caacaa0';

describe('test AElf-sdk', () => {
  let aelf = null;
  let wallet = null;
  test('check sdk static field', () => {
    expect(AElf).toBeDefined();
    expect(AElf.wallet).toBeDefined();
    expect(AElf.providers).toBeDefined();
    expect(AElf.pbjs).toBeDefined();
  });

  test('test wallet methods', () => {
    wallet = AElf.wallet.getWalletByPrivateKey(defaultPrivateKey);
    expect(wallet).toBeDefined();
  });

  test('create an aelf instance and is connected', () => {
    aelf = new AElf(new AElf.providers.HttpProvider('http://18.162.41.20:8000'));
    expect(aelf).toBeDefined();
    expect(aelf.isConnected()).toBeTruthy();
    expect(aelf.chain).toBeTruthy();
  });

  test('test chain methods get height and get block', async () => {
    const height = await aelf.chain.getBlockHeight();
    expect(height).not.toBeNaN();
    expect(aelf.chain.getBlockHeight({ sync: true })).not.toBeNaN();
    const block = await aelf.chain.getBlockByHeight(height, true);
    const blockWithSync = aelf.chain.getBlockByHeight(height, true, {
      sync: true
    });
    expect(block).toEqual(expect.objectContaining({
      BlockHash: expect.any(String),
      Header: expect.any(Object),
      Body: {
        TransactionsCount: expect.any(Number),
        Transactions: expect.any(Array)
      }
    }));
    expect(block).toStrictEqual(blockWithSync);
  }, 30000);

  test('get contracts', async () => {
    const {
      GenesisContractAddress
    } = await aelf.chain.getChainStatus();
    const genesisContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
    const tokenContractAddress = await genesisContract.GetContractAddressByName
      .call(AElf.utils.sha256('AElf.ContractNames.Token'));

    const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);

    const aelfToken = await tokenContract.GetTokenInfo.call({
      symbol: 'ELF'
    });
    expect(aelfToken).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      tokenName: expect.any(String),
      supply: expect.any(String),
      totalSupply: expect.any(String),
      decimals: expect.any(Number),
      issuer: expect.any(String),
      isBurnable: expect.any(Boolean)
    }));
  }, 30000);

  // this could take a long time to get all transactions
  test('test chain methods get merkle path', async () => {
    const height = await aelf.chain.getBlockHeight();
    expect(height).toEqual(expect.any(Number));
    const block = await aelf.chain.getBlockByHeight(height, true);
    const merklePath = await aelf.chain.getMerklePath(block.Body.Transactions[0], height, {
      sync: false
    });
    expect(merklePath.length).toBeGreaterThanOrEqual(0);
  }, 30000);
});
