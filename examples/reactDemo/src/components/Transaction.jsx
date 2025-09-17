import React, { useState, useEffect } from 'react';
import AElf from 'aelf-sdk';
import { CONFIG, createAElfInstance, getDefaultWallet } from '../config';

export default function TransactionComponent() {
  const [aelf, setAelf] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    transactionId: 'e6bb428a5a638a09e9921b4db55180d7c5b092e0be594d8178d13188d6553678',
    blockHeight: '1',
    blockHash: 'ca35103cb8edad6e4f804535c5106b79b9fa5257f764b19f042e0ffe78c035f8', // height 1
    methodName: 'Transfer',
    contractAddress: '',
    params: JSON.stringify({
      to: '',
      symbol: 'ELF',
      amount: '10000000',
      memo: ''
    }, null, 2)
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
    } catch (error) {
      console.error('Failed to initialize AElf:', error);
      setError('Failed to initialize AElf: ' + error.message);
    }
  };

  const getTransactionResult = async () => {
    if (!aelf || !inputData.transactionId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await aelf.chain.getTxResult(inputData.transactionId);
      setTransactionResult(result);
    } catch (error) {
      console.error('Failed to get transaction result:', error);
      setError('Failed to get transaction result: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionStatus = async () => {
    if (!aelf || !inputData.transactionId) return;

    try {
      setLoading(true);
      setError(null);

      const status = await aelf.chain.getTxResult(inputData.transactionId);
      setTransactionStatus(status);
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      setError('Failed to get transaction status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMerklePath = async () => {
    if (!aelf || !inputData.transactionId) return;

    try {
      setLoading(true);
      setError(null);

      const merklePath = await aelf.chain.getMerklePathByTxId(inputData.transactionId);
      alert(`Merkle Path: ${JSON.stringify(merklePath, null, 2)}`);
    } catch (error) {
      console.error('Failed to get merkle path:', error);
      setError('Failed to get merkle path: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createRawTransaction = async () => {
    if (!aelf || !wallet) return;

    try {
      setLoading(true);
      setError(null);

      // Get current block info
      const chainStatus = await aelf.chain.getChainStatus();
      const blockHeight = chainStatus.BestChainHeight;
      const blockHash = chainStatus.BestChainHash;

      // Parse params
      let params;
      try {
        params = JSON.parse(inputData.params);
      } catch (e) {
        throw new Error('Invalid JSON in params field');
      }

      // Create raw transaction
      const rawTx = {
        from: wallet.address,
        to: inputData.contractAddress,
        refBlockNumber: blockHeight,
        refBlockPrefix: blockHash.substring(0, 8),
        methodName: inputData.methodName,
        params: params
      };

      alert(`Raw Transaction: ${JSON.stringify(rawTx, null, 2)}`);
    } catch (error) {
      console.error('Failed to create raw transaction:', error);
      setError('Failed to create raw transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signTransaction = async () => {
    if (!aelf || !wallet) return;

    try {
      setLoading(true);
      setError(null);

      // Get current block info
      const chainStatus = await aelf.chain.getChainStatus();
      const blockHeight = chainStatus.BestChainHeight;
      const blockHash = chainStatus.BestChainHash;

      // Parse params
      let params;
      try {
        params = JSON.parse(inputData.params);
      } catch (e) {
        throw new Error('Invalid JSON in params field');
      }

      // Create and sign transaction
      const transaction = {
        from: wallet.address,
        to: inputData.contractAddress,
        refBlockNumber: blockHeight,
        refBlockPrefix: blockHash.substring(0, 8),
        methodName: inputData.methodName,
        params: params
      };

      // const signedTx = await aelf.chain.signTransaction(transaction, wallet);
      const signedTx = await AElf.utils.signTransaction(transaction, wallet.keyPair);
      console.log('signedTx:', signedTx); // signedTx.signature.toString('hex')
      alert(`Signed Transaction: ${JSON.stringify(signedTx, null, 2)}`);
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      setError('Failed to sign transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // TODO: prepareParams for contract methods.
  const sendTransaction = async () => {
    if (!aelf || !wallet) return;

    try {
      setLoading(true);
      setError(null);

      // Get current block info
      const chainStatus = await aelf.chain.getChainStatus();
      const blockHeight = chainStatus.BestChainHeight;
      const blockHash = chainStatus.BestChainHash;

      // Parse params
      let params;
      try {
        params = JSON.parse(inputData.params);
      } catch (e) {
        throw new Error('Invalid JSON in params field');
      }

      // Create and send transaction
      const transaction = {
        from: wallet.address,
        to: inputData.contractAddress,
        refBlockNumber: blockHeight,
        refBlockPrefix: blockHash.substring(0, 8),
        methodName: inputData.methodName,
        params: params
      };

      const result = await aelf.chain.sendTransaction(transaction, wallet);
      setInputData(prev => ({ ...prev, transactionId: result.TransactionId }));
      alert(`Transaction sent successfully! Transaction ID: ${result.TransactionId}`);
    } catch (error) {
      console.error('Failed to send transaction:', error);
      setError('Failed to send transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBlockByHeight = async () => {
    if (!aelf || !inputData.blockHeight) return;

    try {
      setLoading(true);
      setError(null);

      const block = await aelf.chain.getBlockByHeight(parseInt(inputData.blockHeight), true);
      alert(`Block: ${JSON.stringify(block, null, 2)}`);
    } catch (error) {
      console.error('Failed to get block by height:', error);
      setError('Failed to get block by height: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBlockByHash = async () => {
    if (!aelf || !inputData.blockHash) return;

    try {
      setLoading(true);
      setError(null);

      const block = await aelf.chain.getBlock(inputData.blockHash, true);
      alert(`Block: ${JSON.stringify(block, null, 2)}`);
    } catch (error) {
      console.error('Failed to get block by hash:', error);
      setError('Failed to get block by hash: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const setDefaultValues = () => {
    setInputData(prev => ({
      ...prev,
      contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx', // Token contract address
      methodName: 'Transfer',
      params: JSON.stringify({
        to: wallet?.address || '',
        symbol: 'ELF',
        amount: '10000000',
        memo: 'Test transfer'
      }, null, 2)
    }));
  };

  return (
    <div className="info-card">
      <h2>Transaction Management</h2>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => setError(null)}>Clear Error</button>
        </div>
      )}

      {/* Transaction Creation */}
      <div className="section">
        <h3>Create Transaction</h3>
        <div className="input-group">
          <label>Contract Address:</label>
          <input
            type="text"
            value={inputData.contractAddress}
            onChange={(e) => handleInputChange('contractAddress', e.target.value)}
            placeholder="Enter contract address"
          />
        </div>

        <div className="input-group">
          <label>Method Name:</label>
          <input
            type="text"
            value={inputData.methodName}
            onChange={(e) => handleInputChange('methodName', e.target.value)}
            placeholder="Enter method name"
          />
        </div>

        <div className="input-group">
          <label>Parameters (JSON):</label>
          <textarea
            value={inputData.params}
            onChange={(e) => handleInputChange('params', e.target.value)}
            placeholder="Enter parameters as JSON"
            rows="6"
          />
        </div>

        <div className="button-group">
          <button onClick={setDefaultValues}>Set Default Values</button>
          <button onClick={createRawTransaction} disabled={!aelf || !wallet || loading}>
            Create Raw Transaction
          </button>
          <button onClick={signTransaction} disabled={!aelf || !wallet || loading}>
            Sign Transaction
          </button>
          {/* <button onClick={sendTransaction} disabled={!aelf || !wallet || loading}> */}
          <button onClick={sendTransaction} disabled>
            Send Transaction(TODO)
          </button>
        </div>
      </div>

      {/* Transaction Query */}
      <div className="section">
        <h3>Query Transaction</h3>
        <div className="input-group">
          <label>Transaction ID:</label>
          <input
            type="text"
            value={inputData.transactionId}
            onChange={(e) => handleInputChange('transactionId', e.target.value)}
            placeholder="Enter transaction ID"
          />
          <button onClick={getTransactionResult} disabled={!aelf || loading}>
            Get Transaction Result
          </button>
        </div>

        {transactionResult && (
          <div className="result">
            <h4>Transaction Result:</h4>
            <p><strong>Transaction ID:</strong> {transactionResult.TransactionId}</p>
            <p><strong>Status:</strong> {transactionResult.Status}</p>
            <p><strong>Block Height:</strong> {transactionResult.BlockNumber}</p>
            <p><strong>Block Hash:</strong> {transactionResult.BlockHash}</p>
            <p><strong>Return Value:</strong> {transactionResult.ReturnValue}</p>
            <p><strong>Error:</strong> {transactionResult.Error || 'None'}</p>
            <p><strong>Logs:</strong> {transactionResult.Logs?.length || 0} logs</p>
          </div>
        )}

        <div className="button-group">
          <button onClick={getTransactionStatus} disabled={!aelf || loading}>
            Get Transaction Status
          </button>
          <button onClick={getMerklePath} disabled={!aelf || loading}>
            Get Merkle Path
          </button>
        </div>
      </div>

      {/* Block Query */}
      <div className="section">
        <h3>Query Block</h3>
        <div className="input-group">
          <label>Block Height:</label>
          <input
            type="number"
            value={inputData.blockHeight}
            onChange={(e) => handleInputChange('blockHeight', e.target.value)}
            placeholder="Enter block height"
          />
          <button onClick={getBlockByHeight} disabled={!aelf || loading}>
            Get Block by Height
          </button>
        </div>

        <div className="input-group">
          <label>Block Hash:</label>
          <input
            type="text"
            value={inputData.blockHash}
            onChange={(e) => handleInputChange('blockHash', e.target.value)}
            placeholder="Enter block hash"
          />
          <button onClick={getBlockByHash} disabled={!aelf || loading}>
            Get Block by Hash
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button onClick={() => handleInputChange('methodName', 'Transfer')}>
            Set Transfer Method
          </button>
          <button onClick={() => handleInputChange('methodName', 'GetBalance')}>
            Set GetBalance Method
          </button>
          <button onClick={() => handleInputChange('methodName', 'Approve')}>
            Set Approve Method
          </button>
        </div>
      </div>

      {/* Transaction Status */}
      {transactionStatus && (
        <div className="section">
          <h3>Transaction Status</h3>
          <div className="result">
            <p><strong>Status:</strong> {transactionStatus.Status}</p>
            <p><strong>Block Number:</strong> {transactionStatus.BlockNumber}</p>
            <p><strong>Block Hash:</strong> {transactionStatus.BlockHash}</p>
            <p><strong>Error:</strong> {transactionStatus.Error || 'None'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
