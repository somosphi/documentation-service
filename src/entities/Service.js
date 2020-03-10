const titleCase = require('title-case');
const paramCase = require('param-case');

/**
* @class
* @property {String} key
* @property {String} path
* @property {String} link
* @property {String} [version]
* @property {String} [description]
* @property {String} [logo]
* @property {String} title
* @property {Doctype[]} doctypes
*/

class Service {
  /**
   * @param {String} key
   * @param {import('./Namespace')} namespace
   */
  constructor(key, namespace) {
    const path = paramCase(key);

    this.key = key;
    this.label = titleCase(key.replace(namespace.key, ''));
    this.version = null;
    this.description = null;
    this.icon = null;
    this.path = path;
    this.link = `/${namespace.path}/${path}`;
    this.doctypes = [];
    this.enabled = true;
  }

  setContent(content) {
    if (typeof content.version === 'string') {
      this.version = content.version;
    }

    if (typeof content.icon === 'string') {
      this.icon = content.icon;
    }

    if (typeof content.enabled === 'boolean') {
      this.enabled = content.enabled;
    }
  }
}

module.exports = Service;
