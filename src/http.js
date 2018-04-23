const request = require('request-promise');

async function get(url, isJson) {
  let response = await request({
    method: 'GET',
    uri: url,
    json: isJson,
    resolveWithFullResponse: true
  });

  return response.body;
}

module.exports = {
  getJson(url) {
    return get(url, true);
  },
  getHtml(url) {
    return get(url);
  }
};
