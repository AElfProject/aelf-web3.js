/* eslint-disable import/no-cycle */
import TypeAddress from './address';
import TypeBool from './bool';
import TypeInt from './int';
import TypeUInt from './uint';
import TypeLong from './long';
import TypeULong from './ulong';
import TypeBytes from './bytes';
import TypeString from './string';
import TypeHash from './hash';
import TypeAuthorization from './authorization';
import TypeProposal from './proposal';
import TypeApproval from './approval';
import TypeSideChainInfo from './sidechaininfo';
import TypeMerklePath from './merklepath';

class Coder {
  constructor(types) {
    this._types = types;
  }

  /**
   * This method should be used to transform type to SolidityType
   *
   * @method _requireType
   * @param {String} type
   * @returns {Object}
   * @throws {Error} throws if no matching type is found
   */
  getFieldType(type) {
    const fieldType = this._types.filter(v => v.isType(type));

    if (fieldType.length === 0) {
      throw Error(`invalid solidity type!: ${type}`);
    }

    return fieldType[0];
  }

  /**
   * get array associated with types and filtered by parameters
   * @param types
   * @returns {*[]}
   */
  getFieldTypes(types = []) {
    return types.map(type => this.getFieldType(type));
  }

  /**
   * encode param
   * @param type
   * @param param
   */
  encodeParam(type, param) {
    return this.encodeParams([type], [param]);
  }

  /**
   * encode params
   * @param types
   * @param params
   */
  encodeParams(types, params) {
    return this.getFieldTypes(types).map((type, index) => type.encode(params[index], index + 1));
  }

  decodeParam(type, bytes) {
    const fieldType = this.getFieldType(type);
    return fieldType.decode(bytes, type);
  }
}

export default new Coder([
  new TypeBool(),
  new TypeInt(),
  new TypeUInt(),
  new TypeLong(),
  new TypeULong(),
  new TypeBytes(),
  new TypeString(),
  new TypeAddress(),
  new TypeHash(),
  new TypeAuthorization(),
  new TypeProposal(),
  new TypeApproval(),
  new TypeSideChainInfo(),
  new TypeMerklePath()
]);
