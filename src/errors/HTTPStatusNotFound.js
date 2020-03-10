class HTTPStatusNotFound extends Error {
  constructor() {
    super('Entidade não encontrada');
  }
}

module.exports = HTTPStatusNotFound;
