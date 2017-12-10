/* eslint global-require: "off" */
import _ from 'lodash';
import $ from 'jquery';
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
  const code = _.get(response, 'status');
  if (!_.has(postHandlers, code)) {
    return;
  }
  postHandlers[code](err, response);
}

module.exports = (opts, modelDefinition) => {
  const promise = $.Deferred();

  function makeResponseObject(param) {
    return {
      status: param.status,
      headers: param.getAllResponseHeaders(),
      body: param.responseText,
      data: param.responseJSON,
      request: {
        method: opts.method,
        data: opts.body,
        headers: opts.headers,
      },
    };
  }

  $.ajax({
    method: opts.method,
    url: opts.url,
    crossDomain: true,
    dataType: 'json',
    headers: opts.headers,
    data: opts.body,
    json: true,
  })
    .done((data, textStatus, jqXHR) => {
      const response = makeResponseObject(jqXHR);
      handlePostRequest(null, response, opts.postRequest);
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
      promise.resolve(response);
    })
    .fail((jqXHR, textStatus, err) => {
      const response = makeResponseObject(jqXHR);
      handlePostRequest(err, response, opts.postRequest);
      promise.reject(err);
    });
  return promise;
};
