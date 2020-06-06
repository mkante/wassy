import { define } from './endpoint';

module.exports = (option, params = null) => {
  const obj = (option.url || option.host || option.uri) ? option : { url: option };

  return define(obj).new().get(params);
};
