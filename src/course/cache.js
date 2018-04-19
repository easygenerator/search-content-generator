const bucket = require('../aws/bucket');
const config = require('../config');

function getFileName(courseId) {
  return `${config.cache.folder}/${courseId}.html`;
}

module.exports = {
  async get(courseId, publishedOn) {
    let fileStream = await bucket.getFileStream(getFileName(courseId));
    if (fileStream) {
      let searchContentModifiedDate = new Date(fileStream.headers['last-modified']);
      if (publishedOn <= searchContentModifiedDate) {
        return fileStream;
      }
    }
  },
  async add(courseId, html) {
    await bucket.putBuffer(Buffer.from(html), getFileName(courseId));
  }
};
