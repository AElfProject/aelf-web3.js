/**
 * @file contract method
 * @author atom-yang
 */
import {
  getTransaction,
  Transaction
} from '../util/proto';
import {
  arrayToHex,
  base58,
  decodeAddressRep,
  encodeAddressRep,
  isBoolean,
  isFunction,
  noop,
  uint8ArrayToHex
} from '../util/utils';
import {
  inputAddressFormatter
} from '../util/formatters';
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

const isAddress = resolvedType => isWrappedBytes(resolvedType, 'Address');

const isHash = resolvedType => isWrappedBytes(resolvedType, 'Hash');

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

function transform(inputType, origin, transformers = []) {
  const fieldsLength = inputType.fieldsArray.length;
  let result = origin;
  if (fieldsLength === 0) {
    return origin;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const { filter, transformer } of transformers) {
    if (filter(inputType) && origin) {
      return transformer(origin);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(inputType.fields).forEach(field => {
    const {
      rule,
      name,
      resolvedType
    } = inputType.fields[field];
    if (resolvedType) {
      if (rule && rule === 'repeated') {
        let value = origin[name];
        if (value && Array.isArray(value)) {
          value = value.map(item => transform(resolvedType, item, transformers));
        }
        result = {
          ...result,
          [name]: value
        };
      } else {
        result = {
          ...result,
          [name]: transform(resolvedType, origin[name], transformers)
        };
      }
    }
  });
  return result;
}


function transformMapToArray(inputType, origin) {
  const fieldsLength = inputType.fieldsArray.length;
  let result = origin;
  if (!origin) {
    return origin;
  }
  if (fieldsLength === 0 || (fieldsLength === 1 && !inputType.fieldsArray[0].resolvedType)) {
    return origin;
  }
  if (isAddress(inputType) || isHash(inputType)) {
    return origin;
  }
  const {
    fields,
    options
  } = inputType;
  if (fieldsLength === 2 && fields.value && fields.key && options.map_entry === true) {
    return Object.keys(origin || {}).map(key => ({ key, value: origin[key] }));
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(inputType.fields).forEach(field => {
    const {
      name,
      resolvedType
    } = inputType.fields[field];
    if (resolvedType) {
      if (origin[name] && Array.isArray(origin[name])) {
        let value = origin[name];
        value = value.map(item => transformMapToArray(resolvedType, item));
        result = {
          ...result,
          [name]: value
        };
      } else {
        result = {
          ...result,
          [name]: transformMapToArray(resolvedType, origin[name])
        };
      }
    }
  });
  return result;
}

function transformArrayToMap(inputType, origin) {
  const fieldsLength = inputType.fieldsArray.length;
  let result = origin;
  if (fieldsLength === 0 || (fieldsLength === 1 && !inputType.fieldsArray[0].resolvedType)) {
    return origin;
  }
  if (isAddress(inputType) || isHash(inputType)) {
    return origin;
  }
  const {
    fields,
    options
  } = inputType;
  if (fieldsLength === 2 && fields.value && fields.key && options.map_entry === true) {
    return origin.reduce((acc, v) => ({
      ...acc,
      [v.key]: v.value
    }), {});
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(fields).forEach(field => {
    const {
      name,
      resolvedType
    } = fields[field];
    if (resolvedType) {
      if (origin[name] && Array.isArray(origin[name])) {
        const {
          fieldsArray,
          fields: resolvedFields,
          options: resolvedOptions
        } = resolvedType;
        // eslint-disable-next-line max-len
        if (fieldsArray.length === 2 && resolvedFields.value && resolvedFields.key && resolvedOptions.map_entry === true) {
          result = {
            ...result,
            [name]: origin[name].reduce((acc, v) => ({
              ...acc,
              [v.key]: v.value
            }), {})
          };
        } else {
          let value = origin[name];
          value = value.map(item => transformArrayToMap(resolvedType, item));
          result = {
            ...result,
            [name]: value
          };
        }
      } else {
        result = {
          ...result,
          [name]: transformArrayToMap(resolvedType, origin[name])
        };
      }
    }
  });
  return result;
}

const INPUT_TRANSFORMERS = [
  {
    filter: isAddress,
    transformer: origin => {
      let result = origin;
      if (typeof origin === 'string') {
        result = {
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(origin)), 'hex')
        };
      }
      if (Array.isArray(origin)) {
        result = origin.map(h => ({
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(h)), 'hex')
        }));
      }
      return result;
    }
  },
  {
    filter: isHash,
    transformer: origin => {
      let result = origin;
      if (typeof origin === 'string') {
        result = {
          value: Buffer.from(origin.replace('0x', ''), 'hex')
        };
      }
      if (Array.isArray(origin)) {
        result = origin.map(h => ({
          value: Buffer.from(h.replace('0x', ''), 'hex')
        }));
      }
      return result;
    }
  },
];

function messageToHex(message) {
  return arrayToHex(message.value);
}

function encodeAddress(str) {
  const buf = Buffer.from(str, 'base64');
  return base58.encode(buf);
}

const OUTPUT_TRANSFORMERS = [
  {
    filter: isAddress,
    transformer: origin => {
      let result = origin;
      if (Array.isArray(result)) {
        result = result.map(h => encodeAddress(h.value));
      }
      if (typeof result !== 'string') {
        result = encodeAddress(result.value);
      }
      return result;
    }
  },
  {
    filter: isHash,
    transformer: origin => {
      let result = origin;
      if (Array.isArray(result)) {
        result = result.map(h => Buffer.from(h.value, 'base64').toString('hex'));
      }
      if (typeof result !== 'string') {
        result = Buffer.from(result.value, 'base64').toString('hex');
      }
      return result;
    }
  },
];

// eslint-disable-next-line no-unused-vars
function polyfillAddress(inputType) {
  const Address = inputType.lookupType('Address');
  if (Address.fieldsArray.length === 1 && Address.fieldsArray[0].type === 'bytes') {
    if (Address.originalFromObject && Address.originalToObject) {
      return;
    }
    Address.originalFromObject = Address.fromObject;
    Address.fromObject = (origin, ...args) => {
      console.log('origin address', origin);
      let result = origin;
      if (typeof origin === 'string') {
        result = {
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(origin)), 'hex')
        };
      }
      // todo: 好像没有必要？
      if (Array.isArray(origin)) {
        console.log('array address');
        result = origin.map(h => ({
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(h)), 'hex')
        }));
      }
      return Address.originalFromObject(result, ...args);
    };

    Address.originalToObject = Address.toObject;
    Address.toObject = (origin, ...args) => {
      console.log('origin address', origin);
      let result = Address.originalToObject(origin, ...args);
      if (Array.isArray(result)) {
        console.log('array address');
        result = result.map(h => encodeAddressRep(messageToHex(h)));
      }
      if (typeof result !== 'string') {
        result = encodeAddressRep(messageToHex(result));
      }
      return result;
    };
  }
}


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
      data: output,
      dataType: this._outputType
    });
    result = transform(this._outputType, result, OUTPUT_TRANSFORMERS);
    result = transformArrayToMap(this._outputType, result);
    return result;
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

  getRawTx(blockHeightInput, blockHashInput, packedInput) {
    const rawTx = getTransaction(this._wallet.address, this._contractAddress, this._name, packedInput);

    rawTx.refBlockNumber = blockHeightInput;
    const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
    rawTx.refBlockPrefix = (Buffer.from(blockHash, 'hex')).slice(0, 4);
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
    run.sendTransaction = this.sendTransaction;
    run.getSignedTx = this.getSignedTx;
    run.getRawTx = this.getRawTx;
    // eslint-disable-next-line no-param-reassign
    contract[this._name] = run;
  }
}
