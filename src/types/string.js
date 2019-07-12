import BaseType from './base';
import { formatInputString, formatOutputString } from './formatters';

export default class TypeString extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputString;
    this._outputFormatter = formatOutputString;
  }

  isType(name) {
    return !!name.match(/^string$/);
  }
}
