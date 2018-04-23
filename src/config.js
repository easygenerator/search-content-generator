const constants = require('./constants');

module.exports = {
  app: {
    ip: process.env.IP || constants.defaultIp,
    port: process.env.PORT || constants.defaultPort
  },
  aws: {
    access: {
      key: process.env.S3_ACCESS_KEY_ID,
      secret: process.env.S3_SECRET_ACCESS_KEY
    },
    bucketName: process.env.S3_CACHE_BUCKET_NAME,
    region: process.env.S3_REGION || 'us-east-1'
  }
};
