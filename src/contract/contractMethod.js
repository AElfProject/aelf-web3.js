/**
 * @file contract method
 * @author atom-yang
 */
import { getTransaction, Transaction } from '../util/proto.js';
import {
  transformArrayToMap,
  transformMapToArray,
  transform,
  INPUT_TRANSFORMERS,
  OUTPUT_TRANSFORMERS
} from '../util/transform.js';
import { isBoolean, isFunction, isNumber, noop, uint8ArrayToHex, unpackSpecifiedTypeData } from '../util/utils.js';
import wallet from '../wallet/index.js';

export default class ContractMethod {
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

  // ... (other methods remain unchanged)

  handleTransaction(height, hash, encoded, password) {
    const rawTx = this.getRawTx(height, hash, encoded);

    let tx = wallet.signTransaction(rawTx, this._wallet.keyPair, password);

    tx = Transaction.encode(tx).finish();
    // jest environment just go into Buffer branch
    // we have test in browser example handly
    if (tx instanceof Buffer) {
      return tx.toString('hex');
    }
    return uint8ArrayToHex(tx);
  }

  prepareParametersAsync(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);
    const password = filterArgs[1]?.password;

    if (isView) {
      return Promise.resolve(this.handleTransaction('', '', encoded, password));
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

      return this.handleTransaction(BestChainHeight, BestChainHash, encoded, password);
    });
  }

  prepareParameters(args, isView) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);
    const password = filterArgs[1]?.password;

    if (isView) {
      return this.handleTransaction('', '', encoded, password);
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

    return this.handleTransaction(BestChainHeight, BestChainHash, encoded, password);
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

  // ... (other methods remain unchanged)
}
