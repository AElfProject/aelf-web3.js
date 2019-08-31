/**
 * @author huangzonghze
 * @description 侧链转账示例
 */

/* eslint-env node */
const AElf = require('../../dist/aelf.cjs');

const Wallet = AElf.wallet;

// const CrossChain = require('./crossChain/crossChain');
// const CrossChain = require('./crossChain/crossChain');
const {
  CrossChain
} = require('./crossChain/aelf-cross-chain.cjs');

// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
// const defaultAddress = '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX';
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// address: 2SHdLCrMggDf6bmQFrgrynf85BRe2ifQy81qMsU1DmbWJF7F13
const receiveAddress = '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX';
// const receiveAddress = '2SHdLCrMggDf6bmQFrgrynf85BRe2ifQy81qMsU1DmbWJF7F13';
// const receivePrivateKey = '1bf2d0eb2f8d98dba8d622839f18f2c9a0d68e618c4cd3cae69f73816b9aae1a';

// const walletCreatedByMethod = Wallet.createNewWallet();
const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
// const receiveWallet = Wallet.getWalletByPrivateKey(receivePrivateKey);
// link to Blockchain
const sendInstance = new AElf(new AElf.providers.HttpProvider('http://13.231.179.27:8000'));
const receiveInstance = new AElf(new AElf.providers.HttpProvider('http://52.68.97.242:8000'));
// const aelfOnChainA = new AElf(new AElf.providers.HttpProvider('http://52.196.227.200:8000'));

async function init() {
  const crossChainInstance = new CrossChain({
    AElfUtils: AElf.utils,
    sendInstance,
    receiveInstance,
    wallet,
  });
  await crossChainInstance.init();

  const {
    crossTransferTxId
  } = await crossChainInstance.send({
    to: receiveAddress,
    symbol: 'ELF',
    amount: 1,
    memo: 'to be or not to be.'
  });

  const receiveInfo = await crossChainInstance.receive({
    // crossTransferTxId: 'cad78d4697f23ec34d03956ab17c0c8443d97277f7590d2b178d714d4a9682d3'
    crossTransferTxId
  });

  return receiveInfo;
}

init().then(result => {
  console.log('init result: ', result);
}).catch(error => {
  console.log('init error: ', error);
});
