const StorageService = require('../services/StorageService');
const { getMimeByExt } = require('../helpers/mimeTypes');

let timer = null;
const TIME = 10000 * 4;

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const notify = async (req, res) => {
  res.sendStatus(203);

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(StorageService.fetchData, TIME);
};

exports.notify = notify;

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const fetch = async (req, res) => {
  const key = req.params['0'];

  const content = await StorageService.getItem(key);
  if (content) {
    const mimeType = getMimeByExt(key);

    res.setHeader('Content-Type', mimeType);
    res.charset = 'utf-8';
    res.send(content);
  } else {
    res.status(404)
      .json({ message: 'File not found' });
  }
};

exports.fetch = fetch;
