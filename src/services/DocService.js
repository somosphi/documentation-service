const StorageService = require('./StorageService');

/**
 * @returns {Promise<import('../entities/Namespace')[]>}
 */
const list = () => {
  return StorageService.getData();
};

exports.list = list;
