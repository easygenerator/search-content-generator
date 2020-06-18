const bucket = require('../aws/bucket');

function getFileName(courseId) {
  return `${courseId}.html`;
}

module.exports = {
  async get(courseId, publishedOn) {
    const filename = getFileName(courseId);
    try {
      const fileInfo = await bucket.getFileInfo(filename);
      if (!fileInfo) {
        return;
      }

      const fileStream = bucket.getFileStream(filename);
      if (!fileStream) {
        return;
      }

      if (publishedOn <= fileInfo.LastModified) {
        return fileStream;
      }
    } catch (e) {
      console.error(e);
    }
  },
  async add(courseId, html) {
    await bucket.putBuffer(Buffer.from(html), getFileName(courseId));
  }
};
