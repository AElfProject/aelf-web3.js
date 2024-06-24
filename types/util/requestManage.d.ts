import HttpProvider from './httpProvider';
import { TGenericFunction } from './utils';
interface IRequestBody {
  requestMethod: string;
  method: TGenericFunction;
  params: { [k: string]: any };
}
interface IPrepareResult {
  method: string;
  url: TGenericFunction;
  params: { [k in string]: any };
}
interface IRequestManager {
  setProvider(provider: HttpProvider): void;
  send(requestBody: IRequestBody): any;
  sendAsync(requestBody: IRequestBody): Promise<any>;
}
export declare class RequestManager implements IRequestManager {
  constructor(provider: HttpProvider);
  public static prepareRequest({
    requestMethod,
    method,
    params,
  }: IRequestBody): IPrepareResult;
  public setProvider(provider: HttpProvider): void;
  public send(requestBody: IRequestBody): any;
  public sendAsync(requestBody: IRequestBody): Promise<any>;
}
