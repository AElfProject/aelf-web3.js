import HttpProvider from './httpProvider';
import { GenericFunction } from './utils';
interface IRequestBody {
  requestMethod: string;
  method: GenericFunction;
  params: { [k: string]: any };
}
interface IPrepareResult {
  method: string;
  url: GenericFunction;
  params: { [k in string]: any };
}
export declare class RequestManager {
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
