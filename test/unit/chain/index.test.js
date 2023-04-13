import Chain from '../../../src/chain/index';
import RequestManager from '../../../src/util/requestManage';
import HttpProvider from '../../../src/util/httpProvider';
import AElf from '../../../src';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/chain';
let httpProvider, requestManager, chain;

describe('chain should work', () => {
  beforeEach(() => {
    httpProvider = new HttpProvider(stageEndpoint);
    requestManager = new RequestManager(httpProvider);
    chain = new Chain(requestManager);
  });
  test('test is chain method on object', () => {
    expect(chain.getChainStatus).toBeInstanceOf(Function);
  });
  test('test fn argument into object ', () => {
    const fn = new Function();
    const args = [fn];
    const result = chain.extractArgumentsIntoObject(args);
    expect(result.callback).toBe(fn);
  });
  test('test sync argument into object', () => {
    const args = [{ sync: true }];
    const result = chain.extractArgumentsIntoObject(args);
    expect(result.isSync).toBeTruthy();
  });
  test('test is concrete contract when sync', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const { GenesisContractAddress } = await aelf.chain.getChainStatus();
    const args = [{ sync: true }];
    const contract = await chain.contractAt(
      GenesisContractAddress,
      null,
      ...args
    );
    expect(contract.deserializeLog).toBeInstanceOf(Function);
  });
  test('test is invalid contract when sync', async () => {
    const address =
      'ELF_iUY5CLwzU8L8vjVgH95vx3ZRuvD5d9hVK3EdPMVD8v9EaQT75_AELF';
    const args = [{ sync: true }];
    // mock contractFileDescriptorSet
    chain.getContractFileDescriptorSet = jest.fn(() => {
      return {
        file: [],
      };
    });
    expect(() => chain.contractAt(address, null, ...args)).toThrow(
      'no such contract'
    );
  });
  test('test is concrete contract when async', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const { GenesisContractAddress } = await aelf.chain.getChainStatus();
    const contract = await chain.contractAt(GenesisContractAddress, null);
    expect(contract.deserializeLog).toBeInstanceOf(Function);
  });
  test('test is invalid contract when async', async () => {
    const address =
      'ELF_iUY5CLwzU8L8vjVgH95vx3ZRuvD5d9hVK3EdPMVD8v9EaQT75_AELF';
    chain.getContractFileDescriptorSet = jest.fn(() => {
      return Promise.resolve({
        file: [],
      });
    });
    let error;
    chain.extractArgumentsIntoObject = jest.fn(() => {
      return {
        callback: (e) => {
          error = e;
        },
        isSync: false,
      };
    });
    await chain.contractAt(address, null);
    expect(error).toEqual(new Error('no such contract'));
  }, 5000);
  test('test is invalid contract with noop callback', async () => {
    const address =
      'ELF_iUY5CLwzU8L8vjVgH95vx3ZRuvD5d9hVK3EdPMVD8v9EaQT75_AELF';
    chain.getContractFileDescriptorSet = jest.fn(() => {
      return Promise.resolve({
        file: [],
      });
    });
    await expect(chain.contractAt(address, null)).rejects.toEqual(
      new Error('no such contract')
    );
  }, 5000);
  test('test txId has corresponding transaction in the block with height when sync', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const blockInfo = await aelf.chain.getBlockByHeight(1, true);
    const txId = blockInfo.Body.Transactions[0];
    const result = Array.isArray(
      aelf.chain.getMerklePath(txId, 1, { sync: true })
    );
    expect(result).toBe(true);
  }, 5000);
  test('test txId has no corresponding transaction in the block with height when sync', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const blockInfo = await chain.getBlockByHeight(1, true);
    const txId = blockInfo.Body.Transactions[0];
    await expect(() =>
      aelf.chain.getMerklePath(txId, 2, { sync: true })
    ).toThrow(
      'txId dce643d5c142945dc9f0665819dbf0b268b8423a94fa7a488d24cd89c0b67a23 has no correspond transaction in the block with height 2'
    );
  });

  test('test txId has corresponding transaction in the block with height when async', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const blockInfo = await aelf.chain.getBlockByHeight(1, true);
    const txId = blockInfo.Body.Transactions[0];
    const result = await aelf.chain.getMerklePath(txId, 1);
    expect(Array.isArray(result)).toBe(true);
  }, 10000);
  test('test txId has no corresponding transaction in the block with height when async', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const blockInfo = await aelf.chain.getBlockByHeight(1, true);
    const txId = blockInfo.Body.Transactions[0];
    await expect(
      async () => await aelf.chain.getMerklePath(txId, 2)
    ).rejects.toThrow(
      'txId dce643d5c142945dc9f0665819dbf0b268b8423a94fa7a488d24cd89c0b67a23 has no correspond transaction in the block with height 2'
    );
  });
});
