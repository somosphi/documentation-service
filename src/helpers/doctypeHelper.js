const path = require('path');
const yaml = require('js-yaml');
const get = require('lodash/get');
const {
  ASYNCAPI,
  OPENAPI,
} = require('../enum/doctypes');

const parserAsyncAPI = (ext, content) => {
  let mapped = null;

  if (['.yaml', '.yml'].includes(ext)) {
    mapped = yaml.safeLoad(content);
  }

  if (['.json'].includes(ext)) {
    mapped = JSON.parse(content);
  }

  return {
    version: get(mapped, 'info.version', null),
  };
};

const parserOpenAPI = (ext, content) => {
  let mapped = null;

  if (['.yaml', '.yml'].includes(ext)) {
    mapped = yaml.safeLoad(content);
  }

  if (['.json'].includes(ext)) {
    mapped = JSON.parse(content);
  }

  return {
    version: get(mapped, 'info.version', null),
  };
};

/**
 *
 * @param {*} doctype
 * @param {String} filename
 * @param {*} buffer
 */
const parser = (doctype, filename, buffer) => {
  const content = buffer.toString('utf-8');
  const ext = path.extname(filename)
    .toLowerCase();

  switch (doctype.type) {
    case ASYNCAPI: return parserAsyncAPI(ext, content);
    case OPENAPI: return parserOpenAPI(ext, content);
    default: return null;
  }
};

exports.parser = parser;
