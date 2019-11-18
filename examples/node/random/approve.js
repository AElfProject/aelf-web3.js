/* eslint-env node */
const AElf = require('../../../dist/aelf.cjs');

const Wallet = AElf.wallet;
const {
  sha256
} = AElf.utils;

// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
// link to Blockchain
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));

if (!aelf.isConnected()) {
  console.log('Blockchain Node is not running.');
}

// the contract you want to query
const tokenContractName = 'AElf.ContractNames.Token';
const lotteryContractName = 'AElf.ContractNames.LotteryDemo';
const chainStatus = aelf.chain.getChainStatus({
  sync: true
});
const {
  // directly accessible information
  GenesisContractAddress
} = chainStatus;
console.log('chainStatus', chainStatus);

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet, {
  sync: true
});

const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256(tokenContractName), {
  sync: true
});

const tokenContract = aelf.chain.contractAt(tokenContractAddress, wallet, {
  sync: true
});

// message ApproveInput {
//   aelf.Address spender = 1;
//   string symbol = 2;
//   sint64 amount = 3;
// }
const lotteryContractAddress = zeroC.GetContractAddressByName.call(sha256(lotteryContractName), {
  sync: true
});

const approveResult = tokenContract.Approve({
  spender: lotteryContractAddress, // lottery 合约
  symbol: 'ELF',
  amount: 1000 * 100000000
}, {sync: true});

console.log('lotteryContractAddress', lotteryContractAddress);
console.log('approveResult', approveResult);

tokenContract.GetTokenInfo.call({
  symbol: 'ELF'
}, {
  sync: true
});

tokenContract.GetBalance.call({
  symbol: 'ELF',
  owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
}, {
  sync: true
});

// 2C2Acy4saYsnkRYEf54VawvmvUTAvrrWHKbLSwLg33b26woJVu
tokenContract.GetBalance.call({
  symbol: 'ELF',
  owner: '2C2Acy4saYsnkRYEf54VawvmvUTAvrrWHKbLSwLg33b26woJVu'
}, {
  sync: true
});