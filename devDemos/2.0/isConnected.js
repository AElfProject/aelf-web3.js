/**
 * @file demo01.js
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
const Aelf = require('../../lib/aelf.js');
// const Wallet = require('../../lib/aelf/wallet');

// address: 65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9
// const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

// address: 58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
// const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';
// tx of transfer: a6faed817ab73a3c664f5dfbf68a979a5f2eee8d952a7220766dbb4f03252432

// const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.199.113:8000/chain'));

aelf.isConnected();
