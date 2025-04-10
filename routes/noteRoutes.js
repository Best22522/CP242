const express = require('express');
const router = express.Router();
const Note = require('../models/NoteM');
const User = require('../models/User');

// Handle Note Creation
router.post('/create', async (req, res) => {
  const { title, content } = req.body;

  // Ensure user is logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findById(req.session.user.id);  // Ensure you're fetching by the user ID
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create a new note, associating it with the logged-in user's ID
    const newNote = new Note({
      title,
      content,
      user: user._id,  // Reference to the logged-in user's ID
    });

    await newNote.save();
    res.redirect('/view');  // Redirect to view page after saving
  } catch (err) {
    console.error('Error saving note:', err);  // Log the error for debugging
    res.status(500).send('Error saving the note');
  }
});

// Show View Notes Page
router.get('/view', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');  // Ensure user is logged in
  }

  try {
    const user = await User.findById(req.session.user.id);  // Ensure fetching the user by ID
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Fetch notes that belong to the logged-in user
    const notes = await Note.find({ user: user._id });  // Only fetch notes associated with the logged-in user

    // Pass notes to the view
    res.render('view', { notes });  // Ensure you're passing the notes properly
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes');
  }
});

module.exports = router;
