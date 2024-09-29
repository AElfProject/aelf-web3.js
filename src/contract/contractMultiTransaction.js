/**
 * @file contract method
 * @author atom-yang
 */
import HttpProvider from '../util/httpProvider';
import { getTransactionAndChainId, TransactionAndChainId, MultiTransaction } from '../util/proto';
import { transformMapToArray, transform, INPUT_TRANSFORMERS } from '../util/transform';
import { isBoolean, isFunction, isObject, noop, uint8ArrayToHex, validateMulti } from '../util/utils';
import wallet from '../wallet';

export default class ContractMultiTransaction {
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
