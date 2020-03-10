const OpenAPI = require('./OpenAPI');
const AsyncAPI = require('./AsyncAPI');

/**
 * @typedef DoctypeEnum
 * @type {Object}
 * @property {String} label
 * @property {String} type
 * @property {String} slug
 * @property {String[]} files
 */

module.exports = [
  OpenAPI,
  AsyncAPI,
];
