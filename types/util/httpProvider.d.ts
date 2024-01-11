interface ITimeoutResolve {
  type: 'timeout';
}
type TRequestConfig = {
  url: RequestInfo | URL;
  params?: Record<string, any>;
} & RequestInit;
interface IErrorMessage {
  message: string;
}
interface IFormatResponseTextRes {
  status: number;
  error: number;
  Error: IErrorMessage;
  statusText: string;
}
export interface IHttpHeaders {
  [headerName: string]: string;
}
interface IHttpProvider {
  requestSendByFetch(
    requestConfig: TRequestConfig,
    request: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  ): Response;
  sendAsyncByFetch(requestConfig: TRequestConfig): Promise<Response>;
  requestSend(
    requestConfig: TRequestConfig,
    request: XMLHttpRequest,
    isAsync?: boolean
  ): void;
  send(requestConfig: TRequestConfig): { [k: string]: any };
  sendAsync(requestConfig: TRequestConfig): Promise<{ [k: string]: any }>;
  sendAsyncByXMLHttp(
    requestConfig: TRequestConfig
  ): Promise<{ [k: string]: any }>;
  isConnected(): boolean;
  isConnectedAsync(): boolean;
}
declare class HttpProvider implements IHttpProvider {
  constructor(host?: string, timeout?: number, headers?: IHttpHeaders);
  public static formatResponse<T>(response: T): T | Record<string, any>;
  public static formatResponseText(
    request: {
      status: number;
      statusText: string;
    } & Record<string, any>
  ): IFormatResponseTextRes;
  public static timeoutPromise(delay: number): Promise<ITimeoutResolve>;
  public requestSendByFetch(
    requestConfig: TRequestConfig,
    request: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  ): Response;
  public sendAsyncByFetch(requestConfig: TRequestConfig): Promise<Response>;
  public requestSend(
    requestConfig: TRequestConfig,
    request: XMLHttpRequest,
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
