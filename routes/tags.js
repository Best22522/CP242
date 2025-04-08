const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');

router.get('/', tagsController.getTags);
// Add other routes related to tags

module.exports = router;
