import BaseType from './base';
import { formatInputBool, formatOutputBool } from './formatters';

export default class TypeBool extends BaseType {
  constructor() {
    super({});
    this._inputFormatter = formatInputBool;
    this._outputFormatter = formatOutputBool;
  }

  isType(name) {
    return !!name.match(/^bool$/);
  }
}
