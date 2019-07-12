import BaseType from './base';
import { formatInputLong, formatOutputLong } from './formatters';

export default class TypeLong extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputLong;
    this._outputFormatter = formatOutputLong;
  }

  isType(name) {
    return !!name.match(/^long$/);
  }
}
