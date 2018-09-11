var Aelf = require('./lib/aelf.js');
var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:1234/chain"));

// var tokenc = aelf.chain.getContractAbi('0x75b19ac4415c072512d011634ac86a9c58cf');
aelf.chain.connectChain(function (err, result) {
    console.log('connectChain: ', err, result);
});

aelf.chain.connectChain();

// var tokenc = aelf.chain.contractAt('0x75b19ac4415c072512d011634ac86a9c58cf');
console.log('contractAt start');
var wallet = Aelf.wallet.getWalletByPrivateKey('90badb6866fd4df0ec1fcfc9fd1505703bd1a1681caaaba0f9f1f7ed2f4b30d4');
// var wallet = Aelf.wallet.getWalletByPrivateKey('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71');

var tokenc = aelf.chain.contractAt('0x6b6235a76ffb7cf9df18c0dad5d144222078', wallet);


// console.log('TokenName: ', tokenc.TokenName());
//
// console.log('BalanceOf: ', tokenc.BalanceOf('0x0424421b90fdacf9470ee049f50113a56656'));

console.log('Tranfer: ', tokenc.Transfer('0x0489da3cad42c556cddf672d6719c8add3ac', 10));

// let contractAbi = aelf.chain.getContractAbi('0xdb458e5db5db1b0ecad3408acc344c96794c');
// console.log('contractAbi: ', contractAbi);
//
// let increment = aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// console.log('getIncrement: ', increment);
// let totalSupply = tokenc.TotalSupply();
// console.log('totalSupply: ', JSON.stringify(totalSupply));
// let txResult = aelf.chain.getTxResult('0x9e3d580f6e3e09041cb7987dee8c7261237dd6d71812364407fc70971969645e');
// console.log('txResult: ', JSON.stringify(txResult));
//
// console.log('blockHeight: ', aelf.chain.getBlockHeight());

// console.log('getBanceOf start');
// console.log('BalanceOf: ', JSON.stringify(tokenc.BalanceOf('0x04bb9c6c297ea90b1bc3e6af2c87d416583e')));
// console.log('txResult: ', JSON.stringify(aelf.chain.getTxResult('0x9094b098aee097a96445a186f780c1ed5cf3e7628b7f0dcadcefdf2bc6bb3358')));

// tokenc.Initialize('test','hzz',10000,1);


// aelf.chain.sendTransaction({"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x75b19ac4415c072512d011634ac86a9c58cf","method":"TotalSupply","incr":"2"});
//
// aelf.chain.sendTransaction({"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x582b198dd8251d2125c8cbbc114c5864d616","method":"TotalSupply","incr":"3"});
// console.log(aelf);
// console.log(tokenc);

// broswer
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8085/aelf/api"));
// aelf.chain.connectChain();
// aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// var tokenc = aelf.chain.contractAt('0xdb458e5db5db1b0ecad3408acc344c96794c');
// var response = tokenc.TotalSupply();