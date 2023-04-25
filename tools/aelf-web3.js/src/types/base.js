/**
 * @file base type for extending
 * @author atom-yang
 */

export default class BaseType {
  constructor(config) {
    this._inputFormatter = config.inputFormatter;
    this._outputFormatter = config.outputFormatter;
  }

  // eslint-disable-next-line class-methods-use-this
  isType(name) {
    throw new Error(`this method has not been implemented by sub class for type ${name}`);
  }

  encode(value, fieldNumber) {
    return this._inputFormatter(value, fieldNumber);
  }

  decode(bytes, name) {
    return this._outputFormatter(bytes, name);
  }
}
