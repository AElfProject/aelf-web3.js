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
  OUTPUT_TRANSFORMERS,
} from '../util/transform';
import {
  isBoolean,
  isFunction,
  isNumber,
  noop,
  uint8ArrayToHex,
  unpackSpecifiedTypeData,
} from '../util/utils';
import wallet from '../wallet';

export default class ContractMethod {
  constructor(chain, method, contractAddress, walletInstance) {
    this._chain = chain;
    this._method = method;
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
      dataType: this._inputType,
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
      dataType: this._outputType,
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
    if (tx instanceof Buffer) {
      return tx.toString('hex');
    }
    return uint8ArrayToHex(tx);
  }

  prepareParametersAsync(args, isView) {
    const filterArgs = args.filter(
      arg => !isFunction(arg) && !isBoolean(arg.sync)
    );
    const encoded = this.packInput(filterArgs[0]);

    if (isView) {
      return Promise.resolve(this.handleTransaction('', '', encoded));
    }
    return this._chain.getChainStatus().then(status => {
      const { BestChainHeight, BestChainHash } = status;
      return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
    });
  }

  prepareParameters(args, isView) {
    const filterArgs = args.filter(
      arg => !isFunction(arg) && !isBoolean(arg.sync)
    );
    const encoded = this.packInput(filterArgs[0]);

    if (isView) {
      return this.handleTransaction('', '', encoded);
    }

    const { BestChainHeight, BestChainHash } = this._chain.getChainStatus({
      sync: true,
    });

    return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
  }

  prepareParametersWithBlockInfo(args) {
    const filterArgs = args.filter(
      arg => !isFunction(arg) && !isBoolean(arg.sync)
    );
    const encoded = this.packInput(filterArgs[0]);

    const { height, hash } = filterArgs[1]; // blockInfo

    return this.handleTransaction(height, hash, encoded);
  }

  sendTransaction(...args) {
    const argsObject = this.extractArgumentsIntoObject(args);
    if (argsObject.isSync) {
      const parameters = this.prepareParameters(args);
      return this._chain.sendTransaction(parameters, {
        sync: true,
      });
    }
    // eslint-disable-next-line arrow-body-style
    return this.prepareParametersAsync(args).then(parameters => {
      return this._chain.sendTransaction(parameters, argsObject.callback);
    });
  }

  callReadOnly(...args) {
    const argsObject = this.extractArgumentsIntoObject(args);
    if (argsObject.isSync) {
      const parameters = this.prepareParameters(args, true);
      return this.unpackOutput(
        this._chain.callReadOnly(parameters, {
          sync: true,
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
      isSync: false,
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
    const filterArgs = args.filter(
      arg => !isFunction(arg) && !isBoolean(arg.sync)
    );

    if (filterArgs[1]) {
      const { height, hash } = filterArgs[1]; // blockInfo
      if (hash && height) {
        return this.prepareParametersWithBlockInfo(args);
      }
      throw Error('The second param is the height & hash of a block');
    }

    return this.prepareParameters(args);
  }

  getRawTx(blockHeightInput, blockHashInput, packedInput) {
    const rawTx = getTransaction(
      this._wallet.address,
      this._contractAddress,
      this._name,
      packedInput
    );
    if (blockHeightInput) {
      rawTx.refBlockNumber = blockHeightInput;
    }
    if (blockHashInput) {
      const blockHash = blockHashInput.match(/^0x/)
        ? blockHashInput.substring(2)
        : blockHashInput;
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
      format: this.unpackOutput,
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
    run.getSignedTx = this.getSignedTx;
    run.getRawTx = this.getRawTx;
    run.unpackOutput = this.unpackOutput;
    // eslint-disable-next-line no-param-reassign
    contract[this._name] = run;
  }
}
