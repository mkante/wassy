
module.exports = {

  mockMostRecent: (obj = {}) => {
    let { body } = obj;
    body = body || {};
    const request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({
      status: obj.status || 200,
      responseText: (typeof body === 'string') ? body : JSON.stringify(body),
    });
    return request;
  },
};
