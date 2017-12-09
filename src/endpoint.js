import _ from 'lodash';
import HttpClient from './httpclient';

module.exports = function fn(options = {}) {
  options.host = options.host || 'http://localhost';
  options.uri = options.uri || '/';
  function resolveUrl(urlBindings) {
    const { host, uri } = options;
    const base = (!host) ? '' : host;
    let url = base + uri;

    _.each(urlBindings, (val, key) => {
      const search = '{' + key + '}';
      url = url.replace(new RegExp(search, 'g'), val);
    });

    return url;
  }

  return class Endpoint extends HttpClient {
    constructor(urlBindings) {
      super(options);
      this.host = options.host;
      this.uri = options.uri;
      this.urlBindings = urlBindings;
      this.url = resolveUrl(this.urlBindings);
    }
    static extends(newOptions) {
      const params = {};
      _.merge(params, options, newOptions);
      return fn(params);
    }
  };
};
