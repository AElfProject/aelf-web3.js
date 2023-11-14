import * as protobuf from '@aelfqueen/protobufjs/light';

export type TChainId = string;
export type TBlockHash = string;
export type TBlockHeight = number;
export type TAddress = string;
export type TTransactionId = string;
export type TRawTransaction = string;
export interface IAddress {
  value: Buffer;
}
export interface ITransaction {
  from: IAddress;
  to: IAddress;
  methodName: string;
  params: string;
}

export const coreRootProto: protobuf.Root;
export const Transaction: protobuf.Type;
export const Hash: protobuf.Type;
export const Address: protobuf.Type;
export const TransactionFeeCharged: protobuf.Type;
export const ResourceTokenCharged: protobuf.Type;
export function getFee(
  base64Str: string,
  type?: string
): { [k: string]: any } | undefined | null;

interface ILog {
  Address: TAddress;
  Name: string;
  Indexed: Array<string> | null;
  NonIndexed: string;
}
export function getSerializedDataFromLog(log: ILog): string;
export function getResourceFee(
  Logs?: Array<ILog>
): Array<{ [k: string]: any } | undefined | null>;
export function getTransactionFee(
  Logs?: Array<ILog>
): Array<{ [k: string]: any } | undefined | null>;

export function arrayBufferToHex(arrayBuffer: Buffer): string;
export function getRepForAddress(address: { [k: string]: any }): string;
export function getAddressFromRep(
  rep: string
): protobuf.Message<{ value: string }>;
export function getAddressObjectFromRep(rep: string): { [k: string]: any };
export function getRepForHash(
  hash: protobuf.Message<{ value: string }>
): string;
export function getHashFromHex(
  hex: string
): protobuf.Message<{ value: string }>;
export function getHashObjectFromHex(hex: string): { [k: string]: any };
export function encodeTransaction(tx: { [k: string]: any }): Uint8Array;
export function getTransaction(
  from: TAddress,
  to: TAddress,
  methodName: string,
  params: any
): protobuf.Message<{
  from: protobuf.Message<{ value: string }>;
  to: protobuf.Message<{ value: string }>;
  methodName: string;
  params: any;
}>;
