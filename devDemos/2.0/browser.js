/**
 * @file browser.js
 * @author huangzongzhe
 */

// 65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9
var wallet = Aelf.wallet.getWalletByPrivateKey('bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b');
var aelf = new Aelf(new Aelf.providers.HttpProvider('http://192.168.197.70:8000/chain'));

// AElf.Contracts.Consensus.DPoS: "3sXEJQhEYUXaYgtdX4aePekYeM8yTkgtQ4T1wff2XhawjF6"
// AElf.Contracts.Dividends: "4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc"
// AElf.Contracts.Genesis: "61W3AF3Voud7cLY2mejzRuZ4WEN8mrDMioA9kZv3H8taKxF"
// AElf.Contracts.Resource: "2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb"
// AElf.Contracts.Token: "3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9"
// ChainId: "AELF"

// token  
// BalanceOf(address, (error, result))=>{})

// Resource  
// GetUserBalance(address, ‘RAM’, (error, result) => {})
// GetConverter(‘RAM’， (error, result) => {})

// dividends  
// GetAllAvailableDividends(publicKey, (error, result) => {})

// consensus  
// GetTicketsInformationToFriendlyString(publicKey, (error, result)  => {})

var address = '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9';

var tokenC = aelf.chain.contractAt('3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9', wallet);
var resourceC = aelf.chain.contractAt('2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb', wallet);
var dividendsC = aelf.chain.contractAt('4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc', wallet);
var consensusC = aelf.chain.contractAt('3sXEJQhEYUXaYgtdX4aePekYeM8yTkgtQ4T1wff2XhawjF6', wallet);

tokenC.BalanceOf(address, (error, result)=>{
	console.log(error, result);
});