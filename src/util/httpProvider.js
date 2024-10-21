/**
 * @file rpc connection built with http
 * @author atom-yang
 */
import { stringify } from 'query-string';

const defaultHeaders = {
  Accept: 'text/plain;v=1.0',
  'Content-Type': 'application/json'
};

let RequestLibrary = {};
let RequestLibraryXMLOnly = null;
let isFetch = false;
let NodeHeaders;
if (process.env.RUNTIME_ENV === 'browser') {
  // For browsers use DOM Api XMLHttpRequest
  // serviceworker without window and document, only with self
  // eslint-disable-next-line no-restricted-globals
  const _self = typeof self === 'object' ? self : {};
  const _window = typeof window === 'object' ? window : _self;
  if (typeof _window.XMLHttpRequest !== 'undefined') {
    RequestLibrary = _window.XMLHttpRequest;
    isFetch = false;
  } else if (typeof _window.fetch !== 'undefined') {
    RequestLibrary = _window.fetch;
    isFetch = true;
  }
} else {
  // For node use xmlhttprequest
  // eslint-disable-next-line global-require
  RequestLibraryXMLOnly = require('xmlhttprequest').XMLHttpRequest;
  // eslint-disable-next-line global-require
  const NodeFetch = require('node-fetch');
  RequestLibrary = NodeFetch.default;
  NodeHeaders = NodeFetch.Headers;
  isFetch = true;
}
/**
 * @typedef {import('../../types/util/httpProvider').IHttpHeaders} IHttpHeaders
 * @typedef {import('../../types/util/httpProvider').IFormatResponseTextRes} IFormatResponseTextRes
 * @typedef {import('../../types/util/httpProvider').ITimeoutResolve} ITimeoutResolve
 * @typedef {import('../../types/util/httpProvider').TRequestConfig} TRequestConfig
 */
export default class HttpProvider {
  /**
   * Creates an instance of HttpProvider.
   *
   * @param {string} [host='http://localhost:8545'] - The RPC server host.
   * @param {number} [timeout=8000] - Timeout for the request in milliseconds.
   * @param {IHttpHeaders} [headers=defaultHeaders] - HTTP headers for the request.
   * @param {RequestInit} [options={}] - Additional fetch options for Node.js environment.
   */

  constructor(
    host = 'http://localhost:8545',
    timeout = 8000,
    headers = defaultHeaders,
    // support node-fetch options
    options = {}
  ) {
    this.host = host.replace(/\/$/, '');
    this.timeout = timeout;
    this.headers = {};
    this.options = options;
    if (Array.isArray(headers)) {
      headers.forEach(({ name, value }) => {
        this.headers[name] = value;
      });
      this.headers = {
        ...defaultHeaders,
        ...this.headers
      };
    } else {
      this.headers = {
        ...defaultHeaders,
        ...headers
      };
    }
  }
  /**
   * Formats the response from the server.
   *
   * @param {string} response - The raw server response.
   * @returns {Object.<string, any>} Parsed JSON response or raw response if parsing fails.
   */

  static formatResponse(response) {
    let result;
    try {
      result = JSON.parse(response);
    } catch (e) {
      result = response;
    }
    return result;
  }

  /**
   * Formats the response for XMLHttpRequest.
   *
   * @param {XMLHttpRequest} request - The XMLHttpRequest object.
   * @returns {IFormatResponseTextRes} The formatted response including status and error message.
   */

  static formatResponseText(request) {
    let result;
    try {
      const parseRequest = request;
      result = {
        status: parseRequest.status,
        error: parseRequest.status === 200 ? 0 : parseRequest.status,
        Error: {
          message: request.statusText
        },
        statusText: request.statusText
      };
    } catch (e) {
      result = request;
    }
    return result;
  }
  /**
   * Creates a promise that resolves with a timeout error after a specified delay.
   *
   * @param {number} delay - Timeout duration in milliseconds.
   * @returns {Promise<ITimeoutResolve>} Promise that resolves when timeout occurs.
   */

  static timeoutPromise(delay) {
    return new Promise(_resolve => {
      const ids = setTimeout(() => {
        clearTimeout(ids);
        // eslint-disable-next-line prefer-promise-reject-errors
        _resolve({ type: 'timeout' });
      }, delay);
    });
  }
  /**
   * Sends an HTTP request using Fetch API.
   *
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} request - The fetch request function.
   * @returns {Promise<Response>} The fetch response.
   */

  requestSendByFetch(requestConfig, request) {
    const { url, method = 'POST', params = {}, signal } = requestConfig;
    const path = `/api/${url}`.replace(/\/\//g, '/');
    let uri = `${this.host}${path}`.replace();
    const myHeaders = process.env.RUNTIME_ENV === 'browser' ? new Headers() : new NodeHeaders();
    let body = JSON.stringify(params);
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
      uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params)}` : uri;
      body = undefined;
    }
    Object.keys(this.headers).forEach(header => {
      myHeaders.append(header, this.headers[header]);
    });
    return request(uri, {
      ...this.options,
      method: method.toUpperCase(),
      headers: myHeaders,
      body,
      signal
    });
  }

  /**
   * Sends an asynchronous request using Fetch API.
   *
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @returns {Promise<Response>} The parsed JSON response.
   */

  sendAsyncByFetch(requestConfig) {
    const request = RequestLibrary;
    const { timeout } = this;
    const control = typeof AbortController === 'function' ? new AbortController() : {};
    const config = { ...requestConfig, signal: control.signal, credentials: 'omit' };
    // Simulation timeout
    return Promise.race([this.requestSendByFetch(config, request), HttpProvider.timeoutPromise(timeout)]).then(
      result =>
        new Promise((resolve, reject) => {
          // @deprecated unuse timeout=1
          // if (timeout !== 1) {
          try {
            if (result.type === 'timeout') {
              // Cancel timeout request
              if (control.abort) control.abort();
              reject(result);
            } else {
              result
                .text()
                .then(text => {
                  const res = HttpProvider.formatResponse(text);
                  if (result.status !== 200 || !result.ok) {
                    reject(res);
                    return;
                  }
                  resolve(res);
                })
                .catch(err => reject(err));
            }
          } catch (e) {
            reject(e);
          }
          // }
        })
    );
  }
  /**
   * Sends an HTTP request using XMLHttpRequest.
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @param {XMLHttpRequest} request - The XMLHttpRequest instance.
   * @param {boolean} [isAsync=false] - Whether the request is asynchronous.
   */

  requestSend(requestConfig, request, isAsync = false) {
    const { url, method = 'POST', params = {} } = requestConfig;
    const path = `/api/${url}`.replace(/\/\//g, '/');
    let uri = `${this.host}${path}`.replace();
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
      uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params)}` : uri;
    }
    request.open(method.toUpperCase(), uri, isAsync);
    Object.keys(this.headers).forEach(header => {
      request.setRequestHeader(header, this.headers[header]);
    });
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
      request.send();
    } else {
      request.send(JSON.stringify(params));
    }
  }
  /**
   * Sends an HTTP request and waits for the response (synchronous for XMLHttpRequest).
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @throws Will throw an error if there is a problem with the request.
   * @returns {Object.<string, any>} The parsed response from the request.
   */

  send(requestConfig) {
    let request;
    if (isFetch) {
      if (!RequestLibraryXMLOnly) {
        // browser case, Chrome extension v3.
        throw new Error("Can not get XMLHttpRequest, invalid parameter: 'sync'");
      } else {
        request = new RequestLibraryXMLOnly();
      }
    } else {
      request = new RequestLibrary();
    }
    request.withCredentials = false;
    this.requestSend(requestConfig, request);
    let result = request.responseText;

    result = HttpProvider.formatResponse(result);
    if (result.Error) {
      throw result;
    }
    return result;
  }

  /**
   * Sends an asynchronous HTTP request.
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @returns {Promise<Object.<string, any>>} A promise that resolves to the response object.
   */

  sendAsync(requestConfig) {
    if (isFetch) return this.sendAsyncByFetch(requestConfig);
    return this.sendAsyncByXMLHttp(requestConfig);
  }

  /**
   * Sends an asynchronous HTTP request using XMLHttpRequest.
   * @param {TRequestConfig} requestConfig - The configuration for the request.
   * @returns {Promise<Object.<string, any>>} A promise that resolves to the response object.
   */

  sendAsyncByXMLHttp(requestConfig) {
    const request = RequestLibraryXMLOnly ? new RequestLibraryXMLOnly() : new RequestLibrary();
    request.withCredentials = false;
    request.timeout = this.timeout;
    this.requestSend(requestConfig, request, true);
    return new Promise((resolve, reject) => {
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.timeout !== 1) {
          let result = request.responseText;
          try {
            result = HttpProvider.formatResponse(result);
            if (request.status !== 200 || result.Error) {
              reject(result);
            } else {
              resolve(result);
            }
          } catch (e) {
            // todo: error handle
            reject(e);
          }
        }
      };

      request.onerror = err => {
        reject(err);
      };
      request.ontimeout = err => {
        // todo: timeout error
        reject(err);
      };
    });
  }
  /**
   * Checks if the HTTP provider is connected synchronously by sending a GET request to the chain status.
   * @returns {boolean} Returns `true` if connected, `false` otherwise.
   */

  isConnected() {
    try {
      this.send({
        method: 'GET',
        url: 'blockChain/chainStatus'
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if the HTTP provider is connected asynchronously by sending a GET request to the chain status.
   * @returns {Promise<boolean>} A promise that resolves to `true` if connected, `false` otherwise.
   */

  async isConnectedAsync() {
    try {
      return await this.sendAsyncByFetch({
        method: 'GET',
        url: 'blockChain/chainStatus'
      });
    } catch (e) {
      return false;
    }
  }
}
