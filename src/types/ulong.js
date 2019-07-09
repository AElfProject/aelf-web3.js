import BaseType from './base';
import { formatInputULong, formatOutputULong } from './formatters';

export default class TypeULong extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputULong;
    this._outputFormatter = formatOutputULong;
  }

  isType(name) {
    return !!name.match(/^ulong$/);
  }
}
