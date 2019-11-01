/**
 * @file contract method
 * @author atom-yang
 */
import {
  getAddressObjectFromRep,
  getRepForAddress,
  getHashObjectFromHex,
  getRepForHash,
  getTransaction,
  Transaction
} from '../util/proto';
import {
  isBoolean,
  isFunction,
  noop,
  uint8ArrayToHex
} from '../util/utils';
import wallet from '../wallet';

const isWrappedBytes = (resolvedType, name) => {
  if (!resolvedType.name || resolvedType.name !== name) {
    return false;
  }
  if (!resolvedType.fieldsArray || resolvedType.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType.fieldsArray[0].type === 'bytes';
};

function getFieldPaths(checker, resolvedType, path) {
  if (!resolvedType) {
    return [];
  }
  if (checker(resolvedType)) {
    return [path];
  }
  const paths = [];
  resolvedType.resolve();
  if (!resolvedType.fieldsArray) {
    return paths;
  }
  resolvedType.fieldsArray.forEach(field => {
    paths.push(getFieldPaths(checker, field.resolve().resolvedType, path.concat([field.name])));
  });
  return paths;
}

// reformatter is executed when parents are not empty
const reformat = (obj, forSelf, paths, reformatter) => {
  if (forSelf) {
    return reformatter(obj);
  }
  if (!paths || paths.length === 0) {
    return obj;
  }

  paths.forEach(path => {
    let parent = obj;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent[path[i]];
      if (!parent) break;
    }
    if (parent) {
      const name = path[path.length - 1];
      const target = parent[name];
      if (target) {
        parent[name] = reformatter(target);
      }
    }
  });
  return obj;
};

const isAddress = resolvedType => isWrappedBytes(resolvedType, 'Address');

const getAddressFieldPaths = (resolvedType, path = []) => getFieldPaths(isAddress, resolvedType, path);

const maybeUglifyAddress = (obj, forSelf, paths) => reformat(obj, forSelf, paths, target => {
  if (typeof target === 'string') {
    return getAddressObjectFromRep(target);
  }
  return target;
});

export const maybePrettifyAddress = (obj, forSelf, paths) => reformat(obj, forSelf, paths, target => {
  if (Array.isArray(target)) {
    return target.map(h => getRepForAddress(h));
  }
  if (typeof target !== 'string') {
    return getRepForAddress(target);
  }
  return target;
});

const isHash = resolvedType => isWrappedBytes(resolvedType, 'Hash');

const getHashFieldPaths = (resolvedType, path = []) => getFieldPaths(isHash, resolvedType, path);

const maybeUglifyHash = (obj, forSelf, paths) => reformat(obj, forSelf, paths, target => {
  if (typeof target === 'string') {
    return getHashObjectFromHex(target);
  }
  if (Array.isArray(target)) {
    return target.map(h => getHashObjectFromHex(h));
  }
  return target;
});

const maybePrettifyHash = (obj, forSelf, paths) => reformat(obj, forSelf, paths, target => {
  if (typeof target !== 'string') {
    return getRepForHash(target);
  }
  return target;
});

const unpackSpecifiedTypeData = ({
  data,
  dataType
}) => {
  const buffer = Buffer.from(data, 'hex');
  const decoded = dataType.decode(buffer);
  const result = dataType.toObject(decoded, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true // includes virtual oneof fields set to the present field's name
  });
  return result;
};

export default class ContractMethod {
  constructor(chain, method, contractAddress, walletInstance) {
    this._chain = chain;
    this._method = method;
    const { resolvedRequestType, resolvedResponseType } = method;
    this._inputType = resolvedRequestType;
    this._outputType = resolvedResponseType;
    this._inputTypeAddressFieldPaths = getAddressFieldPaths(this._inputType);
    this._outputTypeAddressFieldPaths = getAddressFieldPaths(this._outputType);
    this._inputTypeHashFieldPaths = getHashFieldPaths(this._inputType);
    this._outputTypeHashFieldPaths = getHashFieldPaths(this._outputType);
    this._isInputTypeAddress = isAddress(this._inputType);
    this._isInputTypeHash = isHash(this._inputType);
    this._isOutputTypeAddress = isAddress(this._outputType);
    this._isOutputTypeHash = isHash(this._outputType);
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
  }

  packInput(input) {
    if (!input) {
      return null;
    }
    let result = maybeUglifyAddress(input, this._isInputTypeAddress, this._inputTypeAddressFieldPaths);
    result = maybeUglifyHash(result, this._isInputTypeHash, this._inputTypeHashFieldPaths);
    const message = this._inputType.fromObject(result);
    return this._inputType.encode(message).finish();
  }

  unpackPackedInput(inputPacked) {
    if (!inputPacked) {
      return null;
    }
    let result = unpackSpecifiedTypeData({
      data: inputPacked,
      dataType: this._inputType
    });
    result = maybePrettifyAddress(result, this._isInputTypeAddress, this._inputTypeAddressFieldPaths);
    return maybePrettifyHash(result, this._isInputTypeHash, this._inputTypeHashFieldPaths);
  }

  unpackOutput(output) {
    if (!output) {
      return null;
    }
    let result = unpackSpecifiedTypeData({
      data: output,
      dataType: this._outputType
    });
    result = maybePrettifyAddress(result, this._isOutputTypeAddress, this._outputTypeAddressFieldPaths);
    return maybePrettifyHash(result, this._isOutputTypeHash, this._outputTypeHashFieldPaths);
  }

  handleTransaction(height, hash, encoded) {
    const rawTx = getTransaction(this._wallet.address, this._contractAddress, this._name, encoded);

    rawTx.refBlockNumber = height;
    const blockHash = hash.match(/^0x/) ? hash.substring(2) : hash;
    rawTx.refBlockPrefix = (Buffer.from(blockHash, 'hex')).slice(0, 4);

    let tx = wallet.signTransaction(rawTx, this._wallet.keyPair);

    tx = Transaction.encode(tx).finish();
    if (tx instanceof Buffer) {
      return tx.toString('hex');
    }
    return uint8ArrayToHex(tx);
  }

  prepareParametersAsync(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    return this._chain.getChainStatus().then(status => {
      const { BestChainHeight, BestChainHash } = status;
      return this.handleTransaction(BestChainHeight, BestChainHash, encoded);
    });
  }

  prepareParameters(args) {
    const filterArgs = args.filter(arg => !isFunction(arg) && !isBoolean(arg.sync));
    const encoded = this.packInput(filterArgs[0]);

    const { BestChainHeight, BestChainHash } = this._chain.getChainStatus({
      sync: true
    });

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

  callReadOnly(...args) {
    const argsObject = this.extractArgumentsIntoObject(args);
    if (argsObject.isSync) {
      const parameters = this.prepareParameters(args);
      return this.unpackOutput(this._chain.callReadOnly(parameters, {
        sync: true
      }));
    }
    // eslint-disable-next-line arrow-body-style
    return this.prepareParametersAsync(args).then(parameters => {
      return this._chain.callReadOnly(parameters, (error, result) => {
        argsObject.callback(error, this.unpackOutput(result));
      }).then(this.unpackOutput);
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
      if (isBoolean((arg.sync))) {
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
    run.sendTransaction = this.sendTransaction;
    run.getSignedTx = this.getSignedTx;
    // eslint-disable-next-line no-param-reassign
    contract[this._name] = run;
  }
}
