/**
 * @file demo01.js
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
const Aelf = require('../../lib/aelf.js');
const Wallet = require('../../lib/aelf/wallet');

// address: 65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

// address: 58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';
// tx of transfer: a6faed817ab73a3c664f5dfbf68a979a5f2eee8d952a7220766dbb4f03252432

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

// const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.56:8000/chain'));http://192.168.197.56:8101/chain
// const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.56:8101/chain'));
const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.70:8000/chain'));

const tokenC = aelf.chain.contractAt('4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc', wallet);

tokenC.GetBalance({symbol:'AELF', owner: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'});
console.log(11111);
tokenC.GetBalance.call({
    symbol: 'ELF',
    owner: '58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn'
}, (err, result) => {
    
    console.log(err, result);
})
/* eslint-enable */
tokenC.Transfer({
    symbol: 'ELF',
    to: '58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn',
    amount: '1000'
});

// 不再使用 aelf.chain.connectChain();
let chainInformation = aelf.chain.getChainInformation();

let zeroContract = aelf.chain.contractAt(chainInformation.GenesisContractAddress, wallet);
// var protobuf = require('@aelfqueen/protobufjs');
// var commonProto = require('../../lib/aelf/proto/common.proto.json');
// var HashMessage = protobuf.Root.fromJSON(commonProto).Hash;
// var nameHash = HashMessage.encode(Buffer.from('AElf.Contracts.MultiToken'));
// zeroContract.GetContractAddressByName.call(Buffer.from('AElf.Contracts.MultiToken'));
zeroContract.GetContractAddressByName.call('41456c662e436f6e7472616374732e4d756c7469546f6b656e');

// const resourceC = aelf.chain.contractAt('2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb', wallet);

// tokenC.Symbol();
// tokenC.BalanceOf('65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9');
// aelf.chain.getBlockInfo('4137', true);
// // 1089, 4137
// // 6823187769516bd9f7a1e15f58cbba8c9613262b6cc196cd3488ecdb5ae1177c
// var txsResults;
// aelf.chain.getTxsResult(
//     '63af6a24bc6e41915b3b3042dabc3b2e2c47cb6fcab7f50f0971bc1bdaa9f7cf',
//     0,
//     100,
//     function (error, result) {
//         console.log('tx result: ', error, result);
//         txsResults = result;
//     }
// );

// aelf.chain.getTxResult('70d3db416a0fc3b96f383f9dcc7bc27909eeef3d54bd5869479e6c9486bb0912').Transaction;

// // Resource
// const resourceC = aelf.chain.contractAt('2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb', wallet);
// resourceC.GetElfBalance('RAM');
// resourceC.GetUserBalance('286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc', 'CPU');
