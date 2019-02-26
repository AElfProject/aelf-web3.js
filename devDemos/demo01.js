/**
 * 
 */

const Aelf = require('../lib/aelf.js');
const wallet = Aelf.wallet.getWalletByPrivateKey('bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b');
const aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.70:8000/chain'));
// http: //192.168.197.70:8000/chain
// var aelf = new Aelf(new Aelf.providers.HttpProvider('http://34.212.171.27:8000/chain'));

aelf.chain.connectChain();

// aelf.chain.contractAt('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob', wallet);
aelf.chain.contractAtAsync('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob', wallet, (error, contract) => {
    console.log(error, contract);
});

var result = aelf.chain.getBlockInfo(5107, true);
aelf.chain.getBlockInfo(181, true, async (err, result) => {
    console.log(err, result);
});

const list = [ 
	'bd46238a6d88e9c1b62846ba9a6ce8385ed3170e3804509209ab3cae414a6f6c',
	'c4b44d24c6614b1a05932f67ffa2cfaa4600a3bf33d45a8ad4fc79915d8703d8',
	'5d0df60cf4d916a19bc7baac2c18660095db8a5992aac54bb26e034ca21af107',
	'8458ff7ea9a16cb76a573f4683e1cedc3ff9ec08b1794588087f25942d92c85e',
	'a2f46cdb440221c35ad7168cefa91f72186524ca92edc63944deed589e56c4ca',
	'6460d02998c622d1ef4989fecf80f600b639929c5afe4b44e9138e023065a44e',
	'c6ccae589e202a2138fb24389c0132cf962e8162f88863c7673ca10972e02266',
	'e984772a9cbd4f50e4c89956f60c48e42d0cadc30e81cd511cc498c5bd713121',
	'2d81c5ba51f3ec89ebf1b5b20a4b93fa2fc94ded02c6466e20d7ed2488b15a2b',
	'f06bacf18e34d8be71ea1cfbb2dfd560fde56a8a5e69e53a8734b76d3a0b559a',
	'a00ae8f6680b455267475c6fc95755c02fa50c9ede1f048feac985814c744a82',
	'106e21cf5b0bcb9593e17d9a32d72e1340cdf21896486a0e7a89bc4b61d45f91',
	'cb1678ff35872712afd2c52abd50b8ef6bb86d46e23ba7e295a068f38d10610c',
	'596827b9834db179f3c0a9b8196bf043b055a305266ad404589159318a57bd3e',
	'362a6dba2ebc3d56c537569e257bcdb1cc892ffc114cd30e721e2423a6460016',
	'8bbd4539392d6eedee6231c326a20e49f72e70616cefbbd304aa36abba0cf105',
	'e52991b74f5edc7a0bda292d395d62053d9afe69347dcaa37c5255e09d062023',
	'caff5a21ff286e5cf2fa0378eba6ea6e85a44790ae9c5677fec73f78c8208e05',
	'94659ca5e736b7cd9e05b555ed41cde8ff0ce30fdd9237cb365ca3c3f94a2897',
	'5bd116713424f806e9e3c0d43dc96bec069d85d8e0fd303bce6cd557abc77f53',
	'846b9a62687d9e00b9618ddba5e005b80e051cf1671866f1078c69419074d162',
	'a31ba7a19647fca7a76b5521862d76e6d61be328eb70c0f4b40331a2e9208796',
	'abe242502eb7ee4e0ceb9d3eb0291ef947387c1237987395e969378adfc5735d',
	'b6551e07b5e54d98a8e78881e9a332d7d3609a9885892ae1b108fa86a3ebee46',
	'fd6f59b5fe44c1ffe2950a255307ee838b3171a0e0f9deb002c1c1dc20217a5c',
	'7b8418e1d8bba7e3391e4332e3fd51de6b15fb406484311a7740cf0e184a0b84',
	'87928a01217775d49b989d009ac6ba0454070fb360bd3d63f7ba6a50cc788f49',
	'0693c3dff182f35fd23522d339aad959acc5b0f8784fc53a35dad173a2fd85f6',
	'08e043aa3745fc9ee33cc2d3694176da4364ee799901adcc66155624ebc19f9f' 
];

list.map(item => {
	aelf.chain.getTxResult(item, (error, result) => {
		console.log(' ');
		console.log(' ');
		console.log(' ');
		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
		console.log(result);
	});	
});





