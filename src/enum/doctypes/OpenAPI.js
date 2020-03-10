const OpenAPI = Object.freeze({
  label: 'OpenAPI',
  type: 'OPENAPI',
  slug: 'openapi',
  files: [
    ...['swagger.yaml', 'swagger.yml', 'swagger.json'],
    ...['openapi.yaml', 'openapi.yml', 'openapi.json'],
  ],
});

module.exports = OpenAPI;
