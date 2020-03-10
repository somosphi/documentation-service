const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./env');
const logger = require('./logger');

/* Express */
const server = express();
const router = express.Router();

server.disable('x-powered-by');
server.use(helmet({
  frameguard: {
    action: 'deny',
  },
}));

const corsConfiguration = cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET'],
});

server.use(bodyParser.json({
  type: [
    'application/json',
    'text/plain', // AWS sends this content-type for its messages/notifications
  ],
}));
server.use(logger.requestlogger);


/* Routes */
const storages = require('./routes/storages');
const namespaces = require('./routes/namespaces');
const fetch = require('./routes/fetch');

/* Configure Routes */
router.use('/storages', storages);
router.use('/namespaces', corsConfiguration, namespaces);
router.use('/fetch', corsConfiguration, fetch);


server.use(env.ROUTE, router);
server.use(logger.errorLogger);

server.all('*', (req, res) => {
  res.send('Not Found');
});


setImmediate(async () => {
  /* Start Server */
  server.listen(env.PORT, (err) => {
    if (err) throw err;

    logger.info(`> Ready on ${env.PORT}`);
  });
});
