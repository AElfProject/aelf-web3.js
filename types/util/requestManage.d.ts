import HttpProvider from './httpProvider';
import { GenericFunction } from './utils';
interface RequestBody {
  requestMethod: string;
  method: GenericFunction;
  params: { [k: string]: any };
}
interface PrepareResult {
  method: string;
  url: GenericFunction;
  params: { [k in string]: any };
}
interface IRequestManager {
  setProvider(provider: HttpProvider): void;
  send(requestBody: RequestBody): any;
  sendAsync(requestBody: RequestBody): Promise<any>;
}
export declare class RequestManager implements IRequestManager {
  constructor(provider: HttpProvider);
  public static prepareRequest({
    requestMethod,
    method,
    params,
  }: RequestBody): PrepareResult;
  public setProvider(provider: HttpProvider): void;
  public send(requestBody: RequestBody): any;
  public sendAsync(requestBody: RequestBody): Promise<any>;
}
