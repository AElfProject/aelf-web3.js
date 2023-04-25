import BaseType from './base';
import { formatInputMerklePath } from './formatters';

export default class TypeMerklePath extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputMerklePath;
  }

  isType(name) {
    return !!name.match(/^AElf\.Kernel\.MerklePath$/);
  }
}
