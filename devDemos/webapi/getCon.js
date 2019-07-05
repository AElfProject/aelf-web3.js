
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
    'http://103.61.37.19:8000'
));

let {
    GenesisContractAddress
} = aelf.chain.getChainStatus({
    sync: true
});

let zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
// aelf.chain.contractAtAsync(GenesisContractAddress, wallet, (err, result) => {
//     let test = 1;
//     console.log(err, result, test);
// });

// // zeroC.GetContractAddressByName('AElf.ContractNames.Consensus'); // HelloWorldContract
// let tokenContractAddress =
let tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'), {
    sync: true
});

console.log('tokenContractAddress', tokenContractAddress);
