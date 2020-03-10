const express = require('express');
const StorageController = require('../controllers/StorageController');

const router = express.Router();

router.get('/*', StorageController.fetch);

module.exports = router;
