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
let isFetch = false;
if (process.env.RUNTIME_ENV === 'browser') {
  // For browsers use DOM Api XMLHttpRequest
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
  RequestLibrary = require('xmlhttprequest').XMLHttpRequest;
}

export default class HttpProvider {
  constructor(
    host = 'http://localhost:8545',
    timeout = 8000,
    headers = defaultHeaders
  ) {
    this.host = host.replace(/\/$/, '');
    this.timeout = timeout;
    this.headers = {};
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
        ...headers,
      };
    }
  }

  static formatResponse(response) {
    let result;
    try {
      result = JSON.parse(response);
    } catch (e) {
      result = response;
    }
    return result;
  }

  static formatResponseText(request) {
    let result;
    try {
      const parseRequest = request;
      result = {
        status: parseRequest.status,
        error: parseRequest.status === 200 ? 0 : parseRequest.status,
        Error: {
          message: request.statusText,
        },
        statusText: request.statusText,
      };
    } catch (e) {
      result = request;
    }
    return result;
  }

  static timeoutPromise(delay) {
    return new Promise(_resolve => {
      const ids = setTimeout(() => {
        clearTimeout(ids);
        // eslint-disable-next-line prefer-promise-reject-errors
        _resolve({ type: 'timeout' });
      }, delay);
    });
  }

  requestSendByFetch(requestConfig, request) {
    const {
      url,
      method = 'POST',
      params = {},
      signal
    } = requestConfig;
    const path = `/api/${url}`.replace(/\/\//g, '\/');
    let uri = `${this.host}${path}`.replace();
    const myHeaders = new Headers();
    let body = JSON.stringify(params);
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
      uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params)}` : uri;
      body = undefined;
    }
    Object.keys(this.headers).forEach(header => {
      myHeaders.append(header, this.headers[header]);
    });
    return request(uri, {
      method: method.toUpperCase(),
      headers: myHeaders,
      body,
      signal
    });
  }

  sendAsyncByFetch(requestConfig) {
    const request = RequestLibrary;
    const { timeout } = this;
    const control = typeof AbortController === 'function' ? new AbortController() : {};
    const config = { ...requestConfig, signal: control.signal, credentials: 'omit' };
    // Simulation timeout
    return Promise.race([
      this.requestSendByFetch(config, request),
      HttpProvider.timeoutPromise(timeout)
    ]).then(result => new Promise((resolve, reject) => {
      if (timeout !== 1) {
        try {
          if (result.type === 'timeout') {
            // Cancel timeout request
            if (control.abort) control.abort();
            reject(result);
          } else {
            result.text().then(text => {
              const res = HttpProvider.formatResponse(text);
              if (result.status !== 200 || !result.ok) {
                reject(res);
                return;
              }
              resolve(res);
            }).catch(err => reject(err));
          }
        } catch (e) {
          reject(e);
        }
      }
    }));
  }

  requestSend(requestConfig, request, isAsync = false) {
    const {
      url,
      method = 'POST',
      params = {}
    } = requestConfig;
    const path = `/api/${url}`.replace(/\/\//g, '\/');
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

  send(requestConfig) {
    if (isFetch) throw new Error("Can not get XMLHttpRequest, invalid parameter: 'sync'");
    const request = new RequestLibrary();
    request.withCredentials = false;
    this.requestSend(requestConfig, request);
    let result = request.responseText;

    result = HttpProvider.formatResponse(result);
    if (result.Error) {
      throw result;
    }
    return result;
  }

  sendAsync(requestConfig) {
    if (isFetch) return this.sendAsyncByFetch(requestConfig);
    return this.sendAsyncByXMLHttp(requestConfig);
  }

  sendAsyncByXMLHttp(requestConfig) {
    const request = new RequestLibrary();
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
