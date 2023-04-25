import BaseType from './base';
import { formatInputBytes, formatOutputBytes } from './formatters';

export default class TypeBytes extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputBytes;
    this._outputFormatter = formatOutputBytes;
  }

  isType(name) {
    return !!name.match(/^byte\[\]$/);
  }
}
