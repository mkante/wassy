import _ from 'lodash';
import request from './request';

class HttpClient {
  constructor({
    url = 'http://localhost',
    headers = {},
    cookies = {},
    model,
  }) {
    this.url = url;
    this.headers = headers;
    this.cookies = cookies;
    this.statusCode = {};
    this.beforeHook = _.noop();
    this.modelProperties = model;
  }

  post(params, headers) {
    return this.send('POST', params, headers);
  }

  get(params, headers) {
    return this.send('GET', params, headers);
  }

  delete(params, headers) {
    return this.send('DELETE', params, headers);
  }

  put(params, headers) {
    return this.send('PUT', params, headers);
  }

  send(method, params, headers) {
    const httpHeaders = {};
    _.merge(httpHeaders, this.headers);
    _.merge(httpHeaders, headers);

    if (_.isFunction(this.beforeHook)) {
      const _httpObj = {
        method,
        params,
        headers: httpHeaders,
        bindings: this.urlBindings,
        _super: this._super,
      };
      this.beforeHook.call(_httpObj);
    }

    const options = {
      url: this.url,
      method,
      // cache: false,
      // crossDomain: true,
      headers: httpHeaders,
      statusCode: this.statusCode,
      body: params,
      // async: this.asyncReq,
    };
    return request.call(this, options, this.modelProperties);
  }
}

module.exports = HttpClient;
