/**
 * @file contract multi transaction method
 * @author abigail
 */
import HttpProvider from '../util/httpProvider';
import { getTransactionAndChainId, TransactionAndChainId, MultiTransaction } from '../util/proto';
import { transformMapToArray, transform, INPUT_TRANSFORMERS } from '../util/transform';
import { isBoolean, isFunction, isObject, noop, uint8ArrayToHex, validateMulti } from '../util/utils';
import wallet from '../wallet';
/**
 * @typedef {import('../../types/chain').default} Chain
 * @typedef {import('../../types/util/proto').TAddress} TAddress
 * @typedef {import('../../types/util/proto').TBlockHash} TBlockHash
 * @typedef {import('../../types/util/proto').TBlockHeight} TBlockHeight
 * @typedef {import('../../types/util/proto').TTransactionId} TTransactionId
 * @typedef {import('../../types/util/proto').TChainId} TChainId
 * @typedef {import('../../types/contract/contractMethod').IExtractArgumentsIntoObject} IExtractArgumentsIntoObject
 * @typedef {import('../../types/contract/contractMethod').TRawTx} TRawTx
 * @typedef {import('../../types/contract/contractMethod').IRequestResult} IRequestResult
 * @typedef {import('../../types/contract/index').Contract} Contract
 * @typedef {import('../../types/wallet').IWalletInfo} IWalletInfo
 */
export default class ContractMultiTransaction {
  /**
   * Creates an instance of ContractMultiTransaction.
   *
   * @param {Contract} contract - The contract instance.
   * @param {IWalletInfo} walletInstance - The wallet instance.
   * @param {Object.<string, any>} option - Configuration options for the contract.
   */

  constructor(contract, walletInstance, option) {
    this._contract = contract;
    this._services = contract.services;
    this._name = {};
    this._wallet = walletInstance;
    this._option = option || {};
    this._gatewayUrl = this._option.gatewayUrl;
    this._multiOptions = this._option.multi || {};
    this._chainIds = Object.keys(this._multiOptions);
    this.sendMultiTransactionToGateway = this.sendMultiTransactionToGateway.bind(this);
  }
  /**
   * Packs the input for a given method.
   *
   * @param {string} method - The method name to pack input for.
   * @param {any} input - The input parameters for the method.
   * @returns {Buffer|null} - The packed input as a Buffer, or null if input is not provided.
   * @throws {Error} - If the method is not found.
   */

  packInput(method, input) {
    let methodInstance;
    for (let i = 0; i < this._services.length; i++) {
      const methodName = Object.keys(this._services[i].methods);
      if (methodName.includes(method)) {
        methodInstance = this._services[i].methods[method].resolve();
        break;
      }
    }
    if (!methodInstance) {
      throw new Error(`Method ${method} not found`);
    }
    const { resolvedRequestType } = methodInstance;
    if (!input) {
      return null;
    }
    let params = transformMapToArray(resolvedRequestType, input);
    params = transform(resolvedRequestType, params, INPUT_TRANSFORMERS);
    const message = resolvedRequestType.fromObject(params);
    return resolvedRequestType.encode(message).finish();
  }
  /**
   * Validates the reference block number strategy provided in the arguments.
   *
   * @param {Array<any>} args - The method arguments.
   * @returns {Object.<string, any>} - The validated reference block number strategy.
   * @throws {Error} - If the strategy is invalid.
   */

  validateRefBlockNumberStrategy(args) {
    function validateItem(item) {
      // eslint-disable-next-line max-len
      if (typeof item !== 'number') {
        throw new Error('Invalid type, refBlockNumberStrategy must be number');
      }
      if (item > 0) {
        throw new Error('refBlockNumberStrategy must be less than 0');
      }
    }
    // if _chainIds is empty, init refBlockNumberStrategy to undefined
    const refBlockNumberStrategy = this._option?.refBlockNumberStrategy || {};
    args.forEach(arg => {
      if (arg.refBlockNumberStrategy) {
        if (isObject(arg.refBlockNumberStrategy)) {
          const keys = Object.keys(arg.refBlockNumberStrategy);
          for (let i = 0; i < keys.length; i++) {
            validateItem(arg.refBlockNumberStrategy[keys[i]]);
            refBlockNumberStrategy[keys[i]] = arg.refBlockNumberStrategy[keys[i]];
          }
        }
      }
    });
    return refBlockNumberStrategy;
  }
  /**
   * Extracts arguments into an object, detecting if the call is synchronous or asynchronous,
   * and capturing any callback functions.
   *
   * @param {Array<any>} args - The method arguments.
   * @returns {IExtractArgumentsIntoObject} - An object with `callback` and `isSync` properties.
   */

  extractArgumentsIntoObject(args) {
    const result = {
      callback: noop,
      isSync: false
    };
    if (args.length === 0) {
      return result;
    }
    if (isFunction(args[args.length - 1])) {
      result.callback = args[args.length - 1];
    }
    args.forEach(arg => {
      if (isBoolean(arg.sync)) {
        result.isSync = arg.sync;
      }
    });
    return result;
  }
  /**
   * Handles the multi-transaction process, signing transactions and encoding them into a multi-transaction format.
   *
   * @param {Object.<string, TBlockHeight>} height - An object containing chain heights indexed by chain IDs.
   * @param {Object.<string, TBlockHash>} hash - An object containing chain hashes indexed by chain IDs.
   * @param {Object.<string, any>} encoded - An object containing encoded transaction inputs indexed by chain IDs.
   * @returns {string} - The encoded multi-transaction as a hexadecimal string.
   */

  handleMultiTransaction(height, hash, encoded) {
    const rawTxs = this._chainIds.map(ele => this.getRawTx(height[ele] || '', hash[ele] || '', encoded[ele], ele));
    const multiTx = { transactions: [] };
    rawTxs.forEach(rawTx => {
      const handledTx = wallet.signTransaction(rawTx, this._wallet.keyPair);
      const item = { transaction: handledTx, chainId: rawTx.chainId };
      const transactionAndChainId = TransactionAndChainId.create(item);
      multiTx.transactions.push(transactionAndChainId);
    });
    const tx = MultiTransaction.encode(multiTx).finish();
    if (tx instanceof Buffer) {
      return tx.toString('hex');
    }
    return uint8ArrayToHex(tx);
  }
  /**
   * Prepares parameters for a multi-transaction synchronously.
   *
   * @param {Array<any>} args - The method arguments.
   * @returns {string} - The raw multi-transaction data.
   */

  multiPrepareParameters(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    // encoded -> params object
    const encoded = {};
    this._chainIds.forEach(ele => {
      const { method, params } = filterArgs[0][ele];
      this._name[ele] = method;
      encoded[ele] = this.packInput(method, params);
    });
    const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
    const chainHeight = {};
    const chainHash = {};
    this._chainIds.forEach(chainId => {
      // get chain height and hash
      const httpProvider = new HttpProvider(this._multiOptions[chainId].chainUrl);
      const url = 'blockChain/chainStatus';
      try {
        const statusRes = httpProvider.send({
          url,
          method: 'GET'
        });
        let { BestChainHeight, BestChainHash } = statusRes;
        if (refBlockNumberStrategy?.[chainId]) {
          BestChainHeight += refBlockNumberStrategy[chainId];
          const blockUrl = 'blockChain/blockByHeight';
          const block = httpProvider.send({
            url: blockUrl,
            method: 'GET',
            params: {
              blockHeight: BestChainHeight
            }
          });
          BestChainHash = block.BlockHash;
        }
        chainHeight[chainId] = BestChainHeight;
        chainHash[chainId] = BestChainHash;
      } catch (error) {
        console.error(`Error fetching status for chain ${chainId}:`, error);
        throw error;
      }
    });
    return this.handleMultiTransaction(chainHeight, chainHash, encoded);
  }
  /**
   * Prepares parameters for a multi-transaction asynchronously.
   *
   * @param {Array<any>} args - The method arguments.
   * @returns {Promise<string>} - A Promise that resolves to the raw multi-transaction data.
   */

  async multiPrepareParametersAsync(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    // encoded -> params object
    const encoded = {};
    this._chainIds.forEach(ele => {
      const { method, params } = filterArgs[0][ele];
      this._name[ele] = method;
      encoded[ele] = this.packInput(method, params);
    });
    const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
    const chainHeight = {};
    const chainHash = {};
    await Promise.all(
      this._chainIds.map(async chainId => {
        const httpProvider = new HttpProvider(this._multiOptions[chainId]?.chainUrl);
        const url = 'blockChain/chainStatus';
        try {
          const statusRes = await httpProvider.sendAsync({
            url,
            method: 'GET'
          });
          let { BestChainHeight, BestChainHash } = statusRes;
          if (refBlockNumberStrategy?.[chainId]) {
            BestChainHeight += refBlockNumberStrategy[chainId];
            const blockUrl = 'blockChain/blockByHeight';
            const block = await httpProvider.sendAsync({
              url: blockUrl,
              method: 'GET',
              params: {
                blockHeight: BestChainHeight
              }
            });
            BestChainHash = block.BlockHash;
          }
          chainHeight[chainId] = BestChainHeight;
          chainHash[chainId] = BestChainHash;
        } catch (error) {
          console.error(`Error fetching status for chain ${chainId}:`, error);
          throw error;
        }
      })
    );
    return this.handleMultiTransaction(chainHeight, chainHash, encoded);
  }
  /**
   * Sends a multi-transaction to the gateway.
   *
   * @param {...Array<any>} args - The arguments for the transaction, including options and callbacks.
   * @returns {Promise<any>} - A Promise that resolves to the response data from the gateway.
   * @throws {Error} - Throws an error if the multi options are not set or if the response is not successful.
   */

  sendMultiTransactionToGateway(...args) {
    if (!validateMulti(this._multiOptions)) {
      throw new Error('Please set the chainInfo in option multi');
    }
    const argsObject = this.extractArgumentsIntoObject(args);
    const httpProvider = new HttpProvider(this._gatewayUrl);
    const url = 'gateway/sendUserSignedMultiTransaction';
    if (argsObject.isSync) {
      const params = this.multiPrepareParameters(args);
      const { data, message, code } = httpProvider.send({
        url,
        method: 'POST',
        params: {
          RawMultiTransaction: params
        }
      });
      if (data != null && code === 200) {
        return data;
      }
      throw new Error(message);
    }
    // eslint-disable-next-line arrow-body-style
    return this.multiPrepareParametersAsync(args).then(async params => {
      const { data, message, code } = await httpProvider.sendAsync({
        url,
        method: 'POST',
        params: {
          RawMultiTransaction: params
        }
      });
      if (data != null && code === 200) {
        argsObject.callback(data);
        return data;
      }
      throw new Error(message);
    });
  }
  /**
   * Gets the raw transaction data for a multi-transaction.
   *
   * @param {TBlockHeight} blockHeightInput - The height of the block for reference.
   * @param {TBlockHash} blockHashInput - The hash of the block for reference.
   * @param {Buffer} packedInput - The packed input data for the transaction.
   * @param {TChainId} chainId - The chain ID for the transaction.
   * @returns {TRawTx} - The raw transaction object containing all relevant information.
   */

  getRawTx(blockHeightInput, blockHashInput, packedInput, chainId) {
    // multi
    const rawTx = getTransactionAndChainId(
      this._wallet.address,
      this._multiOptions[chainId]?.contractAddress,
      this._name[chainId],
      packedInput,
      chainId
    );
    if (blockHeightInput) {
      rawTx.refBlockNumber = blockHeightInput;
    }
    if (blockHashInput) {
      const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
      rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
    }
    return rawTx;
  }
}
