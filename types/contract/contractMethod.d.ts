import Chain from '../chain';
import { WalletInfo } from '../wallet';
import * as protobuf from '@aelfqueen/protobufjs';
import {
  TransactionObject,
  Address,
  BlockHash,
  BlockHeight,
  TransactionId,
} from '../util/proto';
import { Contract } from '.';
import { GenericFunction } from '../util/utils';
export type RawTx = TransactionObject & {
  refBlockNumber: string;
  refBlockPrefix: string;
};

interface ExtractArgumentsIntoObject {
  callback: GenericFunction;
  isSync: boolean;
}
interface RequestResult {
  method: string;
  callback: GenericFunction;
  params: string;
  format?: { [k: string]: any } | null;
}
interface IContractMethod {
  packInput(input?: any): Buffer | null;
  unpackPackedInput(
    inputPacked?: ArrayBuffer | SharedArrayBuffer | null
  ): any;
  unpackOutput(output?: ArrayBuffer | SharedArrayBuffer | null): any;
  packOutput(result?: any): Buffer | null;
  handleTransaction(
    height: BlockHeight,
    hash: BlockHash,
    encoded: any
  ): string;
  prepareParametersAsync(args: Array<any>): Promise<string>;
  prepareParameters(args: Array<any>): string;
  prepareParametersWithBlockInfo(args: Array<any>): string;
  sendTransaction(
    ...args: Array<any>
  ):
    | { TransactionId: TransactionId }
    | Promise<{ TransactionId: TransactionId }>;
  callReadOnly(...args: Array<any>): any;
  extractArgumentsIntoObject(
    ...args: Array<any>
  ): ExtractArgumentsIntoObject;

  getSignedTx(...args: Array<any>): string;
  getRawTx(
    blockHeightInput: BlockHeight,
    blockHashInput: BlockHash,
    packedInput: any
  ): RawTx;
  request(...args: Array<any>): RequestResult;
  run(
    ...args: Array<any>
  ):
    | { TransactionId: TransactionId }
    | Promise<{ TransactionId: TransactionId }>;
  bindMethodToContract(contract: Contract): void;
}
declare class ContractMethod implements IContractMethod {
  constructor(
    chain: Chain,
    method: protobuf.Method,
    contractAddress: Address,
    walletInstance: WalletInfo
  );
  public packInput(input?: any): Buffer | null;
  public unpackPackedInput(
    inputPacked?: ArrayBuffer | SharedArrayBuffer | null
  ): any;
  public unpackOutput(output?: ArrayBuffer | SharedArrayBuffer | null): any;
  public packOutput(result?: any): Buffer | null;
  public handleTransaction(
    height: BlockHeight,
    hash: BlockHash,
    encoded: any
  ): string;
  public prepareParametersAsync(args: Array<any>): Promise<string>;
  public prepareParameters(args: Array<any>): string;
  public prepareParametersWithBlockInfo(args: Array<any>): string;
  public sendTransaction(
    ...args: Array<any>
  ):
    | { TransactionId: TransactionId }
    | Promise<{ TransactionId: TransactionId }>;
  public callReadOnly(...args: Array<any>): any;
  public extractArgumentsIntoObject(
    ...args: Array<any>
  ): ExtractArgumentsIntoObject;

  public getSignedTx(...args: Array<any>): string;
  public getRawTx(
    blockHeightInput: BlockHeight,
    blockHashInput: BlockHash,
    packedInput: any
  ): RawTx;
  public request(...args: Array<any>): RequestResult;
  public run(
    ...args: Array<any>
  ):
    | { TransactionId: TransactionId }
    | Promise<{ TransactionId: TransactionId }>;
  public bindMethodToContract(contract: Contract): void;
}
export default ContractMethod;
