import * as protobuf from '@aelfqueen/protobufjs/light';
import HttpProvider, { IHttpHeaders } from './util/httpProvider';
import Wallet from './wallet/index';
import * as proto from './util/proto';
import * as utils from './util/utils';
import sha256 from './util/sha256';
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
  getAuthorization
} from './util/utils';
import { isInBloom, isEventInBloom, isIndexedInBloom, isAddressInBloom } from './util/bloom';

import Settings from './util/settings';
import Chain from './chain';
import { RequestManager } from './util/requestManage';

interface IUtils {
  base58: utils.IBase58;
  chainIdConvertor: utils.IChainIdConvertor;
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

interface IBloom {
  isInBloom: typeof isInBloom;
  isEventInBloom: typeof isEventInBloom;
  isIndexedInBloom: typeof isIndexedInBloom;
  isAddressInBloom: typeof isAddressInBloom;
}
export type TUtilsType = IUtils &
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
  type HttpProviderType = {
    new (host?: string, timeout?: number, headers?: IHttpHeaders): HttpProvider;
  };
}
declare class AElf {
  constructor(provider: HttpProvider);
  static version?: string;
  static providers: {
    HttpProvider: AElf.HttpProviderType;
  };
  static pbjs: typeof protobuf;
  static pbUtils: typeof proto;
  static wallet: Wallet;
  static utils: TUtilsType;
  providers: {
    HttpProvider: AElf.HttpProviderType;
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
