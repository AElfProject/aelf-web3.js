import Chain from '../chain';
import { IWalletInfo } from '../wallet';
import * as protobuf from '@aelfqueen/protobufjs';
import {
  ITransactionObject,
  TAddress,
  TBlockHash,
  TBlockHeight,
  TTransactionId,
} from '../util/proto';

import { TGenericFunction } from '../util/utils';
import { Contract } from './index';
export type TRawTx = ITransactionObject & {
  refBlockNumber: string;
  refBlockPrefix: string;
};

interface IExtractArgumentsIntoObject {
  callback: TGenericFunction;
  isSync: boolean;
}
interface IRequestResult {
  method: string;
  callback: TGenericFunction;
  params: string;
  format?: { [k: string]: any } | null;
}
interface IContractMethod {
  packInput(input?: any): Buffer | null;
  unpackPackedInput(inputPacked?: ArrayBuffer | SharedArrayBuffer | null): any;
  unpackOutput(output?: ArrayBuffer | SharedArrayBuffer | null): any;
  packOutput(result?: any): Buffer | null;
  handleTransaction(
    height: TBlockHeight,
    hash: TBlockHash,
    encoded: any
  ): string;
  prepareParametersAsync(args: Array<any>): Promise<string>;
  prepareParameters(args: Array<any>): string;
  prepareParametersWithBlockInfo(args: Array<any>): string;
  sendTransaction(
    ...args: Array<any>
  ):
    | { TransactionId: TTransactionId }
    | Promise<{ TransactionId: TTransactionId }>;
  callReadOnly(...args: Array<any>): any;
  extractArgumentsIntoObject(...args: Array<any>): IExtractArgumentsIntoObject;

  getSignedTx(...args: Array<any>): string;
  getRawTx(
    blockHeightInput: TBlockHeight,
    blockHashInput: TBlockHash,
    packedInput: any
  ): TRawTx;
  request(...args: Array<any>): IRequestResult;
  run(
    ...args: Array<any>
  ):
    | { TransactionId: TTransactionId }
    | Promise<{ TransactionId: TTransactionId }>;
  bindMethodToContract(contract: Contract): void;
}
declare class ContractMethod implements IContractMethod {
  constructor(
    chain: Chain,
    method: protobuf.Method,
    contractAddress: TAddress,
    walletInstance: IWalletInfo
  );
  public packInput(input?: any): Buffer | null;
  public unpackPackedInput(
    inputPacked?: ArrayBuffer | SharedArrayBuffer | null
  ): any;
  public unpackOutput(output?: ArrayBuffer | SharedArrayBuffer | null): any;
  public packOutput(result?: any): Buffer | null;
  public handleTransaction(
    height: TBlockHeight,
    hash: TBlockHash,
    encoded: any
  ): string;
  public prepareParametersAsync(args: Array<any>): Promise<string>;
  public prepareParameters(args: Array<any>): string;
  public prepareParametersWithBlockInfo(args: Array<any>): string;
  public sendTransaction(
    ...args: Array<any>
  ):
    | { TransactionId: TTransactionId }
    | Promise<{ TransactionId: TTransactionId }>;
  public callReadOnly(...args: Array<any>): any;
  public extractArgumentsIntoObject(
    ...args: Array<any>
  ): IExtractArgumentsIntoObject;

  public getSignedTx(...args: Array<any>): string;
  public getRawTx(
    blockHeightInput: TBlockHeight,
    blockHashInput: TBlockHash,
    packedInput: any
  ): TRawTx;
  public request(...args: Array<any>): IRequestResult;
  public run(
    ...args: Array<any>
  ):
    | { TransactionId: TTransactionId }
    | Promise<{ TransactionId: TTransactionId }>;
  public bindMethodToContract(contract: Contract): void;
}
export default ContractMethod;
