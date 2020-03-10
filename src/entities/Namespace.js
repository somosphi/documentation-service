const titleCase = require('title-case');
const paramCase = require('param-case');

/**
* @class
* @property {String} path
* @property {String} label
* @property {String} key
* @property {String} term
* @property {String} link
* @property {String} theme
* @property {Service[]} services
*/
class Namespace {
  /**
   * @param {String} key
   */
  constructor(key) {
    const path = paramCase(key);

    this.key = key;
    this.label = titleCase(key);
    this.path = path;
    this.link = `/${path}`;
    this.term = path.replace('-', '');
    this.services = [];
    this.enabled = true;
  }

  setContent(content) {
    if (typeof content.enabled === 'boolean') {
      this.enabled = content.enabled;
    }
  }
}

module.exports = Namespace;
