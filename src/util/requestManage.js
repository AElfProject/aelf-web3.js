/**
 * @typedef {import('../../types/util/httpProvider').default} HttpProvider
 * @typedef {import('../../types/util/requestManage').IRequestBody} IRequestBody
 * @typedef {import('../../types/util/requestManage').IPrepareResult} IPrepareResult
 */

export default class RequestManager {
  /**
   * Creates an instance of RequestManager.
   * @param {HttpProvider} provider - The provider object to use for RPC requests.
   */
  constructor(provider) {
    /**
     * @type {HttpProvider} - The provider instance for making requests.
     */
    this.provider = provider;
  }

  /**
   * Prepares the request payload with the given request method, method, and parameters.
   * @param {IRequestBody} param0 - The request body containing method and parameters.
   * @returns {IPrepareResult} The prepared request payload.
   */

  static prepareRequest({ requestMethod, method, params = {} }) {
    return {
      method: requestMethod.toUpperCase(),
      url: method,
      params
    };
  }
  /**
   * Sets a new provider for the RequestManager.
   * @param {HttpProvider} provider - The new provider to set.
   */

  setProvider(provider) {
    this.provider = provider;
  }
  /**
   * Sends a request synchronously.
   * @param {IRequestBody} requestBody - The request body containing method and parameters.
   * @returns {any|null} The result of the request, or null if no provider is set.
   */

  send(requestBody) {
    if (!this.provider) {
      return null;
    }

    const payload = RequestManager.prepareRequest(requestBody);
    return this.provider.send(payload);
  }
  /**
   * Sends a request asynchronously.
   * @param {IRequestBody} requestBody - The request body containing method and parameters.
   * @returns {Promise<any>|null} A promise with the result of the request, or null if no provider is set.
   */

  sendAsync(requestBody) {
    if (!this.provider) {
      return null;
    }

    const payload = RequestManager.prepareRequest(requestBody);
    return this.provider.sendAsync(payload);
  }
}
