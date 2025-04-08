const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.getCategories);
// Add other routes related to categories

module.exports = router;
