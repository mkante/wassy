import _ from 'lodash';

class Model {
  constructor(params = {}) {
    const funcs = ['get', 'set', 'toString'];
    _.remove(funcs, (n) => {
      delete params[n];
    });

    _.merge(this, params);
  }
  get(key, defaultVal) {
    return _.get(this, key, defaultVal);
  }
  set(key, value) {
    _.set(this, key, value);
  }
  toString() {
    return JSON.stringify(this);
  }
}

export default Model;
