# AElf Web3.js React Demo

A comprehensive React demo application showcasing the complete functionality of AElf Web3.js SDK. This demo provides a visual and interactive interface to test all major AElf features including wallet management, chain operations, contract interactions, transaction handling, and utility functions.

## 🚀 Features

### 🔗 Chain Operations
- **Connection Management**: Connect to different AElf network endpoints
- **Chain Status**: Get real-time chain information (Chain ID, block height, etc.)
- **Block Operations**: Query blocks by height or hash
- **Transaction Pool**: Monitor transaction pool status
- **Network Info**: Get peer information and network statistics

### 💼 Wallet Management
- **Wallet Creation**: Create new wallets with mnemonic phrases
- **Wallet Import**: Import wallets from private keys or mnemonic phrases
- **Signing & Verification**: Sign data and verify signatures
- **Encryption/Decryption**: AES encrypt and decrypt sensitive data
- **Address Operations**: Get addresses from public keys

### 📋 Contract Operations
- **Contract Initialization**: Initialize and interact with smart contracts
- **Token Operations**: Get token information, balances, and perform transfers
- **Method Discovery**: Automatically discover available contract methods
- **Read Operations**: Call read-only contract methods
- **Write Operations**: Send transactions to modify contract state

### 💸 Transaction Management
- **Transaction Creation**: Create raw transactions with custom parameters
- **Transaction Signing**: Sign transactions with wallet private keys
- **Transaction Broadcasting**: Send transactions to the network
- **Transaction Tracking**: Query transaction results and status
- **Merkle Path**: Get merkle paths for transaction verification

### 🛠️ Utils Operations
- **Hash Functions**: SHA256 hashing
- **Encoding/Decoding**: Address encoding, Base58 operations
- **String Operations**: Padding, array to hex conversion
- **BigNumber**: Large number handling
- **Wei Conversions**: Convert between wei and other units

## 🏗️ Architecture

The application is built with a modular architecture:

```
src/
├── config/
│   └── index.js          # Configuration constants and helpers
├── components/
│   ├── Chain.jsx         # Chain operations component
│   ├── Wallet.jsx        # Wallet management component
│   ├── contract.jsx      # Contract operations component
│   ├── Transaction.jsx   # Transaction management component
│   └── Utils.jsx         # Utils operations component
├── App.jsx               # Main application component
├── App.css               # Application styles
└── main.jsx              # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd examples/reactDemo
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173`

## 📖 Usage Guide

### 1. Chain Operations Tab
- Select different network endpoints (Test Net, TDVW Test, Main Net)
- View real-time connection status
- Get chain information and block details
- Monitor transaction pool and network statistics

### 2. Wallet Management Tab
- Create new wallets or import existing ones
- Test signing and verification functionality
- Encrypt/decrypt sensitive data
- View wallet information and addresses

### 3. Contract Operations Tab
- Initialize token contracts
- Get token information and balances
- Perform transfers and approvals
- Query contract methods and parameters

### 4. Transaction Management Tab
- Create custom transactions
- Sign and broadcast transactions
- Track transaction status and results
- Query blocks and merkle paths

### 5. Utils Operations Tab
- Test hash functions and encoding
- Perform string operations and conversions
- Handle BigNumber operations
- Convert between different units

## ⚙️ Configuration

The demo uses a centralized configuration system in `src/config/index.js`:

```javascript
export const CONFIG = {
  ENDPOINTS: {
    TEST_NET: 'https://aelf-test-node.aelf.io',
    TDVW_TEST: 'https://tdvw-test-node.aelf.io',
    MAIN_NET: 'https://aelf-node.aelf.io'
  },
  DEFAULT_PRIVATE_KEY: '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808',
  TEST_MNEMONIC: 'orange learn result add snack curtain double state expose bless also clarify',
  // ... more configuration
};
```

### Network Endpoints
- **Test Net**: `https://aelf-test-node.aelf.io` (Default)
- **TDVW Test**: `https://tdvw-test-node.aelf.io`
- **Main Net**: `https://aelf-node.aelf.io`

### Default Test Values
- **Private Key**: Pre-configured test private key
- **Mnemonic**: Test mnemonic phrase
- **Token Symbol**: ELF (default)
- **Test Amounts**: 10000000 (10 ELF)

## 🧪 Testing

This demo is based on the comprehensive test suite from the AElf Web3.js project:

- **E2E Tests**: Based on `test/e2e/aelf-esm.test.js` and `test/e2e/aelf-esm-basic.test.js`
- **Unit Tests**: Incorporates functionality from `test/unit/` directory
- **Contract Tests**: Includes token contract operations from unit tests

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Tab Navigation**: Easy switching between different functionality areas
- **Real-time Status**: Live connection and network status indicators
- **Error Handling**: Comprehensive error display and handling
- **Loading States**: Visual feedback for async operations
- **Modern UI**: Clean, professional interface with smooth animations

## 🔧 Development

### Project Structure
- **Vite**: Fast build tool and development server
- **React 18**: Modern React with hooks
- **CSS Modules**: Scoped styling
- **ES6+**: Modern JavaScript features

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "aelf-sdk": "latest",
  "vite": "^4.0.0"
}
```

## 📝 Examples

### Creating a New Wallet
```javascript
const newWallet = AElf.wallet.createNewWallet();
console.log('Address:', newWallet.address);
console.log('Private Key:', newWallet.privateKey);
console.log('Mnemonic:', newWallet.mnemonic);
```

### Getting Chain Status
```javascript
const aelf = new AElf(new AElf.providers.HttpProvider('https://aelf-test-node.aelf.io'));
const chainStatus = await aelf.chain.getChainStatus();
console.log('Chain ID:', chainStatus.ChainId);
console.log('Block Height:', chainStatus.BestChainHeight);
```

### Token Transfer
```javascript
const tokenContract = await aelf.chain.contractAt(tokenAddress, wallet);
const result = await tokenContract.Transfer.sendTransaction({
  to: recipientAddress,
  symbol: 'ELF',
  amount: '10000000',
  memo: 'Test transfer'
});
console.log('Transaction ID:', result.TransactionId);
```

## 🚨 Important Notes

- **Test Environment**: This demo uses test networks and test private keys
- **Security**: Never use the default private keys in production
- **Network**: Ensure you have internet connectivity to access AElf nodes
- **Browser**: Modern browsers with ES6+ support required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the [AElf Documentation](https://docs.aelf.io/)
- Review the test cases in the main repository
- Open an issue in the GitHub repository

---

**Happy coding with AElf Web3.js! 🎉**