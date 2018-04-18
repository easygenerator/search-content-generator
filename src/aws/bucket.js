const knox = require('knox');
const config = require('../config');

class Bucket {
  constructor() {
    this.s3Client = knox.createClient({
      key: config.aws.access.key,
      secret: config.aws.access.secret,
      bucket: config.aws.bucketName,
      endpoint: config.aws.endpoint
    });
  }

  getFileStream(fileName) {
    return new Promise(resolve => {
      this.s3Client.getFile(fileName, (err, res) => {
        if (err || res.statusCode !== 200) {
          return resolve(false);
        }
        resolve(res);
      });
    });
  }

  putBuffer(buffer, fileName) {
    return new Promise((resolve, reject) => {
      if (!buffer) {
        reject(new Error('Upload error: buffer is undefined'));
        return;
      }

      let headers = { 'Content-Type': 'text/html' };
      this.s3Client.putBuffer(buffer, fileName, headers, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Upload error: invalid status code. statusCode=${res.statusCode}`));
          return;
        }
        resolve(true);
      });
    });
  }
}

module.exports = new Bucket();
