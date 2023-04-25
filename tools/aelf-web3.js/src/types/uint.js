import BaseType from './base';
import { formatInputUInt, formatOutputUInt } from './formatters';

export default class TypeUInt extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputUInt;
    this._outputFormatter = formatOutputUInt;
  }

  isType(name) {
    return !!name.match(/^uint$/);
  }
}
