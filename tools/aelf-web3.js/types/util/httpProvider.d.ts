interface ITimeoutResolve {
  type: string;
}
type TRequestConfig = {
  url: RequestInfo | URL;
} & RequestInit;
interface IError {
  message: string;
}
interface IFormatResponseTextRes {
  status: number;
  error: number;
  Error: IError;
  statusText: string;
}
declare class HttpProvider {
  constructor(host?: string, timeout?: number, headers?: Headers);
  public static formatResponse(response: Response): { [k: string]: any };
  public static formatResponseText(request: Request): IFormatResponseTextRes;
  public static timeoutPromise(delay: number): Promise<ITimeoutResolve>;
  public requestSendByFetch(
    requestConfig: TRequestConfig,
    request: typeof XMLHttpRequest
  ): any;
  public sendAsyncByFetch(
    requestConfig: TRequestConfig
  ): Promise<{ [k: string]: any }>;
  public requestSend(
    requestConfig: TRequestConfig,
    request: typeof XMLHttpRequest,
    isAsync?: boolean
  ): void;
  public send(requestConfig: TRequestConfig): { [k: string]: any };
  public sendAsync(
    requestConfig: TRequestConfig
  ): Promise<{ [k: string]: any }>;
  public sendAsyncByXMLHttp(
    requestConfig: TRequestConfig
  ): Promise<{ [k: string]: any }>;
  public isConnected(): boolean;
  public isConnectedAsync(): boolean;
}
export default HttpProvider;
