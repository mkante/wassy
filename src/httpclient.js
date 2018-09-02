import _ from 'lodash';
import { request } from './request-adaptor';

const Method = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTION',
  HEAD: 'HEAD',
};

const ContentType = {
  JSON: 'application/json',
  X_WWW_FORM: 'application/x-www-form-urlencoded',
};

class HttpClient {
  constructor({
    url = 'http://localhost',
    headers = {},
    cookies = {},
    model,
    postRequest = {},
    preRequest = _.noop,
  }) {
    this.url = url;
    this.headers = headers;
    this.cookies = cookies;
    this.postRequest = postRequest;
    this.preRequest = preRequest;
    this.model = model;
  }

  post(params, headers) {
    return this.send(Method.POST, params, headers);
  }

  postJSON(params, headers = {}) {
    headers['Content-Type'] = ContentType.JSON;
    return this.post(params, headers);
  }

  get(params, headers) {
    return this.send(Method.GET, params, headers);
  }

  getText(params, headers) {
    return this.send(Method.GET, params, headers, { expectJSON: false });
  }

  delete(params, headers) {
    return this.send(Method.DELETE, params, headers);
  }

  put(params, headers) {
    return this.send(Method.PUT, params, headers);
  }

  putJSON(params, headers = {}) {
    headers['Content-Type'] = ContentType.JSON;
    return this.put(params, headers);
  }

  head(params, headers) {
    return this.send(Method.HEAD, params, headers);
  }

  removePostRequests() {
    this.postRequest = {};
  }

  send(method, params, headers = {}, options = {}) {
    const httpHeaders = {};
    _.merge(httpHeaders, this.headers, headers);
    const { expectJSON } = options;

    const argObject = {
      url: this.url,
      method,
      headers: httpHeaders,
      body: params,
      expectJSON,
    };
    if (_.isFunction(this.preRequest)) {
      this.preRequest(argObject);
    }
    argObject.postRequest = this.postRequest;

    if (_.get(argObject, 'headers["Content-Type"]') === ContentType.JSON) {
      argObject.body = JSON.stringify(argObject.body);
    }

    return request.call(this, argObject, this.model);
  }
}

export { HttpClient, Method };
