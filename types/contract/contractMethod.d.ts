import Chain from '../chain';
import { IWalletInfo } from '../wallet';
import * as protobuf from '@aelfqueen/protobufjs';
import {
  ITransaction,
  TAddress,
  TBlockHash,
  TBlockHeight,
  TTransactionId,
} from '../util/proto';
import { Contract } from '.';
import { GenericFunction } from '../util/utils';
export type TRawTx = ITransaction & {
  refBlockNumber: string;
  refBlockPrefix: string;
};

interface IExtractArgumentsIntoObject {
  callback: GenericFunction;
  isSync: boolean;
}
interface IRequestResult {
  method: string;
  callback: GenericFunction;
  params: string;
  format?: { [k: string]: any } | null;
}
declare class ContractMethod {
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
  ): { TransactionId: string } | Promise<{ TransactionId: string }>;
  public bindMethodToContract(contract: Contract): void;
}
export default ContractMethod;
