/**
 * @file getContractAddressByName.js
 * @author huangzongzhe
 */

/* eslint-disable fecs-camelcase */
const AElf = require('../../lib/aelf.js');
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;
// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';
// tell laugh gym apart occur ship shine armed spare erupt hope pull
// address: rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v
// privateKey: f03dbc454f97c61b91dbbe70fbd7c96a6527dd01378423130d5e2f42bc33676b

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new AElf(new AElf.providers.HttpProvider(
    'http://34.213.112.35:8000'
));

aelf.chain.getBlockHeight();

// let {
//     GenesisContractAddress
// } = aelf.chain.getChainStatus();

// aelf.chain.getChainStatus({
//     sync: true
// });

// aelf.chain.getChainStatus((error, result) => {
//     console.log(error, result);
// });

// aelf.chain.getChainStatus().then(result => {
//     console.log('then1: ', result);
// }).catch(error => {
//     console.log('catch1: ', error);
// });

// let zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);

// let tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'), {
//     sync: true
// }); // HelloWorldContract

// let tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);
// tokenC.GetBalance.call({
//     symbol: 'ELF',
//     owner: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
//     // owner: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQM'
// }).then(result => {
//     console.log('then111: ', result);
// }).catch(error => {
//     console.log('catch111: ', error);
// });

// // tokenC.GetBalance.call({
// //     symbol: 'ELF',
// //     // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
// //     owner: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
// //     // owner: '2gaQh4uxg6tzyH1ADLoDxvHA14FMpzEiMqsQ6sDG5iHT8cmjp8'
// // });

// tokenC.Tranfer({
//     symbol: 'ELF',
//     amount: 1,
//     // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
//     to: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
//     // owner: '2gaQh4uxg6tzyH1ADLoDxvHA14FMpzEiMqsQ6sDG5iHT8cmjp8'
// });
