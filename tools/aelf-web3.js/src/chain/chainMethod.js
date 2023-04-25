/**
 * @file method on chain
 * @author atom-yang
 */
import { isFunction, noop, isBoolean } from '../util/utils';

export default class ChainMethod {
  constructor(
    {
      name,
      call,
      method = 'GET',
      params = [],
      inputFormatter = [],
      outputFormatter = null
    }
  ) {
    this.name = name;
    this.call = call;
    this.requestMethod = method;
    this.params = params;
    this.inputFormatter = inputFormatter;
    this.outputFormatter = outputFormatter;
    this.requestManager = null;
    this.run = this.run.bind(this);
  }

  formatInput(args) {
    if (!this.inputFormatter || this.inputFormatter.length === 0) {
      return args;
    }

    return args.map((arg, index) => {
      const formatter = this.inputFormatter[index];
      return formatter ? formatter(arg) : arg;
    });
  }

  setRequestManager(manager) {
    this.requestManager = manager;
  }

  formatOutput(result) {
    return this.outputFormatter && result ? this.outputFormatter(result) : result;
  }

  extractArgumentsIntoObject(args) {
    if (args.length < this.params.length) {
      throw new Error(`should supply enough parameters for ${this.call}`);
    }
    const result = {
      method: this.call,
      requestMethod: this.requestMethod,
      isSync: false,
      callback: noop,
      params: {}
    };
    this.formatInput(args).forEach((arg, index) => {
      if (index > this.params.length - 1) {
        // if index is greater than params.length, that means arg is an extra argument
        if (isFunction(arg)) {
          // if there is a callback, user want to be in async mode, set isSync to false
          result.callback = arg;
          result.isSync = false;
        }
        if (isBoolean(arg.sync)) {
          result.isSync = arg.sync;
        }
      } else {
        // if index is less than or equal to params.length, that means arg is one of the params
        result.params[this.params[index]] = arg;
      }
    });
    return result;
  }

  run(...args) {
    const argsObj = this.extractArgumentsIntoObject(args);
    if (argsObj.isSync) {
      return this.formatOutput(this.requestManager.send(argsObj));
    }
    return this.requestManager.sendAsync(argsObj).then(result => {
      argsObj.callback(null, this.formatOutput(result));
      return this.formatOutput(result);
    }).catch(err => {
      argsObj.callback(err);
      throw err;
    });
  }
}
