/**
 * @file contract method
 * @author atom-yang
 */
import { CHAIN_MAP } from '../common/constants';
import HttpProvider from '../util/httpProvider';
import {
  getTransactionAndChainId,
  getTransaction,
  Transaction,
  TransactionAndChainId,
  MultiTransaction
} from '../util/proto';
import {
  transformArrayToMap,
  transformMapToArray,
  transform,
  INPUT_TRANSFORMERS,
  OUTPUT_TRANSFORMERS
} from '../util/transform';
import {
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  noop,
  uint8ArrayToHex,
  unpackSpecifiedTypeData
} from '../util/utils';
import wallet from '../wallet';

export default class ContractMethod {
  constructor(chain, method, contractAddress, walletInstance, option) {
    this._chain = chain;
    this._method = method;
    this._option = option || {};
    this._gatewayUrl = this._option.gatewayUrl;
    this._multiOptions = this._option.multi || {};
    // multi chainId ['AELF', 'tDVW']
    this._chainIds = Object.keys(this._multiOptions);
    const { resolvedRequestType, resolvedResponseType } = method;
    this._inputType = resolvedRequestType;
    this._outputType = resolvedResponseType;
    this._name = method.name;
    this._contractAddress = contractAddress;
    this._wallet = walletInstance;
    this.sendTransaction = this.sendTransaction.bind(this);
    this.sendMultiTransactionToGateway = this.sendMultiTransactionToGateway.bind(this);
    this.unpackPackedInput = this.unpackPackedInput.bind(this);
    this.packInput = this.packInput.bind(this);
    this.unpackOutput = this.unpackOutput.bind(this);
    this.bindMethodToContract = this.bindMethodToContract.bind(this);
    this.run = this.run.bind(this);
    this.request = this.request.bind(this);
    this.callReadOnly = this.callReadOnly.bind(this);
    this.getSignedTx = this.getSignedTx.bind(this);
    this.getRawTx = this.getRawTx.bind(this);
  }

  packInput(input) {
    if (!input) {
      return null;
    }
    let params = transformMapToArray(this._inputType, input);
    params = transform(this._inputType, params, INPUT_TRANSFORMERS);
    const message = this._inputType.fromObject(params);
    return this._inputType.encode(message).finish();
  }

  unpackPackedInput(inputPacked) {
    if (!inputPacked) {
      return null;
    }
    const result = unpackSpecifiedTypeData({
      data: inputPacked,
      dataType: this._inputType
    });
    let params = transform(this._inputType, result, OUTPUT_TRANSFORMERS);
    params = transformArrayToMap(this._inputType, params);
    return params;
  }

  unpackOutput(output) {
    if (!output) {
      return null;
    }
    let result = unpackSpecifiedTypeData({
      data: isNumber(output) ? String(output) : output,
      dataType: this._outputType
    });
    result = transform(this._outputType, result, OUTPUT_TRANSFORMERS);
    result = transformArrayToMap(this._outputType, result);
    return result;
  }

  packOutput(result) {
    if (!result) {
      return null;
    }
    let params = transformMapToArray(this._outputType, result);

    params = transform(this._outputType, params, INPUT_TRANSFORMERS);

    const message = this._outputType.fromObject(params);
    return this._outputType.encode(message).finish();
  }

  handleTransaction(height, hash, encoded) {
    const rawTx = this.getRawTx(height, hash, encoded);
    let tx = wallet.signTransaction(rawTx, this._wallet.keyPair);
    tx = Transaction.encode(tx).finish();
    // jest environment just go into Buffer branch
    // we have test in browser example handly
    if (tx instanceof Buffer) {
      return tx.toString('hex');
    }
    return uint8ArrayToHex(tx);
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
    let { refBlockNumberStrategy } = this._option;
    args.forEach(arg => {
      if (arg.refBlockNumberStrategy) {
        if (isObject(arg.refBlockNumberStrategy)) {
          const keys = Object.keys(arg.refBlockNumberStrategy);
          for (let i = 0; i < keys.length; i++) {
            validateItem(arg.refBlockNumberStrategy(keys[i]));
            refBlockNumberStrategy[keys[i]] = arg.refBlockNumberStrategy[keys[i]];
          }
        } else {
          validateItem(arg.refBlockNumberStrategy);
          refBlockNumberStrategy = arg.refBlockNumberStrategy;
        }
      }
    });
    return refBlockNumberStrategy;
  }

  prepareParametersAsync(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    if (isView) {
      return Promise.resolve(this.handleTransaction('', '', encoded));
    }
    return this._chain.getChainStatus().then(status => {
      let { BestChainHeight, BestChainHash } = status;
      const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
      if (refBlockNumberStrategy) {
        BestChainHeight += refBlockNumberStrategy;
        const block = this._chain.getBlockByHeight(BestChainHeight, true, {
          sync: true
        });
        BestChainHash = block.BlockHash;
      }

      return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
    });
  }

  /**
   * @param {Array} args - argument
   * @param {boolean} isView - view method
   * @returns any
   */
  prepareParameters(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);
    if (isView) {
      return this.handleTransaction('', '', encoded);
    }
    const statusRes = this._chain.getChainStatus({
      sync: true
    });
    let { BestChainHeight, BestChainHash } = statusRes;
    const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
    if (refBlockNumberStrategy) {
      BestChainHeight += refBlockNumberStrategy;
      const block = this._chain.getBlockByHeight(BestChainHeight, true, {
        sync: true
      });
      BestChainHash = block.BlockHash;
    }

    return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
  }

  prepareParametersWithBlockInfo(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    const { height, hash } = filterArgs[1]; // blockInfo

    return this.handleTransaction(height, hash, encoded);
  }

  sendTransaction(...args) {
    const argsObject = this.extractArgumentsIntoObject(args);
    if (argsObject.isSync) {
      const parameters = this.prepareParameters(args);
      return this._chain.sendTransaction(parameters, {
        sync: true
      });
    }
    // eslint-disable-next-line arrow-body-style
    return this.prepareParametersAsync(args).then(parameters => {
      return this._chain.sendTransaction(parameters, argsObject.callback);
    });
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
      encoded[ele] = this.packInput(filterArgs[0][ele]);
    });
    // if (isView) {
    //   return this.handleMultiTransaction({}, {}, encoded);
    // }
    const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
    const chainHeight = {};
    const chainHash = {};
    this._chainIds.forEach(chainId => {
      // get chain height and hash
      const httpProvider = new HttpProvider(this._multiOptions[chainId].chainUrl);
      const url = 'api/blockChain/chainStatus';
      const statusRes = httpProvider.send({
        url,
        method: 'GET'
      });
      let { BestChainHeight, BestChainHash } = statusRes;
      if (refBlockNumberStrategy[chainId]) {
        BestChainHeight += refBlockNumberStrategy[chainId];
        const block = this._chain.getBlockByHeight(BestChainHeight, true, {
          sync: true
        });
        BestChainHash = block.BlockHash;
      }
      chainHeight[chainId] = BestChainHeight;
      chainHash[chainId] = BestChainHash;
    });
    return this.handleMultiTransaction(chainHeight, chainHash, encoded);
  }

  async multiPrepareParametersAsync(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));

    // encoded -> params object
    const encoded = {};
    this._chainIds.forEach(ele => {
      encoded[ele] = this.packInput(filterArgs[0][ele]);
    });

    // if (isView) {
    //   return this.handleMultiTransaction({}, {}, encoded);
    // }

    const refBlockNumberStrategy = this.validateRefBlockNumberStrategy(args);
    // console.log(refBlockNumberStrategy, 'refBlockNumberStrategy');
    const chainHeight = {};
    const chainHash = {};

    await Promise.all(
      this._chainIds.map(async chainId => {
        const httpProvider = new HttpProvider(this._multiOptions[chainId].chainUrl);
        const url = 'blockChain/chainStatus';

        try {
          const statusRes = await httpProvider.sendAsync({
            url,
            method: 'GET'
          });
          let { BestChainHeight, BestChainHash } = statusRes;
          if (refBlockNumberStrategy?.[chainId]) {
            BestChainHeight += refBlockNumberStrategy[chainId];
            const block = this._chain.getBlockByHeight(BestChainHeight, true, {
              sync: true
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
    const argsObject = this.extractArgumentsIntoObject(args);
    const httpProvider = new HttpProvider(this._gatewayUrl);
    const url = 'gateway/sendUserSignedMultiTransaction';
    if (argsObject.isSync) {
      const params = this.multiPrepareParameters(args);
      const { data } = httpProvider.send({
        url,
        method: 'POST',
        params: {
          RawMultiTransaction: params
        }
      });
      const updatedData = {};
      this._chainIds.forEach(chainId => {
        updatedData[chainId] = data[CHAIN_MAP[chainId]];
      });
      return updatedData;
    }
    // eslint-disable-next-line arrow-body-style
    return this.multiPrepareParametersAsync(args).then(async params => {
      const { data } = await httpProvider.sendAsync({
        url,
        method: 'POST',
        params: {
          RawMultiTransaction: params
        }
      });
      const updatedData = {};
      this._chainIds.forEach(chainId => {
        updatedData[chainId] = data[CHAIN_MAP[chainId]];
      });
      argsObject.callback(updatedData);
      return updatedData;
    });
  }

  callReadOnly(...args) {
    const argsObject = this.extractArgumentsIntoObject(args);
    if (argsObject.isSync) {
      const parameters = this.prepareParameters(args, true);
      return this.unpackOutput(
        this._chain.callReadOnly(parameters, {
          sync: true
        })
      );
    }
    // eslint-disable-next-line arrow-body-style
    return this.prepareParametersAsync(args, true).then(parameters => {
      return this._chain
        .callReadOnly(parameters, (error, result) => {
          argsObject.callback(error, this.unpackOutput(result));
        })
        .then(this.unpackOutput);
    });
  }

  extractArgumentsIntoObject(args) {
    const result = {
      callback: noop,
      isSync: false
    };
    if (args.length === 0) {
      // has no callback, default to be async mode
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

  // getData(...args) {
  getSignedTx(...args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));

    if (filterArgs[1]) {
      const { height, hash } = filterArgs[1]; // blockInfo
      if (hash && height) {
        return this.prepareParametersWithBlockInfo(args);
      }
      throw Error('The second param is the height & hash of a block');
    }

    return this.prepareParameters(args);
  }

  getRawTx(blockHeightInput, blockHashInput, packedInput, chainId) {
    let rawTx;
    if (chainId) {
      // multi
      rawTx = getTransactionAndChainId(
        this._wallet.address,
        this._multiOptions[chainId]?.contractAddress,
        this._name,
        packedInput,
        CHAIN_MAP[chainId]
      );
    } else {
      rawTx = getTransaction(this._wallet.address, this._contractAddress, this._name, packedInput);
    }
    if (blockHeightInput) {
      rawTx.refBlockNumber = blockHeightInput;
    }
    if (blockHashInput) {
      const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
      rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
    }
    return rawTx;
  }

  request(...args) {
    const { callback } = this.extractArgumentsIntoObject(args);
    const params = this.prepareParameters(args);
    return {
      method: 'broadcast_tx',
      callback,
      params,
      format: this.unpackOutput
    };
  }

  run(...args) {
    return this.sendTransaction(...args);
  }

  bindMethodToContract(contract) {
    const { run } = this;
    run.request = this.request;
    run.call = this.callReadOnly;
    run.inputTypeInfo = this._inputType.toJSON();
    run.inputType = this._inputType;
    run.outputTypeInfo = this._outputType.toJSON();
    run.outputType = this._outputType;
    run.unpackPackedInput = this.unpackPackedInput;
    run.packInput = this.packInput;
    run.packOutput = this.packOutput.bind(this);
    run.sendTransaction = this.sendTransaction;
    run.sendMultiTransactionToGateway = this.sendMultiTransactionToGateway;
    run.getSignedTx = this.getSignedTx;
    run.getRawTx = this.getRawTx;
    run.unpackOutput = this.unpackOutput;
    // eslint-disable-next-line no-param-reassign
    contract[this._name] = run;
  }
}
