const request = require('request-promise');

function get(url, isJson) {
  return request({
    method: 'GET',
    uri: url,
    json: isJson,
    resolveWithFullResponse: true
  });
}

async function getContent(url, isJson) {
  let response = await get(url, isJson);
  return response.body;
}

async function getContentIfExists(url, isJson) {
  return new Promise((resolve, reject) => {
    get(url, isJson)
      .then(result => {
        resolve(result.body);
      })
      .catch(error => {
        if (error && error.statusCode === 404) {
          resolve(null);
        } else {
          reject(error);
        }
      });
  });
}

module.exports = {
  getJson(url) {
    return getContent(url, true);
  },
  getJsonIfExists(url) {
    return getContentIfExists(url, true);
  },
  getHtmlIfExists(url) {
    return getContentIfExists(url);
  },
  getHtml(url) {
    return getContent(url);
  }
};
