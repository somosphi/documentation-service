const flatCache = require('flat-cache');
const NodeCache = require('node-cache');
const { TEMP_DIR } = require('../env');

const S3 = flatCache.load('SimpleStorageService', TEMP_DIR);
exports.S3 = S3;

exports.clearS3Cache = () => {
  S3.destroy();
};

const SS = new NodeCache();
exports.SS = SS;
