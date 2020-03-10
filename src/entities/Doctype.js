const { resolve } = require('url');
/**
* @class
  @property {string} key
* @property {string} type
* @property {String} location
* @property {String} link
* @property {boolean} available
*/
class Doctype {
  /**
   * @param {import('../enum/doctypes/list').DoctypeEnum} doctypeEnum
   * @param {import('./Service')} service
   * @param {Object} file
   */
  constructor(doctypeEnum, service, file) {
    this.type = doctypeEnum.type;
    this.key = file.key;
    this.label = doctypeEnum.label;
    this.path = doctypeEnum.slug;
    this.link = resolve(service.link, doctypeEnum.slug);
    this.location = resolve('/fetch', file.key);
    this.enabled = true;
    this.version = null;
    this.error = null;
  }

  setContent(content) {
    if (typeof content.version === 'string') {
      this.version = content.version;
    }

    if (typeof content.enabled === 'boolean') {
      this.enabled = content.enabled;
    }

    if (typeof content.error === 'string') {
      // eslint-disable-next-line prefer-destructuring
      this.error = content.error.split('\n')[0];
    }
  }
}

module.exports = Doctype;
