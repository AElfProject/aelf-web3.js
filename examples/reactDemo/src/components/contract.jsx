import React, { useState, useEffect } from 'react';
import AElf from 'aelf-sdk';
import { CONFIG, createAElfInstance, getDefaultWallet } from '../config';

const Wallet = AElf.wallet;
const { sha256 } = AElf.utils;

export default function Contract() {
  const [aelf, setAelf] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [genesisContractAddress, setGenesisContractAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contractMethods, setContractMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    symbol: 'ELF',
    owner: '',
    to: '',
    amount: '10000000',
    memo: ''
  });

  // Initialize AElf and wallet
  useEffect(() => {
    initializeAElf();
  }, []);

  const initializeAElf = async () => {
    try {
      const aelfInstance = createAElfInstance(AElf);
      const walletInstance = getDefaultWallet(AElf);

      setAelf(aelfInstance);
      setWallet(walletInstance);
      setInputData(prev => ({ ...prev, owner: walletInstance.address }));
    } catch (error) {
      console.error('Failed to initialize AElf:', error);
      setError('Failed to initialize AElf: ' + error.message);
    }
  };

  const getTokenContract = async () => {
    if (!aelf || !wallet) return;

    try {
      setLoading(true);
      setError(null);

      const { GenesisContractAddress } = await aelf.chain.getChainStatus();
      const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
      const tokenContractAddress = await zeroContract.GetContractAddressByName.call(sha256(CONFIG.CONTRACT_NAMES.TOKEN));
      const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);

      setTokenContract(tokenContract);
      setTokenContractAddress(tokenContractAddress);
      setGenesisContractAddress(GenesisContractAddress);

      // Get available methods
      const descriptorSet = await aelf.chain.getContractFileDescriptorSet(tokenContractAddress);
      if (descriptorSet && descriptorSet.services) {
        const methods = [];
        descriptorSet.services.forEach(service => {
          if (service.methods) {
            Object.keys(service.methods).forEach(methodName => {
              methods.push(methodName);
            });
          }
        });
        setContractMethods(methods);
      }
    } catch (error) {
      console.error('Failed to get token contract:', error);
      setError('Failed to get token contract: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTokenInfo = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      const info = await tokenContract.GetTokenInfo.call({ symbol: inputData.symbol });
      setTokenInfo(info);
    } catch (error) {
      console.error('Failed to get token info:', error);
      setError('Failed to get token info: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      const balanceInfo = await tokenContract.GetBalance.call({
        symbol: inputData.symbol,
        owner: inputData.owner
      });
      setBalance(balanceInfo);
    } catch (error) {
      console.error('Failed to get balance:', error);
      setError('Failed to get balance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const transfer = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      const result = await tokenContract.Transfer.sendTransaction({
        to: inputData.to,
        symbol: inputData.symbol,
        amount: inputData.amount,
        memo: inputData.memo
      });

      alert(`Transfer successful! Transaction ID: ${result.TransactionId}`);
    } catch (error) {
      console.error('Failed to transfer:', error);
      setError('Failed to transfer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      const result = await tokenContract.Approve.sendTransaction({
        spender: inputData.to,
        symbol: inputData.symbol,
        amount: inputData.amount
      });

      alert(`Approve successful! Transaction ID: ${result.TransactionId}`);
    } catch (error) {
      console.error('Failed to approve:', error);
      setError('Failed to approve: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllowance = async () => {
    if (!tokenContract) return;

    try {
      setLoading(true);
      const allowance = await tokenContract.GetAllowance.call({
        symbol: inputData.symbol,
        owner: inputData.owner,
        spender: inputData.to
      });

      alert(`Allowance: ${allowance.amount} ${allowance.symbol}`);
    } catch (error) {
      console.error('Failed to get allowance:', error);
      setError('Failed to get allowance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="info-card">
      <h2>Contract Operations</h2>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => setError(null)}>Clear Error</button>
        </div>
      )}

      {/* Contract Initialization */}
      <div className="section">
        <h3>Contract Initialization</h3>
        <button onClick={getTokenContract} disabled={!aelf || !wallet || loading}>
          {loading ? 'Initializing...' : 'Initialize Token Contract'}
        </button>

        {genesisContractAddress && (
          <div className="result">
            <p><strong>Genesis Contract Address:</strong> {genesisContractAddress}</p>
          </div>
        )}

        {tokenContractAddress && (
          <div className="result">
            <p><strong>Token Contract Address:</strong> {tokenContractAddress}</p>
          </div>
        )}

        {contractMethods.length > 0 && (
          <div className="result">
            <p><strong>Available Methods:</strong></p>
            <div className="methods-list">
              {contractMethods.map((method, index) => (
                <span key={index} className="method-tag">{method}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Token Information */}
      <div className="section">
        <h3>Token Information</h3>
        <div className="input-group">
          <label>Token Symbol:</label>
          <input
            type="text"
            value={inputData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            placeholder="Enter token symbol (e.g., ELF)"
          />
          <button onClick={getTokenInfo} disabled={!tokenContract || loading}>
            Get Token Info
          </button>
        </div>

        {tokenInfo && (
          <div className="result">
            <h4>Token Info:</h4>
            <p><strong>Symbol:</strong> {tokenInfo.symbol}</p>
            <p><strong>Token Name:</strong> {tokenInfo.tokenName}</p>
            <p><strong>Supply:</strong> {tokenInfo.supply}</p>
            <p><strong>Total Supply:</strong> {tokenInfo.totalSupply}</p>
            <p><strong>Decimals:</strong> {tokenInfo.decimals}</p>
            <p><strong>Issuer:</strong> {tokenInfo.issuer}</p>
            <p><strong>Is Burnable:</strong> {tokenInfo.isBurnable ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      {/* Balance Operations */}
      <div className="section">
        <h3>Balance Operations</h3>
        <div className="input-group">
          <label>Owner Address:</label>
          <input
            type="text"
            value={inputData.owner}
            onChange={(e) => handleInputChange('owner', e.target.value)}
            placeholder="Enter owner address"
          />
          <button onClick={getBalance} disabled={!tokenContract || loading}>
            Get Balance
          </button>
        </div>

        {balance && (
          <div className="result">
            <h4>Balance Info:</h4>
            <p><strong>Symbol:</strong> {balance.symbol}</p>
            <p><strong>Owner:</strong> {balance.owner}</p>
            <p><strong>Balance:</strong> {balance.balance}</p>
          </div>
        )}
      </div>

      {/* Transfer Operations */}
      <div className="section">
        <h3>Transfer Operations</h3>
        <div className="input-group">
          <label>To Address:</label>
          <input
            type="text"
            value={inputData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            placeholder="Enter recipient address"
          />
        </div>

        <div className="input-group">
          <label>Amount:</label>
          <input
            type="text"
            value={inputData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {/* <div className="input-group"> */}
        {/*   <label>Symbol:</label> */}
        {/*   <input */}
        {/*     type="text" */}
        {/*     value={inputData.symbol} */}
        {/*     onChange={(e) => handleInputChange('amount', e.target.value)} */}
        {/*     placeholder="Enter symbol" */}
        {/*   /> */}
        {/* </div> */}

        <div className="input-group">
          <label>Memo (optional):</label>
          <input
            type="text"
            value={inputData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            placeholder="Enter memo"
          />
        </div>

        <div className="button-group">
          <button onClick={transfer} disabled={!tokenContract || loading}>
            Transfer
          </button>
          <button onClick={approve} disabled={!tokenContract || loading}>
            Approve
          </button>
          <button onClick={getAllowance} disabled={!tokenContract || loading}>
            Get Allowance
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button onClick={() => handleInputChange('symbol', 'ELF')}>
            Set ELF Token
          </button>
          <button onClick={() => handleInputChange('amount', '10000000')}>
            Set Default Amount
          </button>
          <button onClick={() => handleInputChange('owner', wallet?.address || '')}>
            Set Current Wallet as Owner
          </button>
        </div>
      </div>
    </div>
  );
}
