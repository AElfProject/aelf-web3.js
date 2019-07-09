import BaseType from './base';
import { formatInputAuthorization, formatOutputAuthorization } from './formatters';

export default class TypeAuthorization extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputAuthorization;
    this._outputFormatter = formatOutputAuthorization;
  }

  isType(name) {
    return !!name.match(/^AElf\.Kernel\.Authorization$/);
  }
}
