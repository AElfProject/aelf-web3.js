import * as protobuf from '@aelfqueen/protobufjs/light';
import { RequestManager } from '../util/requestManage';
import { GenericFunction } from '../util/utils';
type InputAddressFormatter = (address: any) => string;
interface ChainMethodParams {
  name: string;
  call: string;
  method?: string;
  params?: Array<string | undefined>;
  inputFormatter?: Array<InputAddressFormatter | undefined>;
  outputFormatter?: protobuf.Type | null;
}

export type ExtractArg =
  | GenericFunction
  | {
      isSync: boolean;
      callback?: GenericFunction;
      [k: string]: any;
    };

export interface ExtractArgumentsIntoObjectResult {
  method?: GenericFunction;
  requestMethod?: string;
  isSync: boolean;
  callback: GenericFunction;
  params?: { [k in string]: any };
}

interface IChainMethod {
  formatInput(args: Array<any>): Array<any>;
  setRequestManager(manager: RequestManager): void;
  formatOutput(result: any): any;
  extractArgumentsIntoObject(
    args: ExtractArg[]
  ): ExtractArgumentsIntoObjectResult;
  run(
    args: ExtractArg[]
  ): { [k: string]: any } | Promise<{ [k: string]: any }>;
}
declare class ChainMethod implements IChainMethod {
  constructor({
    name,
    call,
    method,
    params,
    inputFormatter,
    outputFormatter,
  }: ChainMethodParams);
  public formatInput(args: Array<any>): Array<any>;
  public setRequestManager(manager: RequestManager): void;
  public formatOutput(result: any): any;
  public extractArgumentsIntoObject(
    args: ExtractArg[]
  ): ExtractArgumentsIntoObjectResult;
  public run(
    args: ExtractArg[]
  ): { [k: string]: any } | Promise<{ [k: string]: any }>;
}
export default ChainMethod;
