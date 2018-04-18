const constants = require('./constants');

module.exports = {
  app: {
    ip: process.env.IP || constants.defaultIp,
    port: process.env.PORT || constants.defaultPort
  },
  aws: {
    access: {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY
    },
    bucketName: process.env.S3_CACHE_BUCKET_NAME,
    endpoint: process.env.S3_ENDPOINT
  }
};
