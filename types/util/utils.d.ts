import BigNumber from 'bignumber.js';
import * as protobuf from '@aelfqueen/protobufjs/light';

export type GenericFunction = (...args: any[]) => any;
export interface base58 {
  encode(data: ArrayBuffer | SharedArrayBuffer, encoding?: number): string;
  decode(str: string, encoding?: string): Buffer;
}
export interface chainIdConvertor {
  chainIdToBase58(chainId: string): string;
  base58ToChainId(base58String: string): Buffer;
}
export declare function arrayToHex(value: any): string;
export declare function padLeft(
  string: string,
  charLen: number,
  sign?: string
): string;
export declare function padRight(
  string: string,
  charLen: number,
  sign?: string
): string;
export declare function decodeAddressRep(address: string): string;
export declare function encodeAddressRep(hex: string): string;
export declare function isBigNumber(object: any): boolean;
export declare function isString(object: any): boolean;
export declare function isFunction(object: any): boolean;
export declare function isObject(object: any): boolean;
export declare function isBoolean(object: any): boolean;
export declare function isJson(str: string): boolean;

export declare function toBigNumber(
  number: number | string | BigNumber
): BigNumber;
export declare function getValueOfUnit(unit: string): BigNumber;

export declare function fromWei(
  number: number | string,
  unit: string
): string | BigNumber;
export declare function toWei(
  number: number | string | BigNumber,
  unit: string
): string | BigNumber;
export declare function toTwosComplement(
  number: number | string | BigNumber
): BigNumber;
export declare function uint8ArrayToHex(uint8Array: Uint8Array): string;

export declare function noop(): void;
export declare function setPath(obj: any, path: string, value: any): void;
interface IUnpackSpecifiedParams {
  data: ArrayBuffer | SharedArrayBuffer;
  dataType: protobuf.Type;
  encoding?: string;
}
export declare function unpackSpecifiedTypeData({
  data,
  dataType,
  encoding,
}: IUnpackSpecifiedParams): { [k: string]: any };
export declare function deserializeTransaction(
  rawTx: ArrayBuffer | SharedArrayBuffer,
  paramsDataType: protobuf.Type
): { [k: string]: any };
export declare function getAuthorization(
  userName: string,
  password: string
): string;
