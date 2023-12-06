interface TimeoutResolve {
  type: 'timeout';
}
type RequestConfig = {
  url: RequestInfo | URL;
  params?: Record<string, any>;
} & RequestInit;
interface ErrorMessage {
  message: string;
}
interface FormatResponseTextRes {
  status: number;
  error: number;
  Error: ErrorMessage;
  statusText: string;
}
export interface HttpHeaders {
  [headerName: string]: string;
}
interface IHttpProvider {
  requestSendByFetch(
    requestConfig: RequestConfig,
    request: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  ): Response;
  sendAsyncByFetch(requestConfig: RequestConfig): Promise<Response>;
  requestSend(
    requestConfig: RequestConfig,
    request: XMLHttpRequest,
    isAsync?: boolean
  ): void;
  send(requestConfig: RequestConfig): { [k: string]: any };
  sendAsync(requestConfig: RequestConfig): Promise<{ [k: string]: any }>;
  sendAsyncByXMLHttp(
    requestConfig: RequestConfig
  ): Promise<{ [k: string]: any }>;
  isConnected(): boolean;
  isConnectedAsync(): boolean;
}
declare class HttpProvider implements IHttpProvider {
  constructor(host?: string, timeout?: number, headers?: HttpHeaders);
  public static formatResponse<T>(response: T): T | Record<string, any>;
  public static formatResponseText(
    request: {
      status: number;
      statusText: string;
    } & Record<string, any>
  ): FormatResponseTextRes;
  public static timeoutPromise(delay: number): Promise<TimeoutResolve>;
  public requestSendByFetch(
    requestConfig: RequestConfig,
    request: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  ): Response;
  public sendAsyncByFetch(requestConfig: RequestConfig): Promise<Response>;
  public requestSend(
    requestConfig: RequestConfig,
    request: XMLHttpRequest,
    isAsync?: boolean
  ): void;
  public send(requestConfig: RequestConfig): { [k: string]: any };
  public sendAsync(requestConfig: RequestConfig): Promise<{ [k: string]: any }>;
  public sendAsyncByXMLHttp(
    requestConfig: RequestConfig
  ): Promise<{ [k: string]: any }>;
  public isConnected(): boolean;
  public isConnectedAsync(): boolean;
}
export default HttpProvider;
