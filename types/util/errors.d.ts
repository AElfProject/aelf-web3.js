interface IRequestError {
  InvalidNumberOfRPCParams(): Error;
  InvalidConnection(host: string): Error;
  InvalidProvider(): Error;
  InvalidResponse(error: Error, result: { [k: string]: any }): Error;
  ConnectionTimeout(ms: string | number): Error;
}
declare const RequestError: IRequestError;
export { RequestError };
