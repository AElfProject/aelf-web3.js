import BaseType from './base';
import { formatInputInt, formatOutputInt } from './formatters';

export default class TypeBytes extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputInt;
    this._outputFormatter = formatOutputInt;
  }

  isType(name) {
    return !!name.match(/^int$/);
  }
}
