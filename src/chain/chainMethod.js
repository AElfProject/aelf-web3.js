/**
 * @file method on chain
 * @author atom-yang
 */
import { isFunction, noop, isBoolean } from '../util/utils';
/**
 * @typedef {import('../../types/util/requestManage').RequestManager } RequestManager
 * @typedef {import('../../types/chain/chainMethod').ExtractArg} ExtractArg
 * @typedef {import('../../types/chain/chainMethod').ExtractArgumentsIntoObjectResult}
 */
/**
 * @typedef {Object} ChainMethodParams
 * @property {string} name - The name of the chain method.
 * @property {string} call - The blockchain method to be called.
 * @property {string} [method] - HTTP method used for the request.
 * @property {Array<string>} [params] - List of parameter names expected by the method.
 * @property {Array<Function>} [inputFormatter] - Functions to format the input parameters.
 * @property {Function|null} [outputFormatter] - Function to format the output of the request.
 */
export default class ChainMethod {
  /**
   * Constructs a new ChainMethod instance.
   * @param {ChainMethodParams} params - Parameters to initialize the chain method.
   */

  constructor({ name, call, method = 'GET', params = [], inputFormatter = [], outputFormatter = null }) {
    this.name = name;
    this.call = call;
    this.requestMethod = method;
    this.params = params;
    this.inputFormatter = inputFormatter;
    this.outputFormatter = outputFormatter;
    this.requestManager = null;
    this.run = this.run.bind(this);
  }
  /**
   * Formats the input parameters using the provided input formatters.
   * @param {Array<any>} args - Arguments to be formatted.
   * @returns {Array<any>} - The formatted arguments.
   */

  formatInput(args) {
    if (!this.inputFormatter || this.inputFormatter.length === 0) {
      return args;
    }

    return args.map((arg, index) => {
      const formatter = this.inputFormatter[index];
      return formatter ? formatter(arg) : arg;
    });
  }
  /**
   * Sets the request manager responsible for sending blockchain requests.
   * @param {RequestManager} manager - The request manager to handle the requests.
   */

  setRequestManager(manager) {
    this.requestManager = manager;
  }
  /**
   * Formats the output result using the specified output formatter.
   * @param {any} result - The result from the blockchain call.
   * @returns {any} - The formatted result.
   */

  formatOutput(result) {
    return this.outputFormatter && result ? this.outputFormatter(result) : result;
  }
  /**
   * Extracts the arguments into an object that contains the method name, parameters, and other metadata.
   * @param {ExtractArg[]} args - The arguments to be processed.
   * @returns {ExtractArgumentsIntoObjectResult} - The processed arguments in a standardized object format.
   * @throws {Error} If not enough parameters are supplied.
   */

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
        if (isBoolean(arg?.sync)) {
          result.isSync = arg.sync;
        }
      } else {
        // if index is less than or equal to params.length, that means arg is one of the params
        result.params[this.params[index]] = arg;
      }
    });
    return result;
  }
  /**
   * Executes the blockchain method, either synchronously or asynchronously based on the arguments.
   * @param  {ExtractArg[]} args - Arguments for the method.
   * @returns {Object.<string, any> | Promise<Object.<string, any>>}} - The result of the method call, either as a value (sync) or a Promise (async).
   */

  run(...args) {
    const argsObj = this.extractArgumentsIntoObject(args);
    if (argsObj.isSync) {
      return this.formatOutput(this.requestManager.send(argsObj));
    }
    return this.requestManager
      .sendAsync(argsObj)
      .then(result => {
        argsObj.callback(null, this.formatOutput(result));
        return this.formatOutput(result);
      })
      .catch(err => {
        argsObj.callback(err);
        throw err;
      });
  }
}
