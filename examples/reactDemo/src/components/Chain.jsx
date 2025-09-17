import React, { useState, useEffect } from 'react';
import AElf from 'aelf-sdk';
import { CONFIG, createAElfInstance } from '../config';

export default function ChainComponent() {
  const [aelf, setAelf] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('未连接');
  const [chainStatus, setChainStatus] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [transactionPoolStatus, setTransactionPoolStatus] = useState(null);
  const [peers, setPeers] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(CONFIG.ENDPOINTS.TEST_NET);

  // Initialize AElf instance
  useEffect(() => {
    initializeAElf();
  }, [selectedEndpoint]);

  const initializeAElf = async () => {
    try {
      setLoading(true);
      setError(null);

      const aelfInstance = createAElfInstance(AElf, selectedEndpoint);
      setAelf(aelfInstance);

      const isConnected = aelfInstance.isConnected();
      setConnectionStatus(isConnected ? '已连接' : '连接失败');

      if (isConnected) {
        await getChainStatus();
      }
    } catch (error) {
      console.error('Failed to initialize AElf:', error);
      setError('Failed to initialize AElf: ' + error.message);
      setConnectionStatus('初始化失败');
    } finally {
      setLoading(false);
    }
  };

  const getChainStatus = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      const status = await aelf.chain.getChainStatus();
      setChainStatus(status);
    } catch (error) {
      console.error('Failed to get chain status:', error);
      setError('Failed to get chain status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBlockHeight = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      const height = await aelf.chain.getBlockHeight();
      setBlockHeight(height);
    } catch (error) {
      console.error('Failed to get block height:', error);
      setError('Failed to get block height: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBlockByHeight = async (height = null) => {
    if (!aelf) return;

    try {
      setLoading(true);
      const blockHeightToUse = height || blockHeight || await aelf.chain.getBlockHeight();
      const block = await aelf.chain.getBlockByHeight(blockHeightToUse, true);
      setCurrentBlock(block);
    } catch (error) {
      console.error('Failed to get block by height:', error);
      setError('Failed to get block by height: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBlockByHash = async (blockHash) => {
    if (!aelf || !blockHash) return;

    try {
      setLoading(true);
      const block = await aelf.chain.getBlock(blockHash, true);
      setCurrentBlock(block);
    } catch (error) {
      console.error('Failed to get block by hash:', error);
      setError('Failed to get block by hash: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionPoolStatus = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      const poolStatus = await aelf.chain.getTransactionPoolStatus();
      setTransactionPoolStatus(poolStatus);
    } catch (error) {
      console.error('Failed to get transaction pool status:', error);
      setError('Failed to get transaction pool status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPeers = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      const peersList = await aelf.chain.getPeers(false);
      setPeers(peersList);
    } catch (error) {
      console.error('Failed to get peers:', error);
      setError('Failed to get peers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkInfo = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      const network = await aelf.chain.networkInfo();
      setNetworkInfo(network);
    } catch (error) {
      console.error('Failed to get network info:', error);
      setError('Failed to get network info: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  const refreshAll = async () => {
    if (!aelf) return;

    try {
      setLoading(true);
      await Promise.all([
        getChainStatus(),
        getBlockHeight(),
        getTransactionPoolStatus(),
        getPeers(),
        getNetworkInfo()
      ]);
    } catch (error) {
      console.error('Failed to refresh all data:', error);
      setError('Failed to refresh all data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-card">
      <h2>Chain Operations</h2>

      {/* Connection Status */}
      <div className="section">
        <h3>Connection Status</h3>
        <div className="endpoint-selector">
          <label>Endpoint:</label>
          <select
            value={selectedEndpoint}
            onChange={(e) => handleEndpointChange(e.target.value)}
          >
            {Object.entries(CONFIG.ENDPOINTS).map(([key, value]) => (
              <option key={key} value={value}>{key}: {value}</option>
            ))}
          </select>
        </div>
        <p className={`status ${connectionStatus === '已连接' ? 'connected' : 'disconnected'}`}>
          {connectionStatus}
        </p>
        <div className="button-group">
          <button onClick={initializeAElf} disabled={loading}>
            {loading ? 'Connecting...' : 'Reconnect'}
          </button>
          <button onClick={refreshAll} disabled={!aelf || loading}>
            {loading ? 'Refreshing...' : 'Refresh All'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => setError(null)}>Clear Error</button>
        </div>
      )}

      {/* Chain Status */}
      {chainStatus && (
        <div className="section">
          <h3>Chain Status</h3>
          <div className="chain-info">
            <p><strong>Chain ID:</strong> {chainStatus.ChainId}</p>
            <p><strong>Genesis Contract Address:</strong> {chainStatus.GenesisContractAddress}</p>
            <p><strong>Best Chain Height:</strong> {chainStatus.BestChainHeight}</p>
            <p><strong>Best Chain Hash:</strong> {chainStatus.BestChainHash}</p>
            <p><strong>Longest Chain Height:</strong> {chainStatus.LongestChainHeight}</p>
            <p><strong>Longest Chain Hash:</strong> {chainStatus.LongestChainHash}</p>
          </div>
          <button onClick={getChainStatus} disabled={!aelf || loading}>
            Refresh Chain Status
          </button>
        </div>
      )}

      {/* Block Operations */}
      <div className="section">
        <h3>Block Operations</h3>
        <div className="button-group">
          <button onClick={getBlockHeight} disabled={!aelf || loading}>
            Get Block Height
          </button>
          <button onClick={() => getBlockByHeight()} disabled={!aelf || loading}>
            Get Current Block
          </button>
        </div>

        {blockHeight && (
          <div className="result">
            <p><strong>Current Block Height:</strong> {blockHeight}</p>
          </div>
        )}

        {currentBlock && (
          <div className="result">
            <h4>Block Details:</h4>
            <p><strong>Block Hash:</strong> {currentBlock.BlockHash}</p>
            <p><strong>Height:</strong> {currentBlock.Header?.Height}</p>
            <p><strong>Previous Block Hash:</strong> {currentBlock.Header?.PreviousBlockHash}</p>
            <p><strong>Merkle Tree Root:</strong> {currentBlock.Header?.MerkleTreeRootOfTransactions}</p>
            <p><strong>Time:</strong> {new Date(currentBlock.Header?.Time).toLocaleString()}</p>
            <p><strong>Transaction Count:</strong> {currentBlock.Body?.Transactions?.length || 0}</p>
          </div>
        )}
      </div>

      {/* Transaction Pool Status */}
      {transactionPoolStatus && (
        <div className="section">
          <h3>Transaction Pool Status</h3>
          <div className="pool-info">
            <p><strong>Queued Transactions:</strong> {transactionPoolStatus.Queued}</p>
            <p><strong>Validated Transactions:</strong> {transactionPoolStatus.Validated}</p>
          </div>
          <button onClick={getTransactionPoolStatus} disabled={!aelf || loading}>
            Refresh Pool Status
          </button>
        </div>
      )}

      {/* Peers */}
      {peers && (
        <div className="section">
          <h3>Peers</h3>
          <div className="peers-info">
            <p><strong>Total Peers:</strong> {peers.length}</p>
            {peers.length > 0 && (
              <div className="peers-list">
                <h4>Peer List:</h4>
                {peers.slice(0, 5).map((peer, index) => (
                  <p key={index}><strong>Peer {index + 1}:</strong> {JSON.stringify(peer)}</p>
                ))}
                {peers.length > 5 && <p>... and {peers.length - 5} more</p>}
              </div>
            )}
          </div>
          <button onClick={getPeers} disabled={!aelf || loading}>
            Refresh Peers
          </button>
        </div>
      )}

      {/* Network Info */}
      {networkInfo && (
        <div className="section">
          <h3>Network Info</h3>
          <div className="network-info">
            <p><strong>Version:</strong> {networkInfo.Version}</p>
            <p><strong>Protocol Version:</strong> {networkInfo.ProtocolVersion}</p>
            <p><strong>Connections:</strong> {networkInfo.Connections}</p>
          </div>
          <button onClick={getNetworkInfo} disabled={!aelf || loading}>
            Refresh Network Info
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="section">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button onClick={getTransactionPoolStatus} disabled={!aelf || loading}>
            Get Transaction Pool
          </button>
          <button onClick={getPeers} disabled={!aelf || loading}>
            Get Peers
          </button>
          <button onClick={getNetworkInfo} disabled={!aelf || loading}>
            Get Network Info
          </button>
        </div>
      </div>
    </div>
  );
}
