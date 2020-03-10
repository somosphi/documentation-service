const express = require('express');
const ApiControllers = require('../controllers/ApiControllers');

const router = express.Router();

router.get('/', ApiControllers.listNamespaces);

module.exports = router;
