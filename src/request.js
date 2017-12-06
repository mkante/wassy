/* eslint global-require: "off" */
import _ from 'lodash';
import Model from './model';

let rp = null;
if (global.document) {
  rp = require('browser-request');
} else {
  rp = require('request');
}

function toReponseItemModel(responseData, modelProperties) {
  const item = {};
  _.merge(item, modelProperties, responseData);
  return new Model(item);
}

module.exports = (opts, modelDefinition) => {
  opts.json = true;
  const promise = new Promise((resolve, reject) => {
    rp(opts, (err, response, data) => {
      if (err) {
        reject(err, response);
        return;
      }

      let model = null;
      if (_.isArray(data)) {
        model = [];

        _.each(data, (obj) => {
          const respItem = toReponseItemModel(obj, modelDefinition);
          model.push(respItem);
        });
      } else if (_.isObjectLike(data)) {
        model = toReponseItemModel(data, modelDefinition);
      } else {
        model = data;
      }

      resolve(model, response);
    });
  });
  return promise;
};
