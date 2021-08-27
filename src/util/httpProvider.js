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
    timeout = 8000,
    headers = defaultHeaders
  ) {
    this.host = host;
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
    const request = new RequestLibrary();
    request.withCredentials = false;
    request.timeout = this.timeout;
    this.requestSend(requestConfig, request, true);
    return new Promise((resolve, reject) => {
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.timeout !== 1) {
          let result = request.responseText;
          try {
            if (result) {
              result = HttpProvider.formatResponse(result);
              if (result.Error) {
                reject(result);
              } else {
                resolve(result);
              }
            } else {
              result = HttpProvider.formatResponseText(request);
              if (request.status === 200) {
                reject(result);
              } else {
                resolve(result);
              }
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
}
