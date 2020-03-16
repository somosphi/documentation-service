const { resolve } = require('url');
const { utc } = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');
const env = require('../env');
const logger = require('../logger');
const SimpleStorageService = require('../integrations/SimpleStorageService');
const CloudFront = require('../integrations/CloudFront');
const doctypesList = require('../enum/doctypes/list');
const doctypeHelper = require('../helpers/doctypeHelper');
const { S3, SS, clearS3Cache } = require('../helpers/cache');

const Namespace = require('../entities/Namespace');
const Service = require('../entities/Service');
const Doctype = require('../entities/Doctype');

const params = { Bucket: env.AWS_BUCKET };
const favicons = [
  'favicon.png',
  'favicon.jpeg',
  'favicon.jpg',
  'favicon.gif',
  'favicon.svg',
];

/**
 * @returns {Promise<import('../entities/Namespace')[]>}
 */
const getNamespaces = async () => {
  logger.info(`${utc()}: Start fetch`);
  const array = await SimpleStorageService.ln('/', params);
  const namespaces = array.filter((row) => row.type === SimpleStorageService.DIRECTORY);
  return namespaces.map((row) => new Namespace(row.key))
    .filter((namespace) => namespace);
};

const validateDoctype = (file) => {
  for (let index = 0; index < doctypesList.length; index += 1) {
    const doctype = doctypesList[index];

    if (doctype.files.includes(file.name)) {
      return [doctype, file];
    }
  }

  return null;
};

/**
 * @param {import('../entities/Service')} service
 */
const setDoctypes = async (service) => {
  const list = await SimpleStorageService.ln(service.key, params);
  const files = list.filter((value) => value.type === SimpleStorageService.FILE);
  const matchs = files.map(validateDoctype)
    .filter((row) => row !== null);

  const favicon = files.find((value) => favicons.includes(value.name));
  if (favicon) {
    const icon = resolve('/', [
      'fetch',
      favicon.key,
    ].join('/'));

    service.setContent({ icon });
  }

  if (matchs.length === 0) {
    return;
  }

  const doit = matchs.map(async ([doctypeEnum, file]) => {
    const doctype = new Doctype(doctypeEnum, service, file);

    try {
      const raw = await SimpleStorageService.get(file.key, params);
      const content = doctypeHelper.parser(doctypeEnum, file.name, raw.Body);

      service.setContent(content);
      doctype.setContent(content);
    } catch (ex) {
      doctype.setContent({
        enabled: false,
        error: ex.message.toString(),
      });
      logger.warn(`${utc()}: fetch fail on file '${file.key}' by ${ex.message}`);
    } finally {
      service.doctypes.push(doctype);
    }

    return null;
  });

  await Promise.all(doit);
};

/**
 * @param {import('../entities/Namespace')} namespace
 */
const setServices = async (namespace) => {
  const array = await SimpleStorageService.ln(namespace.key, params);
  const services = array.filter((row) => row.type === SimpleStorageService.DIRECTORY);
  const doit = services.map(async (row) => {
    const service = new Service(row.key, namespace);
    await setDoctypes(service);

    namespace.services.push(service);
    return null;
  });

  return Promise.all(doit);
};

const fetchData = async () => {
  const reference = uuidv4();

  const namespaces = await getNamespaces();
  await Promise.all(namespaces.map(setServices));
  clearS3Cache();

  const data = {
    createAt: utc().toISOString(true),
    reference,
    data: namespaces,
  };

  SS.set('data', data);
  if (env.AWS_CLOUDFRONT_ID) {
    await CloudFront.invalidation(reference, ['/*']);
  }

  return data;
};

exports.fetchData = fetchData;

const getData = async () => {
  const data = SS.get('data');

  if (!data) {
    return fetchData();
  }

  return data;
};

exports.getData = getData;

/**
 *
 * @param {String} key
 */
const getItem = async (key) => {
  const data = S3.getKey(key);
  if (data) {
    return Buffer.from(data, 'base64');
  }

  const response = await SimpleStorageService.get(key, params);
  if (response) {
    S3.setKey(key, response.Body.toString('base64'));
    S3.save(true);
    return response.Body;
  }

  return null;
};

exports.getItem = getItem;
