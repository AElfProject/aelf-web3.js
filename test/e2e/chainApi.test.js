import AElf from '../../src/index';
import HttpProvider from '../../src/util/httpProvider'

const stageEndpoint1 = 'http://18.163.40.216:8000'; //香港节点
const stageEndpoint2 = 'http://3.1.211.78:8000'; //新加坡节点
const fakeEndpoint = 'http://127.0.0.1:9999';

describe('test AElf-sdk', () => {
  let aelf = null;
  aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint1));
  expect(aelf.isConnected()).toBeTruthy();

  test('set provider for exist alef instance', () => {
    aelf.setProvider(new HttpProvider(fakeEndpoint))
    expect(aelf.isConnected()).not.toBeTruthy();
    aelf.setProvider(new HttpProvider(stageEndpoint2))
    expect(aelf.isConnected()).toBeTruthy();
  });

  test('check get chain status', () => {
    const chainStatus = aelf.chain.getChainStatus({
      sync: true
    });
    expect(chainStatus).not.toBeNaN()
    expect(chainStatus).toHaveProperty('ChainId', 'AELF');
    expect(chainStatus).toHaveProperty('Branches');
    expect(chainStatus).toHaveProperty('LongestChainHeight');
    expect(chainStatus).toHaveProperty('LongestChainHash');
    expect(chainStatus).toHaveProperty('GenesisBlockHash');
    expect(chainStatus).toHaveProperty('GenesisContractAddress');
    expect(chainStatus).toHaveProperty('LastIrreversibleBlockHash');
    expect(chainStatus).toHaveProperty('LastIrreversibleBlockHeight');
    expect(chainStatus).toHaveProperty('BestChainHash');
    expect(chainStatus).toHaveProperty('BestChainHeight');
  });

  test('check get block by height and hash', async () => {
    const height = await aelf.chain.getBlockHeight()
    const block = await aelf.chain.getBlockByHeight(height, true);
    expect(block).not.toBeNaN();
    expect(block).toHaveProperty('BlockHash');
    expect(block).toHaveProperty('Header.Height', height);
    expect(block).toHaveProperty('Header')
    expect(block).toHaveProperty('Body.TransactionsCount');
    expect(block).toHaveProperty('Body.Transactions');

    const blockHash = block.BlockHash
    const block1 = await aelf.chain.getBlock(blockHash, true);
    expect(block1).toEqual(block);
  });

  test('check get contract file descriptor set', async () => {
    const chainStatus = await aelf.chain.getChainStatus();
    expect(chainStatus).not.toBeNaN();

    const genesisAddress = chainStatus.GenesisContractAddress;
    const descriptorSet = await aelf.chain.getContractFileDescriptorSet(genesisAddress);
    expect(descriptorSet).not.toBeNaN();

    const jsonInfo = JSON.stringify(descriptorSet);
    expect(jsonInfo).toContain('basic_contract_zero.proto');
    expect(jsonInfo).toContain('core.proto');
    expect(jsonInfo).toContain('options.proto');
    expect(jsonInfo).toContain('google/protobuf/empty.proto');
    expect(jsonInfo).toContain('google/protobuf/wrappers.proto');
  });

  test('check transaction result and results information', async () => {
    const chainStatus = await aelf.chain.getChainStatus();
    expect(chainStatus).not.toBeNaN();

    const lastIrreversibleBlockHash = chainStatus.LastIrreversibleBlockHash;
    const transactions = await aelf.chain.getTxResults(lastIrreversibleBlockHash, 0, 10);
    expect(transactions).not.toBeNaN();
    var txArray = [];
    for (var key in transactions) {
      var txId = transactions[key].TransactionId
      txArray.push(txId);
    }

    const transaction = await aelf.chain.getTxResult(txArray[0]);
    expect(transaction.Transaction).toEqual(transactions[0].Transaction);
    expect(transaction.BlockNumber).toEqual(chainStatus.LastIrreversibleBlockHeight);
  });

  test('check get merkle path by tx id', async () => {
    const blockInfo = await aelf.chain.getBlockByHeight(1, true)
    expect(blockInfo).not.toBeNaN();

    const txId = blockInfo.Body.Transactions[0]
    var merklePath = await aelf.chain.getMerklePathByTxId(txId);
    expect(merklePath).not.toBeNaN();
    expect(merklePath).toHaveProperty('MerklePathNodes');
    expect(merklePath.MerklePathNodes.length).toBeGreaterThanOrEqual(1);
  });

  test('check get transaction pool status', async () => {
    const transactionPoolStatus = await aelf.chain.getTransactionPoolStatus();
    expect(transactionPoolStatus).not.toBeNaN();
    expect(transactionPoolStatus).toHaveProperty('Queued');
    expect(transactionPoolStatus).toHaveProperty('Validated');
  });

  test('check get peers info', async () => {
    const peersInfo = await aelf.chain.getPeers();
    expect(peersInfo).not.toBeNaN();
    expect(peersInfo.length).toBeGreaterThan(1);
});

  test('check add not existed peer info', async () => {
    const result = await aelf.chain.addPeer(fakeEndpoint);
    expect(result).not.toBeTruthy();
  });

  test('check remove not existed peer info', async () => {
    const result = await aelf.chain.removePeer(fakeEndpoint);
    expect(result).not.toBeTruthy();
  });
});
