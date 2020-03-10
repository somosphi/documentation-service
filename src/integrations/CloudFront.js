const debug = require('debug')('integrations:CloudFront');
const AWS = require('aws-sdk');
const { AWS_CLOUDFRONT_ID } = require('../env');

const CloudFront = new AWS.CloudFront();

/**
 * @param {String} reference
 * @param {String[]} items
 * @returns {Promise<import('aws-sdk').CloudFront.CreateInvalidationResult>}
 */
const invalidation = (reference, items = ['/*']) => {
  debug(`invalidate: ${reference}, ${items.join(';')}`);

  return CloudFront.createInvalidation({
    DistributionId: AWS_CLOUDFRONT_ID,
    InvalidationBatch: {
      CallerReference: reference,
      Paths: {
        Quantity: items.length,
        Items: items,
      },
    },
  }).promise();
};

exports.invalidation = invalidation;
