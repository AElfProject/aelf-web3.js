var Aelf = require('../lib/aelf.js');
// var wallet = wal.getWalletByPrivateKey('bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b');
var aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.199.210:5000/chain'));

aelf.chain.connectChain();

// TODO: 需要签名这个交易才能使用sendTransaction
aelf.chain.sendTransaction({
    "from": "ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs",
    "to": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
    "method": "TotalSupply"
});
