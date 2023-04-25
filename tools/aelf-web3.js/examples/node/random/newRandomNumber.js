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
const consensusContractName = 'AElf.ContractNames.Consensus';
const tokenContractName = 'AElf.ContractNames.Token';
const chainStatus = aelf.chain.getChainStatus({
  sync: true
});
const {
  // directly accessible information
  GenesisContractAddress
} = chainStatus;

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet, {
  sync: true
});

const consensusContractAddress = zeroC.GetContractAddressByName.call(sha256(consensusContractName), {
  sync: true
});

const consensusContract = aelf.chain.contractAt(consensusContractAddress, wallet, {
  sync: true
});

const {
  TransactionId: RandomToken
} = consensusContract.RequestRandomNumber({
  sync: true
});

console.log('TransactionId: ', RandomToken);

// console.log('txInfo', aelf.chain.getTxResult('116e54c730381cb68fa9f5bc353e136575b3fed532d598accd592af0b0c3959f', {
//   sync: true
// }));
// const randomNumber = consensusContract.GetRandomNumber('062c264255eaae8624a86da154ca21199d438762b70c820627672c7f3910c676', {
//   sync: true
// });

// consensusContract.GetRandomNumber.call('3765ea510165ae5091d32a88d9afd5aef87f094d703b2c864941337b8d5b8634', {
//   sync: true
// });

// const result = aelf.chain.getTxResult(randomNumber.TransactionId, {sync: true});

// console.log('RandomToken', RandomToken);
