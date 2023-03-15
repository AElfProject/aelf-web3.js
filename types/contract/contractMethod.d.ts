import Chain from 'types/chain';
import { IWallet } from 'types/wallet';
import * as protobuf from '@aelfqueen/protobufjs';
import { ITransaction } from 'types/util/proto';
import { Contract } from '.';
type TRawTx = ITransaction & {
  refBlockNumber: string;
  refBlockPrefix: string;
};

interface IExtractArgumentsIntoObject {
  callback: Function;
  isSync: boolean;
}
interface IRequestRes {
  method: string;
  callback: Function;
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
  public packInput(input?: any): Uint8Array | null;
  public unpackPackedInput(
    inputPacked?: ArrayBuffer | SharedArrayBuffer | null
  ): { [k: string]: any } | undefined | null;
  public unpackOutput(
    output?: ArrayBuffer | SharedArrayBuffer | null
  ): { [k: string]: any } | undefined | null;
  public packOutput(result?: { [k: string]: any } | null): Uint8Array;
  public handleTransaction(
    height: string,
    hash: string,
    encoded: Uint8Array
  ): string;
  public prepareParametersAsync(args: Array<any>): Promise<string>;
  public prepareParameters(args: Array<any>): string;
  public prepareParametersWithBlockInfo(args: Array<any>): string;
  // TODO
  public sendTransaction(
    ...args: Array<{ [k: string]: any }>
  ): { TransactionId: string } | Promise<{ TransactionId: string }>;
  public callReadOnly(
    ...args: Array<{ [k: string]: any }>
  ):
    | { [k: string]: any }
    | undefined
    | null
    | Promise<{ [k: string]: any } | undefined | null>;
  public extractArgumentsIntoObject(
    ...args: Array<{ [k: string]: any }>
  ): IExtractArgumentsIntoObject;

  public getSignedTx(...args: Array<{ [k: string]: any }>): string | undefined;
  public getRawTx(
    blockHeightInput: string,
    blockHashInput: string,
    packedInput: Uint8Array
  ): TRawTx;
  public request(...args: Array<any>): IRequestRes;
  public run(
    ...args: Array<{ [k: string]: any }>
  ): { TransactionId: string } | Promise<{ TransactionId: string }>;
  public bindMethodToContract(contract: Contract): void;
  public getRawTx(
    blockHeightInput: string,
    blockHashInput: string,
    packedInput: Uint8Array
  ): TRawTx;
}
export default ContractMethod;
