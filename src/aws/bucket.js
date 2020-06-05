const AWS = require('aws-sdk');
const config = require('../config');

class Bucket {
  constructor() {
    this._client = new AWS.S3({
      accessKeyId: config.aws.access.key,
      secretAccessKey: config.aws.access.secret,
      region: config.aws.region,
      signatureVersion: 'v4'
    });
    this._bucketName = config.aws.bucketName;
  }

  getFileStream(filename) {
    return this._client
      .getObject({
        Bucket: this._bucketName,
        Key: filename
      })
      .createReadStream();
  }

  getFileInfo(filename) {
    return new Promise((resolve, reject) => {
      this._client.headObject(
        {
          Bucket: this._bucketName,
          Key: filename
        },
        (err, data) => {
          if (!err) {
            return resolve(data);
          }

          if (err.statusCode === 404) {
            return resolve(false);
          }

          reject(err);
        }
      );
    });
  }

  putBuffer(buffer, path) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this._bucketName,
        Key: path,
        Body: buffer,
        ContentType: 'text/html'
      };
      this._client.upload(params, (err) => {
        if (err) {
          return reject(err);
        }

        resolve(true);
      });
    });
  }
}

module.exports = new Bucket();
