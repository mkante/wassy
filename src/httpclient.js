import _ from 'lodash';
import $ from 'jquery';
import Model from './model';

function toReponseItemModel(responseData, modelProperties) {
  const item = {};
  _.merge(item, modelProperties, responseData);
  return new Model(item);
}

function __ajax(opts, modelProperties) {
  const promise = $.Deferred();

  $.ajax(opts)
    .done((response) => {
      let model = null;

      if (_.isArray(response)) {
        model = [];

        _.each(response, (obj) => {
          const respItem = toReponseItemModel(obj, modelProperties);
          model.push(respItem);
        });
      } else if (_.isObject(response)) {
        model = toReponseItemModel(response, modelProperties);
      }

      promise.resolve(model, response);
    })
    .fail((...args) => {
      promise.reject.call(args);
    });
  return promise;
}

class HttpClient {
  constructor({
    url, headers, cookies, model,
  }) {
    this.url = url;
    this.headers = headers;
    this.cookies = cookies;
    this.statusCode = {};
    this.asyncReq = true;
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

  send(method, params = {}, headers = {}) {
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
      cache: false,
      crossDomain: true,
      headers: httpHeaders,
      statusCode: this.statusCode,
      data: params,
      async: this.asyncReq,
    };

    return __ajax.call(this, options, this.modelProperties);
  }
}

export default HttpClient;
