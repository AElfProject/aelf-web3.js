import Chain from '../../../src/chain/index';
import RequestManager from '../../../src/util/requestManage';
import HttpProvider from '../../../src/util/httpProvider';
import AElf from '../../../src';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/chain';
let httpProvider, requestManager, chain;

describe('should work', () => {
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
  test('test is concrete contract when async', async () => {
    const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
    const { GenesisContractAddress } = await aelf.chain.getChainStatus();
    const contract = await chain.contractAt(GenesisContractAddress, null);
    expect(contract.deserializeLog).toBeInstanceOf(Function);
  });
});
