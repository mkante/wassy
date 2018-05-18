import _ from 'lodash';
import { request } from './request-adaptor';

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
    return this.send('POST', params, headers);
  }

  postJSON(params, headers) {
    headers = headers || {};
    headers['Content-Type'] = 'application/json';
    return this.post(JSON.stringify(params), headers);
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

  putJSON(params, headers) {
    headers = headers || {};
    headers['Content-Type'] = 'application/json';
    return this.put(JSON.stringify(params), headers);
  }

  head(params, headers) {
    return this.send('HEAD', params, headers);
  }

  send(method, params, headers) {
    const httpHeaders = {};
    _.merge(httpHeaders, this.headers, headers);

    const options = {
      url: this.url,
      method,
      headers: httpHeaders,
      body: params,
    };
    if (_.isFunction(this.preRequest)) {
      this.preRequest(options);
    }
    options.postRequest = this.postRequest;
    return request.call(this, options, this.model);
  }
}

module.exports = HttpClient;
