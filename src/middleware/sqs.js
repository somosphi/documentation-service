const AWS = require('aws-sdk');
const { AWS_SNS_ARN } = require('../env');

const SNS = new AWS.SNS();
const SUBSCRIPTION_CONFIRMATION = 'SubscriptionConfirmation';
const NOTIFICATION = 'Notification';

/**
 *
 * @param {String} token
 * @returns {Promise<String>}
 */
const confirmSubscription = async (token) => {
  const data = await SNS.confirmSubscription({
    Token: token,
    TopicArn: AWS_SNS_ARN,
  }).promise();

  return data.SubscriptionArn;
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sqs = async (req, res, next) => {
  if (req.headers['x-amz-sns-topic-arn'] !== AWS_SNS_ARN) {
    res.status(401).json({
      message: 'wrong ARN',
    });
    return;
  }

  if (req.headers['x-amz-sns-message-type'] === SUBSCRIPTION_CONFIRMATION) {
    res.sendStatus(203);
    await confirmSubscription(req.body.Token);
    return;
  }


  if (req.headers['x-amz-sns-message-type'] === NOTIFICATION) {
    next();
    return;
  }

  res.status(400).json({
    message: 'wrong message type',
  });
};

exports.sqs = sqs;
