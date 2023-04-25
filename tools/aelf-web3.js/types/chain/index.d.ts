import { Contract } from 'types/contract';
import { RequestManager } from 'types/util/requestManage';
import { IWallet } from 'types/wallet';
import { IExtractArgumentsIntoObjectResult, TExtractArg } from './chainMethod';

declare class Chain {
  constructor(requestManager: RequestManager);
  public extractArgumentsIntoObject(
    args: TExtractArg[]
  ): IExtractArgumentsIntoObjectResult;
  public contractAt(
    address: string,
    wallet: IWallet,
    args: { [k in string]: any }
  ): Contract | Promise<Contract>;
  public getMerklePath(
    txId: string,
    height: number,
    args: { [k in string]: any }
  ): any[] | null | Promise<any[] | null>;
}
export default Chain;
