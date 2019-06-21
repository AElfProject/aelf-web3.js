/**
 * @author hzz780
 * @file sha256.js
 * @description sha256 debug
 */

const AElf = require('../../lib/aelf.js');
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;

const wallet01 = Wallet.createNewWallet();
const pubkey01 = wallet01.keyPair.getPublic();
const pubKey01Encode = pubkey01.encode();
const shaResult = sha256(pubKey01Encode);
console.log(shaResult);

'04785cfcc28c451a4e8928b561586856d7c8904c01361bff88f21f09f2caa7845799ca491fcfd29cf64301aeb740f050898181499875dc7dcb4b0f31ffb020f1b1';

'9a232d90a55efe081b3944bb240dce505c876e0965c7a052ff208d459ab463c9'


'39865c025da7b3c8b2d45b54c741f62747f6775a28bc69f5e12024868352bd53'

address: '2DYZ9pj2c38K43tpufydAZYGgzShqcHBT9aBL6Z5tzbBx8kcR1',
'a02dcaab585d680e0ce7fb1f60f462c2e844d327860ac18ce8ce6ac4e4c75a05'
'a02dcaab585d680e0ce7fb1f60f462c2e844d327860ac18ce8ce6ac4e4c75a05'
'a02dcaab585d680e0ce7fb1f60f462c2e844d327860ac18ce8ce6ac4e4c75a05'