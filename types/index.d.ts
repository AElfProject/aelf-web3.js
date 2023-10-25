import * as protobuf from '@aelfqueen/protobufjs/light';
import HttpProvider from './util/httpProvider';
import Wallet from './wallet/index';
import * as proto from './util/proto';
import * as utils from './util/utils';
import { sha256 } from 'js-sha256';
import * as transform from './util/transform';
import {
  arrayToHex,
  padLeft,
  padRight,
  decodeAddressRep,
  encodeAddressRep,
  isBigNumber,
  isString,
  isFunction,
  isObject,
  isBoolean,
  isJson,
  toBigNumber,
  getValueOfUnit,
  fromWei,
  toWei,
  toTwosComplement,
  uint8ArrayToHex,
  noop,
  setPath,
  unpackSpecifiedTypeData,
  deserializeTransaction,
  getAuthorization,
} from './util/utils';
import {
  isInBloom,
  isEventInBloom,
  isIndexedInBloom,
  isAddressInBloom,
} from './util/bloom';
interface IUtils {
  base58: utils.base58;
  chainIdConvertor: utils.chainIdConvertor;
  arrayToHex: typeof arrayToHex;
  padLeft: typeof padLeft;
  padRight: typeof padRight;
  decodeAddressRep: typeof decodeAddressRep;
  encodeAddressRep: typeof encodeAddressRep;
  isBigNumber: typeof isBigNumber;
  isString: typeof isString;
  isFunction: typeof isFunction;
  isObject: typeof isObject;
  isBoolean: typeof isBoolean;
  isJson: typeof isJson;
  toBigNumber: typeof toBigNumber;
  getValueOfUnit: typeof getValueOfUnit;
  fromWei: typeof fromWei;
  toWei: typeof toWei;
  toTwosComplement: typeof toTwosComplement;
  uint8ArrayToHex: typeof uint8ArrayToHex;
  noop: typeof noop;
  setPath: typeof setPath;
  unpackSpecifiedTypeData: typeof unpackSpecifiedTypeData;
  deserializeTransaction: typeof deserializeTransaction;
  getAuthorization: typeof getAuthorization;
}
import Settings from './util/settings';
import Chain from './chain';
import { RequestManager } from './util/requestManage';
interface IBloom {
  isInBloom: typeof isInBloom;
  isEventInBloom: typeof isEventInBloom;
  isIndexedInBloom: typeof isIndexedInBloom;
  isAddressInBloom: typeof isAddressInBloom;
}
type TUtil = IUtils &
  IBloom & {
    sha256: typeof sha256;
  } & {
    transform: typeof transform;
  };
interface IVersion {
  api?: string;
}

declare namespace AElf {
  // Constructor signature
  type THttpProvider = {
    new (host?: string, timeout?: number, headers?: Headers): HttpProvider;
  };
}
declare class AElf {
  constructor(provider: HttpProvider);
  static version?: string;
  static providers: {
    HttpProvider: AElf.THttpProvider;
  };
  static pbjs: typeof protobuf;
  static pbUtils: typeof proto;
  static wallet: Wallet;
  static utils: TUtil;
  providers: {
    HttpProvider: AElf.THttpProvider;
  };
  settings: Settings;
  version: IVersion;
  isConnected(): boolean;
  setProvider(provider: HttpProvider): void;
  _requestManager: RequestManager;
  currentProvider: HttpProvider;
  chain: Chain;
}
export default AElf;
