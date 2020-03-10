const DocService = require('../services/DocService');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const listNamespaces = async (req, res) => {
  const data = await DocService.list();
  res.json(data);
};

exports.listNamespaces = listNamespaces;
