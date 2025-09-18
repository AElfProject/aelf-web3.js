import React, { useState, useEffect } from 'react';
import AElf from 'aelf-sdk';
import { CONFIG } from '../config';

const Wallet = AElf.wallet;
const { sha256 } = AElf.utils;

export default function WalletComponent() {
  const [currentWallet, setCurrentWallet] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [signatureResult, setSignatureResult] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [decryptionResult, setDecryptionResult] = useState(null);
  const [inputData, setInputData] = useState({
    privateKey: CONFIG.DEFAULT_PRIVATE_KEY,
    mnemonic: CONFIG.TEST_MNEMONIC,
    testData: CONFIG.TEST_VALUES.TEST_DATA,
    password: CONFIG.TEST_VALUES.ENCRYPTION_PASSWORD,
    encryptData: CONFIG.TEST_VALUES.ENCRYPTION_DATA
  });

  // Initialize with default wallet
  useEffect(() => {
    initializeDefaultWallet();
  }, []);

  const initializeDefaultWallet = () => {
    try {
      const wallet = Wallet.getWalletByPrivateKey(CONFIG.DEFAULT_PRIVATE_KEY);
      setCurrentWallet(wallet);
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        mnemonic: wallet.mnemonic,
        BIP44Path: wallet.BIP44Path
      });
    } catch (error) {
      console.error('Failed to initialize default wallet:', error);
    }
  };

  const createNewWallet = () => {
    try {
      const newWallet = Wallet.createNewWallet();
      setCurrentWallet(newWallet);
      setWalletInfo({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        publicKey: newWallet.publicKey,
        mnemonic: newWallet.mnemonic,
        BIP44Path: newWallet.BIP44Path
      });
      setInputData(prev => ({ ...prev, privateKey: newWallet.privateKey }));
    } catch (error) {
      console.error('Failed to create new wallet:', error);
      alert('Failed to create new wallet: ' + error.message);
    }
  };

  const importWalletFromPrivateKey = () => {
    try {
      if (!inputData.privateKey) {
        alert('Please enter a private key');
        return;
      }
      const wallet = Wallet.getWalletByPrivateKey(inputData.privateKey);
      setCurrentWallet(wallet);
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        mnemonic: wallet.mnemonic,
        BIP44Path: wallet.BIP44Path
      });
    } catch (error) {
      console.error('Failed to import wallet from private key:', error);
      alert('Failed to import wallet: ' + error.message);
    }
  };

  const importWalletFromMnemonic = () => {
    try {
      if (!inputData.mnemonic) {
        alert('Please enter a mnemonic');
        return;
      }
      const wallet = Wallet.getWalletByMnemonic(inputData.mnemonic);
      if (!wallet) {
        alert('Invalid mnemonic');
        return;
      }
      setCurrentWallet(wallet);
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        mnemonic: wallet.mnemonic,
        BIP44Path: wallet.BIP44Path
      });
      setInputData(prev => ({ ...prev, privateKey: wallet.privateKey }));
    } catch (error) {
      console.error('Failed to import wallet from mnemonic:', error);
      alert('Failed to import wallet: ' + error.message);
    }
  };

  const getAddressFromPublicKey = () => {
    if (!currentWallet) {
      alert('No wallet loaded');
      return;
    }
    try {
      const pubKey = currentWallet.keyPair.getPublic();
      const address = Wallet.getAddressFromPubKey(pubKey);
      alert(`Address from public key: ${address}\nMatches current address: ${address === currentWallet.address}`);
    } catch (error) {
      console.error('Failed to get address from public key:', error);
      alert('Failed to get address from public key: ' + error.message);
    }
  };

  const signData = () => {
    if (!currentWallet) {
      alert('No wallet loaded');
      return;
    }
    try {
      const signature = Wallet.sign(inputData.testData, currentWallet.keyPair);
      setSignatureResult({
        signature: signature.toString('hex'),
        data: inputData.testData
      });
    } catch (error) {
      console.error('Failed to sign data:', error);
      alert('Failed to sign data: ' + error.message);
    }
  };

  const verifySignature = () => {
    if (!signatureResult) {
      alert('Please sign data first');
      return;
    }
    try {
      const msgHash = sha256(signatureResult.data);
      const isValid = Wallet.verify(signatureResult.signature, msgHash);
      setVerificationResult({
        isValid,
        message: isValid ? 'Signature is valid' : 'Signature is invalid'
      });
    } catch (error) {
      console.error('Failed to verify signature:', error);
      alert('Failed to verify signature: ' + error.message);
    }
  };

  const encryptData = () => {
    try {
      const encrypted = Wallet.AESEncrypt(inputData.encryptData, inputData.password);
      setEncryptionResult({
        encrypted,
        originalData: inputData.encryptData,
        password: inputData.password
      });
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      alert('Failed to encrypt data: ' + error.message);
    }
  };

  const decryptData = () => {
    if (!encryptionResult) {
      alert('Please encrypt data first');
      return;
    }
    try {
      const decrypted = Wallet.AESDecrypt(encryptionResult.encrypted, encryptionResult.password);
      setDecryptionResult({
        decrypted,
        matches: decrypted === encryptionResult.originalData
      });
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      alert('Failed to decrypt data: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="info-card">
      <h2>Wallet Management</h2>

      {/* Wallet Creation and Import */}
      <div className="section">
        <h3>Create/Import Wallet</h3>
        <div className="button-group">
          <button onClick={createNewWallet}>Create New Wallet</button>
          <button onClick={initializeDefaultWallet}>Load Default Wallet</button>
        </div>

        <div className="input-group">
          <label>Private Key:</label>
          <input
            type="text"
            value={inputData.privateKey}
            onChange={(e) => handleInputChange('privateKey', e.target.value)}
            placeholder="Enter private key"
          />
          <button onClick={importWalletFromPrivateKey}>Import from Private Key</button>
        </div>

        <div className="input-group">
          <label>Mnemonic:</label>
          <textarea
            value={inputData.mnemonic}
            onChange={(e) => handleInputChange('mnemonic', e.target.value)}
            placeholder="Enter mnemonic phrase"
            rows="3"
          />
          <button onClick={importWalletFromMnemonic}>Import from Mnemonic</button>
        </div>
      </div>

      {/* Current Wallet Info */}
      {walletInfo && (
        <div className="section">
          <h3>Current Wallet Info</h3>
          <div className="wallet-info">
            <p><strong>Address:</strong> {walletInfo.address}</p>
            <p><strong>Private Key:</strong> {walletInfo.privateKey}</p>
            <p><strong>Public Key:</strong> {walletInfo.publicKey}</p>
            <p><strong>Mnemonic:</strong> {walletInfo.mnemonic}</p>
            <p><strong>BIP44 Path:</strong> {walletInfo.BIP44Path}</p>
          </div>
          <button onClick={getAddressFromPublicKey}>Get Address from Public Key</button>
        </div>
      )}

      {/* Signing and Verification */}
      <div className="section">
        <h3>Signing & Verification</h3>
        <div className="input-group">
          <label>Test Data (hex):</label>
          <input
            type="text"
            value={inputData.testData}
            onChange={(e) => handleInputChange('testData', e.target.value)}
            placeholder="Enter hex data to sign"
          />
          <button onClick={signData} disabled={!currentWallet}>Sign Data</button>
        </div>

        {signatureResult && (
          <div className="result">
            <p><strong>Signature:</strong> {signatureResult.signature}</p>
            <button onClick={verifySignature}>Verify Signature</button>
          </div>
        )}

        {verificationResult && (
          <div className="result">
            <p className={verificationResult.isValid ? 'success' : 'error'}>
              {verificationResult.message}
            </p>
          </div>
        )}
      </div>

      {/* Encryption and Decryption */}
      <div className="section">
        <h3>Encryption & Decryption</h3>
        <div className="input-group">
          <label>Data to Encrypt:</label>
          <input
            type="text"
            value={inputData.encryptData}
            onChange={(e) => handleInputChange('encryptData', e.target.value)}
            placeholder="Enter data to encrypt"
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={inputData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password"
          />
          <button onClick={encryptData}>Encrypt</button>
        </div>

        {encryptionResult && (
          <div className="result">
            <p><strong>Encrypted:</strong> {encryptionResult.encrypted}</p>
            <button onClick={decryptData}>Decrypt</button>
          </div>
        )}

        {decryptionResult && (
          <div className="result">
            <p><strong>Decrypted:</strong> {decryptionResult.decrypted}</p>
            <p className={decryptionResult.matches ? 'success' : 'error'}>
              {decryptionResult.matches ? 'Decryption successful' : 'Decryption failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
