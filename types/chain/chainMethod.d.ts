import * as protobuf from "@aelfqueen/protobufjs/light";
import { RequestManager } from "types/util/requestManage";
type TInputAddressFormatter = (address: any) => string;
interface IChainMethodParams {
  name: string;
  call: string;
  method?: string;
  params?: Array<string | undefined>;
  inputFormatter?: Array<TInputAddressFormatter | undefined>;
  outputFormatter?: protobuf.Type | null;
}
export type TExtractArg = Function & {
  isSync: boolean;
  callback?: Function;
  [k: string]: any;
};
export interface IExtractArgumentsIntoObjectResult {
  method: Function;
  requestMethod: string;
  isSync: boolean;
  callback: Function;
  params: { [k in string]: any };
}
declare class ChainMethod {
  constructor({
    name,
    call,
    method,
    params,
    inputFormatter,
    outputFormatter,
  }: IChainMethodParams);
  public formatInput(args: Array<any>): Array<any>;
  public setRequestManager(manager: RequestManager): void;
  public formatOutput(result: any): any;
  public extractArgumentsIntoObject(
    args: TExtractArg[]
  ): IExtractArgumentsIntoObjectResult;
  public run(
    args: TExtractArg[]
  ): { [k: string]: any } | Promise<{ [k: string]: any }>;
}
export default ChainMethod;
