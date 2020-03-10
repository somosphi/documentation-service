const { join } = require('path');
const apm = require('elastic-apm-node');
require('dotenv').config();
const AWS = require('aws-sdk');

if (process.env.ELASTIC_APM_SERVER_URL) {
  apm.start();
}

const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  ROUTE: process.env.ROUTE || '/',

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
  AWS_SNS_ARN: process.env.AWS_SNS_ARN,
  AWS_CLOUDFRONT_ID: process.env.AWS_CLOUDFRONT_ID,
  SNS_LOG: process.env.SNS_LOG === 'true',

  /* Cors */
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  /* Dirs */
  TEMP_DIR: join(__dirname, '..', '.temp'),
};

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

module.exports = Object.freeze(env);
