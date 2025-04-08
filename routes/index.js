const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getNotes);
router.post('/add', noteController.addNote);
router.get('/edit/:id', noteController.editNote);
router.post('/edit/:id', noteController.updateNote);
router.get('/delete/:id', noteController.deleteNote);

module.exports = router;

