import BaseType from './base';
import { formatInputSideChainInfo, formatOutputSideChainInfo } from './formatters';

// todo: 确认缺少的formatters
export default class TypeSideChainInfo extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputSideChainInfo;
    this._outputFormatter = formatOutputSideChainInfo;
  }

  isType(name) {
    return !!name.match(/^AElf\.Kernel\.SideChainInfo$/);
  }
}
