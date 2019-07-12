import BaseType from './base';
import { formatInputAddress, formatOutputAddress } from './formatters';

export default class TypeInt extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputAddress;
    this._outputFormatter = formatOutputAddress;
  }

  isType(name) {
    return !!name.match(/^int$/);
  }
}
