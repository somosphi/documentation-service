const debug = require('debug')('integrations:SimpleStorageService');
const AWS = require('aws-sdk');
const { DOMParser } = require('xmldom');

const S3 = new AWS.S3();

/* ENUM */
const DIRECTORY = 'DIRECTORY';
exports.DIRECTORY = DIRECTORY;

const FILE = 'FILE';
exports.FILE = FILE;

const bytesToHumanReadable = (paramSize) => {
  let sizeInBytes = paramSize;
  let i = -1;
  const units = [' kB', ' MB', ' GB'];
  do {
    sizeInBytes /= 1024;
    i += 1;
  } while (sizeInBytes > 1024);
  return Math.max(sizeInBytes, 0.1).toFixed(1) + units[i];
};

exports.bytesToHumanReadable = bytesToHumanReadable;

const format = (response) => {
  const parser = new DOMParser();
  const docs = parser.parseFromString(response, 'text/xml');
  const result = docs.getElementsByTagName('ListBucketResult')[0];
  const files = result.getElementsByTagName('Contents');
  const dirs = result.getElementsByTagName('CommonPrefixes');
  const data = {
    files: [],
    dirs: [],
    next: null,
    prev: null,
  };

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const key = file.getElementsByTagName('Key')[0]
      .textContent;
    const size = file.getElementsByTagName('Size')[0]
      .textContent;
    const lastModified = file.getElementsByTagName('LastModified')[0]
      .textContent;

    data.files.push({
      key,
      lastModified,
      size: bytesToHumanReadable(size),
      type: 'file',
    });
  }

  for (let index = 0; index < dirs.length; index += 1) {
    const dir = dirs[index];
    const key = dir.getElementsByTagName('Prefix')[0]
      .textContent;

    data.dirs.push({
      key,
      lastModified: '',
      size: '0',
      type: 'directory',
    });
  }

  return data;
};

exports.format = format;

const fileExists = async (filename, { Bucket }) => {
  try {
    await S3.headObject({
      Bucket,
      Key: filename,
    }).promise();

    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }

    throw err;
  }
};

exports.fileExists = fileExists;

// TODO: Aplicar paginação
const ln = async (path, { Bucket }) => {
  debug('ln check path "%s"', path);
  let prefix = path;
  if (path[0] === '/') {
    prefix = path.substring(1);
  }

  if (prefix.length && prefix[prefix.length - 1] !== '/') {
    prefix = `${prefix}/`;
  }

  debug('ln final path "%s"', prefix);

  const response = await S3.listObjectsV2({
    Bucket,
    MaxKeys: 1000,
    Delimiter: '/',
    Prefix: prefix,
  }).promise();

  debug('ln response "%s"', JSON.stringify(response));

  const result = [];
  response.CommonPrefixes.map((directory) => {
    const nameParts = directory.Prefix.split('/');

    result.push({
      name: nameParts[nameParts.length - 1],
      key: directory.Prefix,
      lastModified: null,
      size: '0',
      type: DIRECTORY,
    });

    return null;
  });

  response.Contents.map((file) => {
    const nameParts = file.Key.split('/');

    result.push({
      name: nameParts[nameParts.length - 1],
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      type: FILE,
    });

    return null;
  });

  debug('ln result "%s"', JSON.stringify(result));
  return result;
};

exports.ln = ln;

const get = async (filename, { Bucket }) => {
  try {
    const response = await S3.getObject({
      Bucket,
      Key: filename,
    }).promise();

    return response;
  } catch (err) {
    if (['NoSuchKey', 'NotFound'].includes(err.code)) {
      return null;
    }

    throw err;
  }
};

exports.get = get;
