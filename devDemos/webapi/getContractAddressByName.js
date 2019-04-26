/**
 * @file getContractAddressByName.js
 * @author huangzongzhe
 */

/* eslint-disable fecs-camelcase */
const AElf = require('../../lib/aelf.js');
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;
// address: 65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// address: 58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new AElf(new AElf.providers.HttpProvider(
    // 'http://192.168.197.56:8101/chain',
    // 'http://34.212.171.27:8000/chain',
    // 'http: //127.0.0.1:1235/chain'
    'http://192.168.197.56:8101/chain',
    // 'http://192.168.197.70:1728/chain',
    // null,
    // null,
    // null,
    // [{
    //     name: 'Accept',
    //     value: 'text/plain;v=1.0'
    // }]
));

const {
    GenesisContractAddress
} = aelf.chain.getChainStatus();

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);

// zeroC.GetContractAddressByName('AElf.ContractNames.Consensus'); // HelloWorldContract
const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token')); // HelloWorldContract

const tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);

tokenC.GetTokenInfo.call({
    symbol: 'ELF'
});

console.log(zeroC.GetContractAddressByName(sha256('HelloWorldContract'))); // HelloWorldContract
// 679ecba22edfcb0eb1e5f5b249eaea53cee1034278aa42b987d7311e51eff564
// 15aab24ec3ac12b101abf404a96ba603208631760e3eb51a1ddc18d185941b9c
// 5jszzRvXNTUj3ctzo4VnLtFSUH7fp4aHLXQQyBRPQdzw5Fw
const nameHashed = sha256('AElf.ContractNames.CrossChain');
zeroC.GetContractAddressByName.call(nameHashed);