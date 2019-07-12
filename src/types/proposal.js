import BaseType from './base';
import { formatInputProposal, formatOutputProposal } from './formatters';

export default class TypeProposal extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputProposal;
    this._outputFormatter = formatOutputProposal;
  }

  isType(name) {
    return !!name.match(/^AElf\.Kernel\.Proposal$/);
  }
}
