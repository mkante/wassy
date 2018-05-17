import _ from 'lodash';
import $ from 'jquery';
import Model from './model';

/**
 * Normalize Http headers
 * @param headersAsText
 * @returns {null}
 */
const normalizeHeaders = (headersAsText) => {
  if (!headersAsText) {
    return null;
  }
  const headers = {};
  const lines = headersAsText.split('\n');
  _.each(lines, (item) => {
    const [key, val] = item.split(':');
    if (!key) {
      return;
    }
    headers[key.trim()] = (val) ? val.trim() : val;
  });
  return headers;
};

/**
 * Transform response to Model instance
 * @param responseData
 * @param modelProperties
 * @returns {*}
 */
const createModel = (responseData, modelProperties) => {
  if (typeof responseData === 'string') {
    return responseData;
  }
  if (typeof responseData !== 'object') {
    return responseData;
  }
  const item = {};
  _.merge(item, modelProperties, responseData);
  return new Model(item);
};

/**
 * Call Http status handlers
 * @param err
 * @param response
 * @param postHandlers
 */
const handlePostRequest = (err, response, postHandlers) => {
  const code = _.get(response, 'status');
  if (!_.has(postHandlers, code)) {
    return;
  }
  postHandlers[code](err, response);
};

/**
 * THIS WILL FIX https://github.com/django-tastypie/django-tastypie/issues/886
 */
$.ajaxSetup({
  dataFilter: (data, type) => {
    if (type === 'json' && data === '') {
      data = null;
    }
    return data;
  },
});

const request = (opts, modelDefinition) => {
  const promise = $.Deferred();

  function makeResponseObject(param) {
    return {
      status: param.status,
      headers: normalizeHeaders(param.getAllResponseHeaders()),
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
  })
    .done((data, textStatus, jqXHR) => {
      const response = makeResponseObject(jqXHR);
      handlePostRequest(null, response, opts.postRequest);
      let model = null;
      if (_.isArray(data)) {
        model = [];

        _.each(data, (obj) => {
          const respItem = createModel(obj, modelDefinition);
          model.push(respItem);
        });
      } else if (_.isObjectLike(data)) {
        model = createModel(data, modelDefinition);
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

export {
  normalizeHeaders,
  createModel,
  request,
};
