const express = require('express');
const { sqs } = require('../middleware/sqs');
const StorageController = require('../controllers/StorageController');

const router = express.Router();

router.post('/notify', [
  sqs,
  StorageController.notify,
]);

module.exports = router;
