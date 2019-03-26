const Aelf = require('../lib/aelf.js');
var aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.199.210:5000/chain'));
aelf.chain.connectChain();
var wallet = Aelf.wallet.getWalletByPrivateKey('0d61b93aa158ee0c7c8876d642689ef6f3663bfb382da1061176a3c6ce89e79b');
var resourceC = aelf.chain.contractAt('ELF_4CBbRKd6rkCzTX5aJ2mnGrwJiHLmGdJZinoaVfMvScTEoBR', wallet);

resourceC.GetFeeAddress((error, item) => {
    console.log(error, item);
});