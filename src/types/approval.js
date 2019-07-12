import BaseType from './base';
import { formatInputApproval, formatOutputApproval } from './formatters';

export default class TypeApproval extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputApproval;
    this._outputFormatter = formatOutputApproval;
  }

  isType(name) {
    return !!name.match(/^AElf\.Kernel\.Approval$/);
  }
}
