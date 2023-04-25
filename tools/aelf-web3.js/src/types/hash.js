import BaseType from './base';
import { formatInputHash, formatOutputHash } from './formatters';

export default class TypeHash extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputHash;
    this._outputFormatter = formatOutputHash;
  }

  isType(name) {
    return !!name.match(/^AElf\.Common\.Hash$/);
  }
}
