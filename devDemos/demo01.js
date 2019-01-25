/**
 * 
 */

const Aelf = require('../lib/aelf.js');
const wallet = Aelf.wallet.getWalletByPrivateKey('bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b');
const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.70:8001/chain'));
// var aelf = new Aelf(new Aelf.providers.HttpProvider('http://34.212.171.27:8000/chain'));

aelf.chain.connectChain();

// aelf.chain.contractAt('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob', wallet);
aelf.chain.contractAtAsync('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob', wallet, (error, contract) => {
    console.log(error, contract);
});

aelf.chain.getBlockInfo(66);
aelf.chain.getBlockInfo(66, true, async (err, result) => {
    console.log(err, result);
});
