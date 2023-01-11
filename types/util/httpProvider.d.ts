interface ITimeoutResolve {
  type: string;
}
type TRequestConfig = {
  url: RequestInfo | URL;
} & RequestInit;
declare class HttpProvider {
  constructor(host?: string, timeout?: number, headers?: Headers);
  public static formatResponse(response: Response): Response;
  public static formatResponseText(request: Request): Response;
  public static timeoutPromise(delay: number): Promise<ITimeoutResolve>;
  public requestSendByFetch(
    requestConfig: TRequestConfig,
    request: Request
  ): Request;
  public sendAsyncByFetch(requestConfig: TRequestConfig): Promise<any>;
  public requestSend(
    requestConfig: TRequestConfig,
    request: Request,
    isAsync?: boolean
  ): void;
  public send(requestConfig: TRequestConfig): Response;
  public sendAsync(requestConfig: TRequestConfig): Promise<any>;
  public sendAsyncByXMLHttp(requestConfig: TRequestConfig): Promise<any>;
  public isConnected(): boolean;
  public isConnectedAsync(): boolean;
}
export default HttpProvider;
