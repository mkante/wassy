import _ from './lodash';
import { HttpClient } from './httpclient';

const resolveUrl = (options, urlBindings) => {
  const { host, uri } = options;
  const base = (!host) ? '' : host;
  let url = base + uri;

  _.each(urlBindings, (val, key) => {
    const search = '{' + key + '}';
    url = url.replace(new RegExp(search, 'g'), val);
  });

  return url;
};

const define = function fn(options = {}) {
  options.host = options.host || 'http://localhost';
  options.uri = options.uri || '/';

  return class Endpoint extends HttpClient {
    constructor(urlBindings) {
      super(options);
      this.host = options.host;
      this.uri = options.uri;
      this.urlBindings = urlBindings;
      this.url = resolveUrl(options, this.urlBindings);
    }
    static extends(newOptions) {
      const params = {};
      _.merge(params, options, newOptions);
      return fn(params);
    }
  };
};

module.exports = {
  default: define,
  define,
  resolveUrl,
};

