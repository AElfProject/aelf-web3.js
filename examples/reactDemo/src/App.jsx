import React, { useState, useEffect } from 'react';
import AElf from 'aelf-sdk';
import './App.css';
import { CONFIG, createAElfInstance, getDefaultWallet } from './config';
import WalletComponent from './components/Wallet';
import ChainComponent from './components/Chain';
import Contract from './components/contract';
import TransactionComponent from './components/Transaction';
import UtilsComponent from './components/Utils';

window.AElf = AElf;

function App() {
  const [activeTab, setActiveTab] = useState('chain');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [aelf, setAelf] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [chainInfo, setChainInfo] = useState(null);

  useEffect(() => {
    initializeAElf();
  }, []);

  const initializeAElf = async () => {
    try {
      // Create AElf instance
      const aelfInstance = createAElfInstance(AElf);
      setAelf(aelfInstance);

      // Check connection status
      const isConnected = aelfInstance.isConnected();
      setConnectionStatus(isConnected ? 'Connected' : 'Connection Failed');

      if (isConnected) {
        // Create wallet
        const walletInstance = getDefaultWallet(AElf);
        setWallet(walletInstance);

        // Get chain information
        try {
          const chainInfo = await aelfInstance.chain.getChainStatus();
          setChainInfo(chainInfo);
        } catch (error) {
          console.error('Failed to get chain information:', error);
        }
      }
    } catch (error) {
      console.error('Failed to initialize AElf:', error);
      setConnectionStatus('Initialization Failed');
    }
  };

  const tabs = [
    { id: 'chain', label: 'Chain Operations', component: ChainComponent },
    { id: 'wallet', label: 'Wallet Management', component: WalletComponent },
    { id: 'contract', label: 'Contract Operations', component: Contract },
    { id: 'transaction', label: 'Transaction Management', component: TransactionComponent },
    { id: 'utils', label: 'Utils Operations', component: UtilsComponent }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app">
      <header className="app-header">
        <h1>AElf Web3.js Demo</h1>
        <p>Complete AElf functionality testing application built with Vite + React</p>
        <div className="connection-status">
          <span className={`status-indicator ${connectionStatus === 'Connected' ? 'connected' : 'disconnected'}`}>
            {connectionStatus}
          </span>
          <span className="endpoint-info">Endpoint: {CONFIG.ENDPOINTS.TEST_NET}</span>
        </div>
      </header>

      <nav className="app-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {/* Quick Status Overview */}
        <div className="status-overview">
          <div className="status-item">
            <span className="label">Connection:</span>
            <span className={`value ${connectionStatus === 'Connected' ? 'connected' : 'disconnected'}`}>
              {connectionStatus}
            </span>
          </div>
          {chainInfo && (
            <>
              <div className="status-item">
                <span className="label">Chain ID:</span>
                <span className="value">{chainInfo.ChainId}</span>
              </div>
              <div className="status-item">
                <span className="label">Block Height:</span>
                <span className="value">{chainInfo.BestChainHeight}</span>
              </div>
            </>
          )}
          {wallet && (
            <div className="status-item">
              <span className="label">Wallet:</span>
              <span className="value">{wallet.address.substring(0, 10)}...</span>
            </div>
          )}
        </div>

        {/* Active Component */}
        {ActiveComponent && <ActiveComponent />}

        {/* Footer with additional info */}
        <footer className="app-footer">
          <div className="footer-info">
            <p>AElf Web3.js Version: {AElf.version}</p>
            <p>This demo showcases all major AElf functionality including wallet management, chain operations, contract interactions, transaction handling, and utility functions.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
