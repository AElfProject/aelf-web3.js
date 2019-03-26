/**
 * @file basic.js
 * @author huangzongzhe
 */

const Aelf = require('../../lib/aelf.js');
const Wallet = require('../../lib/aelf/wallet');

const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.56:8000/chain'));

// aelf.chain.getCommands((err, result) => {
//     console.log('--- get commands ---');
//     console.log(err, result);
// });

// aelf.chain.connectChain((err, result) => {
//     console.log('--- connect chain ---');
//     console.log(err, result);
// });

// aelf.chain.getContractAbi('ELF_3sXEJQhEYUXaYgtdX4aePekYeM8yTkgtQ4T1wff2XhawjF6', (err, result) => {
//     console.log('--- get contract abi ---');
//     console.log(err, result);
// });

// aelf.chain.callReadOnly('xxxx', (err, result) => {
//     console.log('--- call read only ---');
//     console.log(err, result);
// });

// aelf.chain.getBlockHeight((err, result) => {
//     console.log('--- get block height ---');
//     console.log(err, result);
// });

// aelf.chain.getBlockInfo(50, true, (err, result) => {
//     console.log('--- get block height ---');
//     console.log(err, result);
// });

// aelf.chain.getTxPoolSize((err, result) => {
//     console.log('--- get tx pool size ---');
//     console.log(err, result);
// });

// aelf.chain.getDposStatus((err, result) => {
//     console.log('--- get dpos status ---');
//     console.log(err, result);
// });

// aelf.chain.getNodeStatus((err, result) => {
//     console.log('--- get node status ---');
//     console.log(err, result);
// });

// aelf.chain.getBlockStateSet('51d38bf89c804e5e74e0693b52c93e3b00622c1dbc1ceaa502c068231d938e32', (err, result) => {
//     console.log('--- get block state set---');
//     console.log(err, result);
// });

// getPeers, addPeer, removePeer not support yet
// aelf.chain.getPeers((err, result) => {
//     console.log('--- get peers ---');
//     console.log(err, result);
// });
// aelf.chain.addPeer('192.168.197.13:6800', (err, result) => {
//     console.log('--- add peer ---');
//     console.log(err, result);
// });
// aelf.chain.removePeer('192.168.197.13:6800', (err, result) => {
//     console.log('--- remove peer ---');
//     console.log(err, result);
// });


