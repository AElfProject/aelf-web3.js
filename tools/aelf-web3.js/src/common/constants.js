/**
 * @file AElf-sdk constants
 * @author atom-yang
 */
import { inputAddressFormatter, outputFileDescriptorSetFormatter } from '../util/formatters';

/**
 * unsigned 256 int
 */
export const UNSIGNED_256_INT = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const CHAIN_METHODS = {
  getChainStatus: {
    name: 'getChainStatus',
    call: 'blockChain/chainStatus',
    method: 'GET',
    params: []
  },
  getChainState: {
    name: 'getChainState',
    call: 'blockChain/blockState',
    method: 'GET',
    params: ['blockHash']
  },
  getContractFileDescriptorSet: {
    name: 'getContractFileDescriptorSet',
    call: 'blockChain/contractFileDescriptorSet',
    method: 'GET',
    params: ['address'],
    inputFormatter: [inputAddressFormatter],
    outputFormatter: outputFileDescriptorSetFormatter
  },
  getBlockHeight: {
    name: 'getBlockHeight',
    call: 'blockChain/blockHeight',
    method: 'GET',
    params: [],
    inputFormatter: []
  },
  getBlock: {
    name: 'getBlock',
    call: 'blockChain/block',
    method: 'GET',
    params: ['blockHash', 'includeTransactions']
  },
  getBlockByHeight: {
    name: 'getBlockByHeight',
    call: 'blockChain/blockByHeight',
    method: 'GET',
    params: ['blockHeight', 'includeTransactions']
  },
  getTxResult: {
    name: 'getTxResult',
    call: 'blockChain/transactionResult',
    method: 'GET',
    params: ['transactionId'],
    inputFormatter: []
  },
  getTxResults: {
    name: 'getTxResults',
    call: 'blockChain/transactionResults',
    method: 'GET',
    params: ['blockHash', 'offset', 'limit']
  },
  getMerklePathByTxId: {
    name: 'getMerklePathByTxId',
    call: 'blockChain/merklePathByTransactionId',
    method: 'GET',
    params: ['transactionId']
  },
  getTransactionPoolStatus: {
    name: 'getTransactionPoolStatus',
    call: 'blockChain/transactionPoolStatus',
    method: 'GET',
    params: []
  },
  sendTransaction: {
    name: 'sendTransaction',
    call: 'blockChain/sendTransaction',
    method: 'POST',
    params: ['rawTransaction'],
    inputFormatter: []
  },
  sendTransactions: {
    name: 'sendTransactions',
    call: 'blockChain/sendTransactions',
    method: 'POST',
    params: ['rawTransaction'],
    inputFormatter: []
  },
  calculateTransactionFee: {
    name: 'calculateTransactionFee',
    call: 'blockChain/calculateTransactionFee',
    method: 'POST',
    params: ['rawTransaction'],
    inputFormatter: []
  },
  callReadOnly: {
    name: 'callReadOnly',
    call: 'blockChain/executeTransaction',
    method: 'POST',
    params: ['rawTransaction'],
    inputFormatter: []
  },
  getPeers: {
    name: 'getPeers',
    call: 'net/peers',
    method: 'GET',
    params: ['withMetrics']
  },
  addPeer: {
    name: 'addPeer',
    call: 'net/peer',
    method: 'POST',
    params: ['address'],
    inputFormatter: []
  },
  removePeer: {
    name: 'removePeer',
    call: 'net/peer',
    method: 'DELETE',
    params: ['address'],
    inputFormatter: []
  },
  networkInfo: {
    name: 'networkInfo',
    call: 'net/networkInfo',
    method: 'GET',
    params: [],
    inputFormatter: []
  }
};

/**
 * unit map
 */
export const UNIT_MAP = {
  noether: '0',
  wei: '1',
  kwei: '1000',
  Kwei: '1000',
  babbage: '1000',
  femtoether: '1000',
  mwei: '1000000',
  Mwei: '1000000',
  lovelace: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  Gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};

export const TO_STRING_UTF8_ENCODING = 'utf8';

export const DEFAULT_TO_STRING_ENCODING = TO_STRING_UTF8_ENCODING;

export const CONGIG = {
  AELF_POLLING_TIMEOUT: 1000 / 2,
  chainId: 'AELF',
  contractZeroAddress: 'AELF',
  contractZeroAbi: 'AELF',
  contractZero: 'AELF',
  defaultAccount: '0x04bb9c6c297ea90b1bc3e6af2c87d416583e'
};

export const KEY_STORE_ERRORS = {
  INVALID_PASSWORD: {
    error: 200001,
    errorMessage: 'Password Error'
  },
  NOT_AELF_KEY_STORE: {
    error: 200002,
    errorMessage: 'Not a aelf key store'
  },
  WRONG_VERSION: {
    error: 200004,
    errorMessage: 'The version is incorrect'
  },
  WRONG_KEY_STORE_VERSION: {
    error: 200005,
    errorMessage: 'Not a V1 key store'
  }
};
