import BigNumber from "bignumber.js";
import * as protobuf from "@aelfqueen/protobufjs/light";
export interface base58 {
  encode(data: ArrayBuffer | SharedArrayBuffer, encoding?: number): string;
  decode(str: string, encoding?: string): Buffer;
}
export interface chainIdConvertor {
  chainIdToBase58(chainId: string): string;
  base58ToChainId(base58String: string): Buffer;
}
export function arrayToHex(value: Buffer): string;
export function padLeft(string: string, charLen: number, sign?: string): string;
export function padRight(
  string: string,
  charLen: number,
  sign?: string
): string;
export function decodeAddressRep(address: string): string;
export function encodeAddressRep(hex: string): string;
export function isBigNumber(object: any): boolean;
export function isString(object: any): boolean;
export function isFunction(object: any): boolean;
export function isObject(object: any): boolean;
export function isBoolean(object: any): boolean;
export function isJson(str: string): boolean;

export function toBigNumber(number: number | string | BigNumber): BigNumber;
export function getValueOfUnit(unit: string): BigNumber;

export function fromWei(
  number: number | string,
  unit: string
): string | BigNumber;
export function toWei(
  number: number | string | BigNumber,
  unit: string
): string | BigNumber;
export function toTwosComplement(
  number: number | string | BigNumber
): BigNumber;
export function uint8ArrayToHex(uint8Array: Uint8Array): string;

export function noop(): void;
export function setPath(obj: any, path: string, value: any): void;
interface IUnpackSpecifiedParams {
  data: ArrayBuffer | SharedArrayBuffer;
  dataType: protobuf.Type;
  encoding?: string;
}
export function unpackSpecifiedTypeData({
  data,
  dataType,
  encoding,
}: IUnpackSpecifiedParams): { [k: string]: any };
export function deserializeTransaction(
  rawTx: ArrayBuffer | SharedArrayBuffer,
  paramsDataType: protobuf.Type
): { [k: string]: any };
export function getAuthorization(userName: string, password: string): string;
