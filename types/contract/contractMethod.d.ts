import Chain from '../chain';
import { IWallet } from '../wallet';
import * as protobuf from '@aelfqueen/protobufjs';
import { ITransaction } from '../util/proto';
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
    contractAddress: string,
    walletInstance: IWallet
  );
  public packInput(input?: any): Buffer | null;
  public unpackPackedInput(
    inputPacked?: ArrayBuffer | SharedArrayBuffer | null
  ): any;
  public unpackOutput(output?: ArrayBuffer | SharedArrayBuffer | null): any;
  public packOutput(result?: any): Buffer | null;
  public handleTransaction(height: string, hash: string, encoded: any): string;
  public prepareParametersAsync(args: Array<any>): Promise<string>;
  public prepareParameters(args: Array<any>): string;
  public prepareParametersWithBlockInfo(args: Array<any>): string;
  public sendTransaction(
    ...args: Array<any>
  ): { TransactionId: string } | Promise<{ TransactionId: string }>;
  public callReadOnly(...args: Array<any>): any;
  public extractArgumentsIntoObject(
    ...args: Array<any>
  ): IExtractArgumentsIntoObject;

  public getSignedTx(...args: Array<any>): string;
  public getRawTx(
    blockHeightInput: string,
    blockHashInput: string,
    packedInput: any
  ): TRawTx;
  public request(...args: Array<any>): IRequestResult;
  public run(
    ...args: Array<any>
  ): { TransactionId: string } | Promise<{ TransactionId: string }>;
  public bindMethodToContract(contract: Contract): void;
}
export default ContractMethod;
