import _ from 'lodash';

const DEFAULT_URL = 'http://localhost';

class RequestParameter {
  constructor() {
    this.host = DEFAULT_URL;
    this.uri = '/';
    this.headers = {};
    this.cookies = {};
  }

  static create(params) {
    const obj = new RequestParameter();
    obj.host = _.get(params, 'host', DEFAULT_URL);
    obj.uri = _.get(params, 'uri', '/');
    obj.headers = _.get(params, 'headers', {});
    obj.cookies = _.get(params, 'cookies', {});
    return obj;
  }

  toObject() {
    return {
      host: this.host,
      uri: this.uri,
      headers: Object.create(this.headers),
      cookies: Object.create(this.cookies),
    };
  }

  toString() {
    return JSON.stringify(this);
  }
}

export default RequestParameter;
