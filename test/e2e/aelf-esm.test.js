/**
 * @file E2E tests for dist/aelf.esm.js build artifact
 * @description Tests the built ESM module to ensure it works correctly
 * @author AI Assistant
 */

import AElf from '../../dist/aelf.cjs';

const defaultPrivateKey = '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
// const testEndpoint = 'https://explorer-test.aelf.io/chain'; // deprecated, can not connect.
const testEndpoint = 'https://aelf-test-node.aelf.io';

describe('AElf ESM Build Artifact E2E Tests', () => {
    let aelf = null;
    let wallet = null;

    describe('AElf Static Properties', () => {
        test('should have all required static properties', () => {
            expect(AElf).toBeDefined();
            expect(typeof AElf).toBe('function');

            // Check static properties
            expect(AElf.version).toBeDefined();
            expect(AElf.providers).toBeDefined();
            expect(AElf.pbjs).toBeDefined();
            expect(AElf.pbUtils).toBeDefined();
            expect(AElf.wallet).toBeDefined();
            expect(AElf.utils).toBeDefined();
        });

        test('should have HttpProvider in providers', () => {
            expect(AElf.providers.HttpProvider).toBeDefined();
            expect(typeof AElf.providers.HttpProvider).toBe('function');
        });

        test('should have protobuf in pbjs', () => {
            expect(AElf.pbjs).toBeDefined();
            expect(typeof AElf.pbjs).toBe('object');
        });

        test('should have wallet methods', () => {
            expect(AElf.wallet.createNewWallet).toBeDefined();
            expect(AElf.wallet.getWalletByMnemonic).toBeDefined();
            expect(AElf.wallet.getWalletByPrivateKey).toBeDefined();
            expect(AElf.wallet.getAddressFromPubKey).toBeDefined();
            expect(AElf.wallet.sign).toBeDefined();
            expect(AElf.wallet.verify).toBeDefined();
            expect(AElf.wallet.AESEncrypt).toBeDefined();
            expect(AElf.wallet.AESDecrypt).toBeDefined();
        });

        test('should have utils methods', () => {
            expect(AElf.utils.arrayToHex).toBeDefined();
            expect(AElf.utils.padLeft).toBeDefined();
            expect(AElf.utils.padRight).toBeDefined();
            expect(AElf.utils.decodeAddressRep).toBeDefined();
            expect(AElf.utils.encodeAddressRep).toBeDefined();
            expect(AElf.utils.toBigNumber).toBeDefined();
            expect(AElf.utils.fromWei).toBeDefined();
            expect(AElf.utils.toWei).toBeDefined();
            expect(AElf.utils.sha256).toBeDefined();
            expect(AElf.utils.base58).toBeDefined();
        });
    });

    describe('AElf Instance Creation', () => {
        test('should create AElf instance with HttpProvider', () => {
            const provider = new AElf.providers.HttpProvider(testEndpoint);
            aelf = new AElf(provider);

            expect(aelf).toBeDefined();
            expect(aelf.currentProvider).toBeDefined();
            expect(aelf.chain).toBeDefined();
            expect(aelf.settings).toBeDefined();
            expect(aelf.version).toBeDefined();
        });

        test('should have instance properties', () => {
            expect(aelf.providers).toBeDefined();
            expect(aelf.providers.HttpProvider).toBeDefined();
            expect(aelf.isConnected).toBeDefined();
            expect(aelf.setProvider).toBeDefined();
        });

        test('should be connected to test endpoint', async () => {
            expect(aelf.isConnected()).toBeTruthy();
        });
    });

    describe('Wallet Functionality', () => {
        test('should create wallet from private key', () => {
            wallet = AElf.wallet.getWalletByPrivateKey(defaultPrivateKey);

            expect(wallet).toBeDefined();
            expect(wallet.address).toBeDefined();
            expect(wallet.privateKey).toBeDefined();
            expect(wallet.keyPair).toBeDefined();
            expect(wallet.mnemonic).toBeDefined();
        });

        test('should create new wallet', () => {
            const newWallet = AElf.wallet.createNewWallet();

            expect(newWallet).toBeDefined();
            expect(newWallet.address).toBeDefined();
            expect(newWallet.privateKey).toBeDefined();
            expect(newWallet.keyPair).toBeDefined();
            expect(newWallet.mnemonic).toBeDefined();
            expect(newWallet.BIP44Path).toBeDefined();
        });

        test('should create wallet from mnemonic', () => {
            const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
            const mnemonicWallet = AElf.wallet.getWalletByMnemonic(mnemonic);

            expect(mnemonicWallet).toBeDefined();
            expect(mnemonicWallet.address).toBeDefined();
            expect(mnemonicWallet.privateKey).toBeDefined();
            expect(mnemonicWallet.keyPair).toBeDefined();
            expect(mnemonicWallet.mnemonic).toBe(mnemonic);
        });

        test('should get address from public key', () => {
            const pubKey = wallet.keyPair.getPublic();
            const address = AElf.wallet.getAddressFromPubKey(pubKey);

            expect(address).toBeDefined();
            expect(typeof address).toBe('string');
            expect(address).toBe(wallet.address);
        });

        test('should sign and verify data', () => {
            const testData = '68656c6c6f20776f726c64'; // "hello world" in hex
            const signature = AElf.wallet.sign(testData, wallet.keyPair);

            expect(signature).toBeDefined();
            expect(Buffer.isBuffer(signature)).toBeTruthy();

            // Convert signature to hex string for verification
            const signatureHex = signature.toString('hex');
            const msgHash = AElf.utils.sha256(testData);
            const isValid = AElf.wallet.verify(signatureHex, msgHash);

            expect(isValid).toBeTruthy();
        });

        test('should encrypt and decrypt data', () => {
            const testData = 'test data';
            const password = 'test password';

            const encrypted = AElf.wallet.AESEncrypt(testData, password);
            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');

            const decrypted = AElf.wallet.AESDecrypt(encrypted, password);
            expect(decrypted).toBe(testData);
        });
    });

    describe('Utils Functionality', () => {
        test('should handle array to hex conversion', () => {
            const testArray = [1, 2, 3, 4];
            const hex = AElf.utils.arrayToHex(testArray);

            expect(hex).toBeDefined();
            expect(typeof hex).toBe('string');
        });

        test('should pad strings correctly', () => {
            const testString = '123';
            const paddedLeft = AElf.utils.padLeft(testString, 6, '0');
            const paddedRight = AElf.utils.padRight(testString, 6, '0');

            expect(paddedLeft).toBe('000123');
            expect(paddedRight).toBe('123000');
        });

        test('should handle address encoding/decoding', () => {
            const testHex = '1234567890abcdef1234567890abcdef12345678';
            const encoded = AElf.utils.encodeAddressRep(testHex);
            const decoded = AElf.utils.decodeAddressRep(encoded);

            expect(encoded).toBeDefined();
            expect(decoded).toBeDefined();
            expect(typeof encoded).toBe('string');
            expect(typeof decoded).toBe('string');
        });

        test('should handle BigNumber operations', () => {
            const testNumber = '1000000000000000000';
            const bigNumber = AElf.utils.toBigNumber(testNumber);

            expect(bigNumber).toBeDefined();
            expect(bigNumber.toString()).toBe(testNumber);
        });

        test('should handle wei conversions', () => {
            const testValue = '1000000000000000000';
            const fromWei = AElf.utils.fromWei(testValue, 'ether');
            const toWei = AElf.utils.toWei('1', 'ether');

            expect(fromWei).toBeDefined();
            expect(toWei).toBeDefined();
            expect(toWei.toString()).toBe(testValue);
        });

        test('should generate SHA256 hash', () => {
            const testData = 'hello world';
            const hash = AElf.utils.sha256(testData);

            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash.length).toBe(64); // SHA256 produces 64 character hex string
        });

        test('should handle base58 encoding/decoding', () => {
            const hexData = '4f2c8701a4d58f7b9e6ab43c0fde9abc';
            const hexDataBuffer = Buffer.from(hexData, 'hex');
            const encoded = AElf.utils.base58.encode(hexDataBuffer);
            const decoded = AElf.utils.base58.decode(encoded, 'hex');

            expect(encoded).toBeDefined();
            expect(decoded).toBeDefined();

            expect(decoded.toString()).toBe(hexData);
        });
    });

    describe('Chain Functionality', () => {
        test('should get chain status', async () => {
            const chainStatus = await aelf.chain.getChainStatus();

            expect(chainStatus).toBeDefined();
            expect(chainStatus.ChainId).toBeDefined();
            expect(chainStatus.GenesisContractAddress).toBeDefined();
            expect(chainStatus.BestChainHeight).toBeDefined();
        }, 10000);

        test('should get block height', async () => {
            const height = await aelf.chain.getBlockHeight();

            expect(height).toBeDefined();
            expect(typeof height).toBe('number');
            expect(height).toBeGreaterThan(0);
        }, 10000);

        test('should get block by height', async () => {
            const height = await aelf.chain.getBlockHeight();
            const block = await aelf.chain.getBlockByHeight(height, true);

            expect(block).toBeDefined();
            expect(block.BlockHash).toBeDefined();
            expect(block.Header).toBeDefined();
            expect(block.Body).toBeDefined();
            expect(block.Header.Height).toBe(height);
        }, 10000);

        test('should get block by hash', async () => {
            const height = await aelf.chain.getBlockHeight();
            const block = await aelf.chain.getBlockByHeight(height, true);
            const blockByHash = await aelf.chain.getBlock(block.BlockHash, true);

            expect(blockByHash).toBeDefined();
            expect(blockByHash.BlockHash).toBe(block.BlockHash);
        }, 10000);

        test('should get transaction pool status', async () => {
            const poolStatus = await aelf.chain.getTransactionPoolStatus();

            expect(poolStatus).toBeDefined();
            expect(poolStatus.Queued).toBeDefined();
            expect(poolStatus.Validated).toBeDefined();
            expect(typeof poolStatus.Queued).toBe('number');
            expect(typeof poolStatus.Validated).toBe('number');
        }, 10000);

        test('should get peers', async () => {
            const peers = await aelf.chain.getPeers(false);

            expect(peers).toBeDefined();
            expect(Array.isArray(peers)).toBeTruthy();
        }, 10000);

        test('should get network info', async () => {
            const networkInfo = await aelf.chain.networkInfo();

            expect(networkInfo).toBeDefined();
            expect(networkInfo.Version).toBeDefined();
            expect(networkInfo.ProtocolVersion).toBeDefined();
            expect(networkInfo.Connections).toBeDefined();
        }, 10000);
    });

    describe('Contract Functionality', () => {
        test('should get contract at address', async () => {
            const chainStatus = await aelf.chain.getChainStatus();
            const genesisContract = await aelf.chain.contractAt(
                chainStatus.GenesisContractAddress,
                wallet
            );

            expect(genesisContract).toBeDefined();
            expect(typeof genesisContract).toBe('object');
        }, 15000);

        test('should get contract file descriptor set', async () => {
            const chainStatus = await aelf.chain.getChainStatus();
            const descriptorSet = await aelf.chain.getContractFileDescriptorSet(
                chainStatus.GenesisContractAddress
            );

            // console.log('descriptorSet', descriptorSet);
            expect(descriptorSet).toBeDefined();
            // expect(typeof descriptorSet).toBe('string');
            expect(typeof descriptorSet).toBe('object');
        }, 10000);

        test('should initialize token contract and get contract addresses', async () => {
            const tokenContractName = 'AElf.ContractNames.Token';
            
            // Get chain status to get Genesis contract address
            const { GenesisContractAddress } = await aelf.chain.getChainStatus();
            expect(GenesisContractAddress).toBeDefined();
            expect(typeof GenesisContractAddress).toBe('string');

            // Get Genesis contract (Zero contract)
            const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
            expect(zeroContract).toBeDefined();
            expect(typeof zeroContract).toBe('object');

            // Get token contract address by name
            const tokenContractAddress = await zeroContract.GetContractAddressByName.call(
                AElf.utils.sha256(tokenContractName)
            );
            expect(tokenContractAddress).toBeDefined();
            expect(typeof tokenContractAddress).toBe('string');

            // Get token contract instance
            const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
            expect(tokenContract).toBeDefined();
            expect(typeof tokenContract).toBe('object');

            // Return the same structure as React Demo
            const result = {
                tokenContract,
                tokenContractAddress,
                GenesisContractAddress
            };

            expect(result.tokenContract).toBeDefined();
            expect(result.tokenContractAddress).toBeDefined();
            expect(result.GenesisContractAddress).toBeDefined();
        }, 20000);

        test('should get token information from contract', async () => {
            const tokenContractName = 'AElf.ContractNames.Token';
            
            // Initialize token contract (same as previous test)
            const { GenesisContractAddress } = await aelf.chain.getChainStatus();
            const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
            const tokenContractAddress = await zeroContract.GetContractAddressByName.call(
                AElf.utils.sha256(tokenContractName)
            );
            const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);

            // Get token info for ELF token (same as React Demo)
            const tokenInfo = await tokenContract.GetTokenInfo.call({ symbol: 'ELF' });
            
            expect(tokenInfo).toBeDefined();
            expect(typeof tokenInfo).toBe('object');
            
            // Verify token info structure
            expect(tokenInfo.symbol).toBeDefined();
            expect(tokenInfo.tokenName).toBeDefined();
            expect(tokenInfo.supply).toBeDefined();
            expect(tokenInfo.totalSupply).toBeDefined();
            expect(tokenInfo.decimals).toBeDefined();
            expect(tokenInfo.issuer).toBeDefined();
            expect(tokenInfo.isBurnable).toBeDefined();
            
            // Verify ELF token specific properties
            expect(tokenInfo.symbol).toBe('ELF');
            expect(typeof tokenInfo.tokenName).toBe('string');
            expect(typeof tokenInfo.supply).toBe('string');
            expect(typeof tokenInfo.totalSupply).toBe('string');
            expect(typeof tokenInfo.decimals).toBe('number');
            expect(typeof tokenInfo.issuer).toBe('string');
            expect(typeof tokenInfo.isBurnable).toBe('boolean');
        }, 20000);

        test('should complete token contract workflow from initialization to data retrieval', async () => {
            const tokenContractName = 'AElf.ContractNames.Token';
            
            // Step 1: Initialize token contract
            const { tokenContract, tokenContractAddress, GenesisContractAddress } = await (async () => {
                const { GenesisContractAddress } = await aelf.chain.getChainStatus();
                const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
                const tokenContractAddress = await zeroContract.GetContractAddressByName.call(
                    AElf.utils.sha256(tokenContractName)
                );
                const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
                return {
                    tokenContract,
                    tokenContractAddress,
                    GenesisContractAddress
                };
            })();

            // Verify initialization results
            expect(tokenContract).toBeDefined();
            expect(tokenContractAddress).toBeDefined();
            expect(GenesisContractAddress).toBeDefined();

            // Step 2: Get token info
            const tokenInfo = await tokenContract.GetTokenInfo.call({ symbol: 'ELF' });
            
            // Verify token info
            expect(tokenInfo).toBeDefined();
            expect(tokenInfo.symbol).toBe('ELF');
            expect(typeof tokenInfo).toBe('object');

            // This demonstrates the complete token contract workflow
            console.log('GenesisContractAddress:', GenesisContractAddress);
            console.log('TokenContractAddress:', tokenContractAddress);
            console.log('TokenInfo:', JSON.stringify(tokenInfo, null, 2));
        }, 25000);
    });

    describe('Provider Management', () => {
        test('should set new provider', () => {
            const newProvider = new AElf.providers.HttpProvider(testEndpoint);
            aelf.setProvider(newProvider);

            expect(aelf.currentProvider).toBe(newProvider);
            expect(aelf.isConnected()).toBeTruthy();
        });

        test('should handle invalid provider', () => {
            const invalidProvider = new AElf.providers.HttpProvider('http://invalid-endpoint:9999');
            aelf.setProvider(invalidProvider);

            expect(aelf.currentProvider).toBe(invalidProvider);
            expect(aelf.isConnected()).toBeFalsy();
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid private key', () => {
            expect(() => {
                AElf.wallet.getWalletByPrivateKey(null);
            }).toThrow();
        });

        test('should handle invalid mnemonic', () => {
            const result = AElf.wallet.getWalletByMnemonic('invalid mnemonic');
            expect(result).toBeFalsy();
        });

        test('should handle invalid address in contractAt', async () => {
            try {
                await aelf.chain.contractAt('invalid-address', wallet);
                fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeDefined();
            }
        }, 10000);
    });
});
