// Configuration constants for AElf React Demo
export const CONFIG = {
  // Network endpoints
  ENDPOINTS: {
    TEST_NET: 'https://aelf-test-node.aelf.io',
    TDVW_TEST: 'https://tdvw-test-node.aelf.io',
    MAIN_NET: 'https://aelf-node.aelf.io'
  },

  // Default private key for testing (from e2e tests)
  DEFAULT_PRIVATE_KEY: '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808',

  // Test mnemonic (from e2e tests)
  TEST_MNEMONIC: 'orange learn result add snack curtain double state expose bless also clarify',

  // Contract names
  CONTRACT_NAMES: {
    TOKEN: 'AElf.ContractNames.Token',
    GENESIS: 'AElf.ContractNames.Genesis'
  },

  // Token symbols
  TOKEN_SYMBOLS: {
    ELF: 'ELF'
  },

  // Default test values
  TEST_VALUES: {
    TRANSFER_AMOUNT: '10000000',
    TEST_DATA: '68656c6c6f20776f726c64', // "hello world" in hex
    ENCRYPTION_PASSWORD: 'test password',
    ENCRYPTION_DATA: 'test data'
  },

  // UI settings
  UI: {
    REFRESH_INTERVAL: 5000, // 5 seconds
    MAX_RETRIES: 3,
    TIMEOUT: 30000 // 30 seconds
  }
};

// Helper function to get current endpoint
export const getCurrentEndpoint = () => {
  return CONFIG.ENDPOINTS.TEST_NET;
};

// Helper function to get default wallet
export const getDefaultWallet = (AElf) => {
  return AElf.wallet.getWalletByPrivateKey(CONFIG.DEFAULT_PRIVATE_KEY);
};

// Helper function to create AElf instance
export const createAElfInstance = (AElf, endpoint = null) => {
  const url = endpoint || getCurrentEndpoint();
  const provider = new AElf.providers.HttpProvider(url);
  return new AElf(provider);
};
