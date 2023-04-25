/**
 * @file throw exact errors
 * @author atom-yang
 */

/**
 * errors related to requests
 */
export const RequestError = {
  InvalidNumberOfRPCParams() {
    return new Error('Invalid number of input parameters to RPC method');
  },
  InvalidConnection(host) {
    return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
  },
  InvalidProvider() {
    return new Error('Provider not set or invalid');
  },
  InvalidResponse(error, result) {
    const message = `Invalid JSON RPC response: ${JSON.stringify(result)}`;
    console.error(`error ${error.toString()} \n ${message}`);
    return new Error(message);
  },
  ConnectionTimeout(ms) {
    return new Error(`CONNECTION TIMEOUT: timeout of ${ms} ms archived`);
  }
};
