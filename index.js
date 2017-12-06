import _ from 'lodash';
import RestEndpoint from './src/endpoint';

/**
 * Create a new RestEndpoint
 * @param params
 * @returns {Endpoint}
 * @constructor
 */
function Endpoint(params) {
  return RestEndpoint.create(params);
}

/**
 *
 * @constructor
 */
function RestClient() {}

module.exports = { Endpoint, RestClient };
