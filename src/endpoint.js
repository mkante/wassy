import _ from 'lodash';
import HttpClient from './httpclient';
import RequestParameter from './request-parameter';

class Endpoint {
  constructor() {
    this.requestParam = new RequestParameter();
    this.statusCodes = {};
    this.modelAttributes = _.noop();
  }

  static create(params) {
    const obj = new Endpoint();
    obj.requestParam = RequestParameter.create(params);
    obj.beforeHook = _.get(params, 'beforeHook', _.noop());
    obj.modelAttributes = _.get(params, 'model', {});
    return obj;
  }

  resolveUrl(urlBindings) {
    const { host, uri } = this.requestParam;
    const base = (!host) ? '' : host;
    let url = base + uri;

    _.each(urlBindings, (val, key) => {
      const search = '{' + key + '}';
      url = url.replace(new RegExp(search, 'g'), val);
    });

    return url;
  }

  extends(newParams) {
    const params = {
      beforeHook: this.beforeHook,
      model: Object.create(this.modelAttributes),
    };
    _.merge(params, this.requestParam.toObject(), newParams);
    return Endpoint.create(params);
  }

  request(urlBindings, overrideHeaders) {
    const url = this.resolveUrl(urlBindings);
    const hdrs = {};
    _.merge(hdrs, this.requestParam.headers, overrideHeaders);

    const req = new HttpClient({
      url,
      headers: hdrs,
      beforeHook: this.beforeHook,
      model: this.modelAttributes,
    });
    return req;
  }
}


module.exports = Endpoint;
