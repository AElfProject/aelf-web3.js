/**
 * @file throw exact errors
 * @author atom-yang
 */

/**
 * errors related to requests
 */
export const RequestError = {
  /**
   * Creates an error indicating an invalid number of input parameters to an RPC method.
   *
   * @returns {Error} An error object with a message specifying that the RPC method was called with an incorrect number of parameters.
   */

  InvalidNumberOfRPCParams() {
    return new Error('Invalid number of input parameters to RPC method');
  },
  /**
   * Creates an error indicating a connection failure to a specific host.
   *
   * @param {string} host - The host that could not be connected to.
   * @returns {Error} An error object with a message specifying the connection error and the host address.
   */

  InvalidConnection(host) {
    return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
  },
  /**
   * Creates an error indicating that the provider is not set or is invalid.
   *
   * @returns {Error} An error object with a message specifying that the provider is either missing or invalid.
   */

  InvalidProvider() {
    return new Error('Provider not set or invalid');
  },
  /**
   * Creates an error indicating an invalid JSON RPC response.
   *
   * @param {Error} error - The original error that occurred during the request.
   * @param {Object.<string, any>} result - The result object that contains the invalid response.
   * @returns {Error} An error object with a detailed message including the error and the invalid result.
   */

  InvalidResponse(error, result) {
    const message = `Invalid JSON RPC response: ${JSON.stringify(result)}`;
    console.error(`error ${error.toString()} \n ${message}`);
    return new Error(message);
  },
  /**
   * Creates an error indicating that a connection timed out.
   *
   * @param {number|string} ms - The timeout duration in milliseconds.
   * @returns {Error} An error object with a message specifying the connection timeout duration.
   */

  ConnectionTimeout(ms) {
    return new Error(`CONNECTION TIMEOUT: timeout of ${ms} ms archived`);
  }
};
