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
if (process.env.RUNTIME_ENV === 'browser') {
  // For browsers use DOM Api XMLHttpRequest
  RequestLibrary = window.XMLHttpRequest;
} else {
  // For node use xmlhttprequest
  // eslint-disable-next-line global-require
  RequestLibrary = require('xmlhttprequest').XMLHttpRequest;
}

export default class HttpProvider {
  constructor(
    host = 'http://localhost:8545',
    timeout = null,
    user,
    password,
    headers = defaultHeaders
  ) {
    this.host = host;
    this.timeout = timeout;
    this.user = user;
    this.password = password;
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

  requestSend(requestConfig, isAsync = false) {
    this.request = new RequestLibrary();
    this.request.withCredentials = false;
    this.request.timeout = this.timeout;
    const {
      url,
      method = 'POST',
      params = {}
    } = requestConfig;
    const path = `/api/${url}`.replace(/\/\//g, '\/');
    let uri = `${this.host}${path}`.replace();
    if (method.toUpperCase() === 'GET') {
      uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params)}` : uri;
    }
    this.request.open(method.toUpperCase(), uri, isAsync);
    Object.keys(this.headers).forEach(header => {
      this.request.setRequestHeader(header, this.headers[header]);
    });
    try {
      if (method.toUpperCase() === 'GET') {
        this.request.send();
      } else {
        this.request.send(JSON.stringify(params));
      }
    } catch (error) {
      // todo: error handle
      throw error;
    }
  }

  send(requestConfig) {
    this.requestSend(requestConfig);
    let result = this.request.responseText;

    result = HttpProvider.formatResponse(result);
    if (result.Error) {
      throw result;
    }
    return result;
  }

  sendAsync(requestConfig) {
    this.requestSend(requestConfig, true);
    return new Promise((resolve, reject) => {
      this.request.onreadystatechange = () => {
        if (this.request.readyState === 4 && this.request.timeout !== 1) {
          let result = this.request.responseText;
          try {
            result = HttpProvider.formatResponse(result);
            if (result.Error) {
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

      this.request.onerror = err => {
        reject(err);
      };
      this.request.ontimeout = err => {
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
}
