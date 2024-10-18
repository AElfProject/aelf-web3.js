/**
 * @file contract method
 * @author atom-yang
 */
import { getTransaction, Transaction } from '../util/proto';
import {
  transformArrayToMap,
  transformMapToArray,
  transform,
  INPUT_TRANSFORMERS,
  OUTPUT_TRANSFORMERS
} from '../util/transform';
import { isBoolean, isFunction, isNumber, noop, uint8ArrayToHex, unpackSpecifiedTypeData } from '../util/utils';
import wallet from '../wallet';
/**
 * @typedef {import('../../types/chain').default} Chain
 * @typedef {import('../../types/util/proto').TAddress} TAddress
 * @typedef {import('../../types/util/proto').TBlockHash} TBlockHash
 * @typedef {import('../../types/util/proto').TBlockHeight} TBlockHeight
 * @typedef {import('../../types/util/proto').TTransactionId} TTransactionId
 * @typedef {import('../../types/contract/contractMethod').IExtractArgumentsIntoObject} IExtractArgumentsIntoObject
 * @typedef {import('../../types/contract/contractMethod').TRawTx} TRawTx
 * @typedef {import('../../types/contract/contractMethod').IRequestResult} IRequestResult
 * @typedef {import('../../types/contract/index').Contract} Contract
 * @typedef {import('../../types/wallet').IWalletInfo} IWalletInfo
 * @typedef {import('@aelfqueen/protobufjs')} protobuf
 */
export default class ContractMethod {
  /**
   * Creates an instance of ContractMethod.
   *
   * @param {Chain} chain - The blockchain instance.
   * @param {protobuf.Method} method - The protobuf method object defining input/output types.
   * @param {TAddress} contractAddress - The address of the contract.
   * @param {IWalletInfo} walletInstance - The wallet instance containing keys and addresses.
   * @param {Object.<string, any>} option - Additional options for the method.
   */

  constructor(chain, method, contractAddress, walletInstance, option) {
    this._chain = chain;
    this._method = method;
    this._option = option || {};
    const { resolvedRequestType, resolvedResponseType } = method;
    this._inputType = resolvedRequestType;
    this._outputType = resolvedResponseType;
    this._name = method.name;
    this._contractAddress = contractAddress;
    this._wallet = walletInstance;

    this.sendTransaction = this.sendTransaction.bind(this);
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
  /**
   * Packs input data into a Buffer for the blockchain transaction.
   *
   * @param {any} input - The input data for the method.
   * @returns {Buffer|null} - Packed input data or null if no input is provided.
   */

  packInput(input) {
    if (!input) {
      return null;
    }
    let params = transformMapToArray(this._inputType, input);
    params = transform(this._inputType, params, INPUT_TRANSFORMERS);
    const message = this._inputType.fromObject(params);
    return this._inputType.encode(message).finish();
  }
  /**
   * Unpacks a packed input into its original form.
   *
   * @param {ArrayBuffer|SharedArrayBuffer|null} inputPacked - The packed input data.
   * @returns {any} - The unpacked input data.
   */

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
  /**
   * Unpacks output data from a blockchain response.
   *
   * @param {ArrayBuffer|SharedArrayBuffer|null} output - The packed output data.
   * @returns {any} - The unpacked output data.
   */

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
  /**
   * Packs output data into a Buffer.
   *
   * @param {any} result - The result data to be packed.
   * @returns {Buffer|null} - Packed result data or null if no result is provided.
   */

  packOutput(result) {
    if (!result) {
      return null;
    }
    let params = transformMapToArray(this._outputType, result);

    params = transform(this._outputType, params, INPUT_TRANSFORMERS);

    const message = this._outputType.fromObject(params);
    return this._outputType.encode(message).finish();
  }
  /**
   * Handles transaction creation by signing the transaction and encoding it.
   *
   * @param {TBlockHeight} height - The block height reference.
   * @param {TBlockHash} hash - The block hash reference.
   * @param {any} encoded - The encoded input data.
   * @returns {string} - The signed transaction in hexadecimal format.
   */

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
  /**
   * Prepares parameters for asynchronous transaction execution.
   *
   * @param {Array<any>} args - The method arguments.
   * @param {boolean} [isView=false] - Whether the method is a view method.
   * @returns {Promise<string>} - The prepared transaction data.
   */

  prepareParametersAsync(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    if (isView) {
      return Promise.resolve(this.handleTransaction('', '', encoded));
    }
    return this._chain.getChainStatus().then(status => {
      let { BestChainHeight, BestChainHash } = status;

      let { refBlockNumberStrategy } = this._option || {};

      args.forEach(arg => {
        if (arg.refBlockNumberStrategy) {
          // eslint-disable-next-line max-len
          if (typeof arg.refBlockNumberStrategy !== 'number') {
            throw new Error('Invalid type, refBlockNumberStrategy must be number');
          }
          if (arg.refBlockNumberStrategy > 0) {
            throw new Error('refBlockNumberStrategy must be less than 0');
          }
          refBlockNumberStrategy = arg.refBlockNumberStrategy;
        }
      });

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
   * Prepares parameters for synchronous transaction execution.
   *
   * @param {Array<any>} args - The method arguments.
   * @param {boolean} isView - Whether the method is a view method.
   * @returns {string} - The prepared transaction data.
   */

  prepareParameters(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    if (isView) {
      return this.handleTransaction('', '', encoded);
    }

    let { refBlockNumberStrategy } = this._option;

    args.forEach(arg => {
      if (arg.refBlockNumberStrategy) {
        // eslint-disable-next-line max-len
        if (typeof arg.refBlockNumberStrategy !== 'number') {
          throw new Error('Invalid type, refBlockNumberStrategy must be number');
        }
        if (arg.refBlockNumberStrategy > 0) {
          throw new Error('refBlockNumberStrategy must be less than 0');
        }
        refBlockNumberStrategy = arg.refBlockNumberStrategy;
      }
    });

    const statusRes = this._chain.getChainStatus({
      sync: true
    });

    let { BestChainHeight, BestChainHash } = statusRes;

    if (refBlockNumberStrategy) {
      BestChainHeight += refBlockNumberStrategy;
      const block = this._chain.getBlockByHeight(BestChainHeight, true, {
        sync: true
      });
      BestChainHash = block.BlockHash;
    }

    return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
  }

  /**
   * Prepares the parameters for a transaction with block information.
   *
   * @param {Array<any>} args - The method arguments. The first argument is the input data,
   * and the second argument contains the block height and hash.
   * @returns {string} - The signed transaction.
   */

  prepareParametersWithBlockInfo(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    const { height, hash } = filterArgs[1]; // blockInfo

    return this.handleTransaction(height, hash, encoded);
  }
  /**
   * Sends a transaction to the blockchain.
   *
   * @param {...Array<any>} args - The method arguments. The last argument can be a callback function.
   * @returns {Promise<TTransactionId>|TTransactionId} - If async, returns a Promise that resolves with the transaction result, otherwise returns the result directly.
   */

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
  /**
   * Calls a read-only method on the blockchain.
   *
   * @param {Array<any>} args - The method arguments. The last argument can be a callback function.
   * @returns {Promise<any>|any} - If async, returns a Promise that resolves with the unpacked output, otherwise returns the result directly.
   */

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

  /**
   * Prepares a signed transaction, with optional block information.
   *
   * @param {...Array<any>} args - The method arguments. The second argument can be the block height and hash.
   * @returns {string} - The signed transaction data.
   * @throws {Error} - If the block information is incomplete.
   */

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
  /**
   * Constructs the raw transaction data.
   *
   * @param {TBlockHeight} blockHeightInput - The block height for the transaction.
   * @param {TBlockHash} blockHashInput - The block hash for the transaction.
   * @param {any} packedInput - The packed input data.
   * @returns {TRawTx} - The raw transaction object.
   */

  getRawTx(blockHeightInput, blockHashInput, packedInput) {
    const rawTx = getTransaction(this._wallet.address, this._contractAddress, this._name, packedInput);
    if (blockHeightInput) {
      rawTx.refBlockNumber = blockHeightInput;
    }
    if (blockHashInput) {
      const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
      rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
    }
    return rawTx;
  }
  /**
   * Prepares a request to be sent to the blockchain.
   *
   * @param {...Array<any>} args - The method arguments. The last argument can be a callback function.
   * @returns {IRequestResult} - An object containing the request method, callback, parameters, and format function.
   */

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
  /**
   * Runs a transaction on the blockchain.
   *
   * @param {...Array<any>} args - The method arguments. The last argument can be a callback function.
   * @returns {{ TransactionId: TTransactionId } | Promise<{ TransactionId: TTransactionId }>} - If async, returns a Promise that resolves with the transaction result, otherwise returns the result directly.
   */

  run(...args) {
    return this.sendTransaction(...args);
  }
  /**
   * Binds this contract method to a specific contract instance.
   *
   * @param {Contract} contract - The contract instance to bind the method to.
   */

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
    run.getSignedTx = this.getSignedTx;
    run.getRawTx = this.getRawTx;
    run.unpackOutput = this.unpackOutput;
    // eslint-disable-next-line no-param-reassign
    contract[this._name] = run;
  }
}
