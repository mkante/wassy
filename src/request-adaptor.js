/* eslint global-require: "off" */
import _ from 'lodash';
import rp from 'request';
import Model from './model';

function toReponseItemModel(responseData, modelProperties) {
  if (typeof responseData !== 'object') {
    return responseData;
  }
  const item = {};
  _.merge(item, modelProperties, responseData);
  return new Model(item);
}

function handlePostRequest(err, response, postHandlers) {
  const code = _.get(response, 'statusCode');
  if (!_.has(postHandlers, code)) {
    return;
  }
  postHandlers[code](err, response);
}

module.exports = (opts, modelDefinition) => {
  opts.json = true;
  const promise = new Promise((resolve, reject) => {
    rp(opts, (err, response, data) => {
      handlePostRequest(err, response, opts.postRequest);
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

      response.model = model;
      resolve(response);
    });
  });
  return promise;
};
