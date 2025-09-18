import React, { useState, useEffect } from 'react';
// import AElf from 'aelf-sdk';
// import AElf from '../../../../dist/aelf.esm.js';
import { getKeystore } from 'aelf-sdk/keyStore';
import { CONFIG, getDefaultWallet } from '../config';

// const { getKeystore } = AElf.utils.keyStore;

export default function KeyStoreComponent() {
  const [wallet, setWallet] = useState(null);
  const [keyStore, setKeyStore] = useState(null);
  const [unlockedWallet, setUnlockedWallet] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    password: '123123',
    confirmPassword: '123123',
    nickName: 'My Wallet',
    cipher: 'aes-256-cbc',
    keyStoreJson: ''
  });

  // Available cipher options
  const cipherOptions = [
    'aes-128-ctr',
    'aes-128-cbc',
    'aes-192-cbc',
    'aes-256-cbc',
    'aes-128-ecb',
    'aes-192-ecb',
    'aes-256-ecb'
  ];

  // Initialize with default wallet
  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = () => {
    try {
      const walletInstance = getDefaultWallet(AElf);
      setWallet(walletInstance);
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setError('Failed to initialize wallet: ' + error.message);
    }
  };

  const createNewWallet = () => {
    try {
      const newWallet = AElf.wallet.createNewWallet();
      setWallet(newWallet);
      setError(null);
    } catch (error) {
      console.error('Failed to create new wallet:', error);
      setError('Failed to create new wallet: ' + error.message);
    }
  };

  const importWalletFromMnemonic = () => {
    try {
      if (!inputData.keyStoreJson) {
        alert('Please enter a mnemonic phrase');
        return;
      }
      const walletInstance = AElf.wallet.getWalletByMnemonic(inputData.keyStoreJson);
      if (!walletInstance) {
        alert('Invalid mnemonic phrase');
        return;
      }
      setWallet(walletInstance);
      setError(null);
    } catch (error) {
      console.error('Failed to import wallet from mnemonic:', error);
      setError('Failed to import wallet from mnemonic: ' + error.message);
    }
  };

  const generateKeyStore = () => {
    if (!wallet) {
      alert('No wallet available');
      return;
    }

    if (!inputData.password) {
      alert('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const keyStoreData = {
        mnemonic: wallet.mnemonic,
        privateKey: wallet.privateKey,
        nickName: inputData.nickName,
        address: wallet.address
      };

      const options = {
        cipher: inputData.cipher
      };

      // const keyStoreResult = AElf.utils.keyStore.getKeystore(keyStoreData, inputData.password, options);
      const keyStoreResult = getKeystore(keyStoreData, inputData.password, options);
      setKeyStore(keyStoreResult);
    } catch (error) {
      console.error('Failed to generate keyStore:', error);
      setError('Failed to generate keyStore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const unlockKeyStore = () => {
    if (!keyStore) {
      alert('No keyStore available');
      return;
    }

    if (!inputData.password) {
      alert('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const unlocked = AElf.utils.keyStore.unlockKeystore(keyStore, inputData.password);
      setUnlockedWallet(unlocked);
    } catch (error) {
      console.error('Failed to unlock keyStore:', error);
      setError('Failed to unlock keyStore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkKeyStorePassword = () => {
    if (!keyStore) {
      alert('No keyStore available');
      return;
    }

    if (!inputData.password) {
      alert('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const isValid = AElf.utils.keyStore.checkPassword(keyStore, inputData.password);
      setPasswordCheck({
        isValid,
        message: isValid ? 'Password is correct' : 'Password is incorrect'
      });
    } catch (error) {
      console.error('Failed to check password:', error);
      setError('Failed to check password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const importKeyStoreFromJson = () => {
    if (!inputData.keyStoreJson) {
      alert('Please enter keyStore JSON');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const keyStoreData = JSON.parse(inputData.keyStoreJson);
      setKeyStore(keyStoreData);
    } catch (error) {
      console.error('Failed to import keyStore from JSON:', error);
      setError('Failed to import keyStore from JSON: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportKeyStore = () => {
    if (!keyStore) {
      alert('No keyStore available to export');
      return;
    }

    try {
      const keyStoreString = JSON.stringify(keyStore, null, 2);
      setInputData(prev => ({ ...prev, keyStoreJson: keyStoreString }));
    } catch (error) {
      console.error('Failed to export keyStore:', error);
      setError('Failed to export keyStore: ' + error.message);
    }
  };

  const downloadKeyStore = () => {
    if (!keyStore) {
      alert('No keyStore available to download');
      return;
    }

    try {
      const keyStoreString = JSON.stringify(keyStore, null, 2);
      const blob = new Blob([keyStoreString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keystore-${inputData.nickName || 'wallet'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download keyStore:', error);
      setError('Failed to download keyStore: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const setDefaultValues = () => {
    setInputData(prev => ({
      ...prev,
      password: '123123',
      confirmPassword: '123123',
      nickName: 'My Wallet',
      cipher: 'aes-256-cbc'
    }));
  };

  return (
    <div className="info-card">
      <h2>KeyStore Management</h2>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => setError(null)}>Clear Error</button>
        </div>
      )}

      {/* Wallet Management */}
      <div className="section">
        <h3>Wallet Management</h3>
        <div className="button-group">
          <button onClick={createNewWallet}>Create New Wallet</button>
          <button onClick={initializeWallet}>Load Default Wallet</button>
        </div>

        {wallet && (
          <div className="result">
            <h4>Current Wallet:</h4>
            <p><strong>Address:</strong> {wallet.address}</p>
            <p><strong>Private Key:</strong> {wallet.privateKey}</p>
            <p><strong>Mnemonic:</strong> {wallet.mnemonic}</p>
          </div>
        )}

        <div className="input-group">
          <label>Import from Mnemonic:</label>
          <textarea
            value={inputData.keyStoreJson}
            onChange={(e) => handleInputChange('keyStoreJson', e.target.value)}
            placeholder="Enter mnemonic phrase to import wallet"
            rows="3"
          />
          <button onClick={importWalletFromMnemonic}>Import Wallet</button>
        </div>
      </div>

      {/* KeyStore Generation */}
      <div className="section">
        <h3>KeyStore Generation</h3>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={inputData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password for keyStore"
          />
        </div>

        <div className="input-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={inputData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
          />
        </div>

        <div className="input-group">
          <label>Nickname:</label>
          <input
            type="text"
            value={inputData.nickName}
            onChange={(e) => handleInputChange('nickName', e.target.value)}
            placeholder="Enter wallet nickname"
          />
        </div>

        <div className="input-group">
          <label>Cipher:</label>
          <select
            value={inputData.cipher}
            onChange={(e) => handleInputChange('cipher', e.target.value)}
          >
            {cipherOptions.map(cipher => (
              <option key={cipher} value={cipher}>{cipher}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button onClick={setDefaultValues}>Set Default Values</button>
          <button onClick={generateKeyStore} disabled={!wallet || loading}>
            {loading ? 'Generating...' : 'Generate KeyStore'}
          </button>
        </div>

        {keyStore && (
          <div className="result">
            <h4>Generated KeyStore:</h4>
            <div className="keystore-info">
              <p><strong>Version:</strong> {keyStore.version}</p>
              <p><strong>Cipher:</strong> {keyStore.crypto.cipher}</p>
              <p><strong>KDF:</strong> {keyStore.crypto.kdf}</p>
              <p><strong>Nickname:</strong> {keyStore.nickName || 'N/A'}</p>
              <p><strong>Address:</strong> {keyStore.address || 'N/A'}</p>
            </div>
            <div className="button-group">
              <button onClick={exportKeyStore}>Export to Text Area</button>
              <button onClick={downloadKeyStore}>Download KeyStore File</button>
            </div>
          </div>
        )}
      </div>

      {/* KeyStore Operations */}
      <div className="section">
        <h3>KeyStore Operations</h3>
        <div className="input-group">
          <label>KeyStore JSON:</label>
          <textarea
            value={inputData.keyStoreJson}
            onChange={(e) => handleInputChange('keyStoreJson', e.target.value)}
            placeholder="Enter keyStore JSON or import from file"
            rows="8"
          />
        </div>

        <div className="button-group">
          <button onClick={importKeyStoreFromJson} disabled={loading}>
            {loading ? 'Importing...' : 'Import KeyStore from JSON'}
          </button>
          <button onClick={checkKeyStorePassword} disabled={!keyStore || loading}>
            {loading ? 'Checking...' : 'Check Password'}
          </button>
          <button onClick={unlockKeyStore} disabled={!keyStore || loading}>
            {loading ? 'Unlocking...' : 'Unlock KeyStore'}
          </button>
        </div>

        {passwordCheck && (
          <div className="result">
            <p className={passwordCheck.isValid ? 'success' : 'error'}>
              <strong>Password Check:</strong> {passwordCheck.message}
            </p>
          </div>
        )}

        {unlockedWallet && (
          <div className="result">
            <h4>Unlocked Wallet:</h4>
            <div className="wallet-info">
              <p><strong>Private Key:</strong> {unlockedWallet.privateKey}</p>
              <p><strong>Mnemonic:</strong> {unlockedWallet.mnemonic}</p>
              <p><strong>Nickname:</strong> {unlockedWallet.nickName || 'N/A'}</p>
              <p><strong>Address:</strong> {unlockedWallet.address || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* KeyStore Information */}
      <div className="section">
        <h3>KeyStore Information</h3>
        <div className="info-content">
          <h4>Supported Cipher Algorithms:</h4>
          <ul>
            <li><strong>AES-128-CTR:</strong> Default cipher, good balance of security and performance</li>
            <li><strong>AES-128-CBC:</strong> Cipher Block Chaining mode with 128-bit key</li>
            <li><strong>AES-192-CBC:</strong> Cipher Block Chaining mode with 192-bit key</li>
            <li><strong>AES-256-CBC:</strong> Cipher Block Chaining mode with 256-bit key (recommended)</li>
            <li><strong>AES-128-ECB:</strong> Electronic Codebook mode with 128-bit key</li>
            <li><strong>AES-192-ECB:</strong> Electronic Codebook mode with 192-bit key</li>
            <li><strong>AES-256-ECB:</strong> Electronic Codebook mode with 256-bit key</li>
          </ul>

          <h4>KeyStore Structure:</h4>
          <ul>
            <li><strong>Version:</strong> KeyStore format version</li>
            <li><strong>Crypto:</strong> Encryption parameters and encrypted data</li>
            <li><strong>Nickname:</strong> Optional wallet nickname</li>
            <li><strong>Address:</strong> Wallet address for identification</li>
          </ul>

          <h4>Security Features:</h4>
          <ul>
            <li><strong>Scrypt KDF:</strong> Key derivation function for password-based encryption</li>
            <li><strong>MAC:</strong> Message Authentication Code for integrity verification</li>
            <li><strong>Salt:</strong> Random salt for key derivation</li>
            <li><strong>IV:</strong> Initialization vector for encryption</li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button onClick={() => handleInputChange('cipher', 'aes-256-cbc')}>
            Set AES-256-CBC (Recommended)
          </button>
          <button onClick={() => handleInputChange('cipher', 'aes-128-ctr')}>
            Set AES-128-CTR (Default)
          </button>
          <button onClick={() => handleInputChange('password', '123123')}>
            Set Test Password
          </button>
        </div>
      </div>
    </div>
  );
}
