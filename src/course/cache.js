const bucket = require('../aws/bucket');

function getFileName(courseId) {
  return `${courseId}.html`;
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
