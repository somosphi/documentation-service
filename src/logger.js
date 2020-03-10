const winston = require('winston');
const expressWinston = require('express-winston');
const env = require('./env');

const HeaderConnectingIP = 'cf-connecting-ip';
const HeaderIPCountry = 'cf-ipcountry';

exports.HeaderConnectingIP = HeaderConnectingIP;
exports.HeaderIPCountry = HeaderIPCountry;

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const info = logger.info.bind(logger);
exports.info = info;

const debug = logger.debug.bind(logger);
exports.debug = debug;

const warn = logger.warn.bind(logger);
exports.warn = warn;

const error = logger.error.bind(logger);
exports.error = error;

const expressLoggerOptions = {
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
  dynamicMeta: (req) => {
    const meta = {
      ip: req.headers[HeaderConnectingIP]
        || req.headers['x-forwarded-for']
        || req.connection.remoteAddress,
      country: req.headers[HeaderIPCountry]
        || null,
    };
    return meta;
  },
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: false,
  colorize: false,
  ignoreRoute: (req) => {
    if (env.SNS_LOG) {
      if (req.originalUrl.startsWith('/storages/notify')) {
        return false;
      }
    }

    return ['get', 'options']
      .includes(req.method.toLowerCase());
  },
};

exports.requestlogger = expressWinston.logger(expressLoggerOptions);
exports.errorLogger = expressWinston.errorLogger(expressLoggerOptions);
