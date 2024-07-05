import { RequestError } from '../../../src/util/errors';
describe('test errors', () => {
  test('test throws an error when invalid number of input parameters', () => {
    const result = RequestError.InvalidNumberOfRPCParams();
    expect(result).toEqual(
      new Error('Invalid number of input parameters to RPC method')
    );
  });
  test('test throws an error when connection is invalid', () => {
    const result = RequestError.InvalidConnection(3000);
    expect(result).toEqual(
      new Error("CONNECTION ERROR: Couldn't connect to node 3000.")
    );
  });
  test('test throws an error when provider is invalid', () => {
    const result = RequestError.InvalidProvider();
    expect(result).toEqual(new Error('Provider not set or invalid'));
  });
  test('test throws an error when response is invalid', () => {
    console.error = jest.fn();
    const result = RequestError.InvalidResponse(
      {
        message: 'The requested resource does not exist',
        errorCode: 'NOT_FOUND',
      },
      null
    );
    expect(result).toEqual(new Error('Invalid JSON RPC response: null'));
    expect(console.error).toHaveBeenCalledTimes(1);
  });
  test('test throws an error when connection timeout', () => {
    const result = RequestError.ConnectionTimeout(10000);
    expect(result).toEqual(
      new Error('CONNECTION TIMEOUT: timeout of 10000 ms archived')
    );
  });
});
