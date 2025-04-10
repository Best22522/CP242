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
    
    console.log('Fetched Notes:', notes); // Debugging line
    // Pass notes to the view
    res.render('view', { notes });  // Ensure you're passing the notes properly
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes');
  }
});


// Edit Note Route (GET)
router.get('/edit/:id', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.session.user.id) {
      return res.status(404).send('Note not found or unauthorized');
    }
    res.render('edit', { note });  // Render the edit form
  } catch (err) {
    console.error('Error fetching note for editing:', err);
    res.status(500).send('Error fetching note');
  }
});

// Edit Note Route (POST)
router.post('/edit/:id', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.session.user.id) {
      return res.status(404).send('Note not found or unauthorized');
    }

    // Update note
    note.title = req.body.title;
    note.content = req.body.content;
    await note.save();

    res.redirect('/view');  // Redirect after saving
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).send('Error updating note');
  }
});

// New route using POST (change from GET to POST for delete)
router.post('/delete/:id', async (req, res) => { 
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const note = await Note.findById(req.params.id);  // Find the note by ID
    if (!note || note.user.toString() !== req.session.user.id) {
      return res.status(404).send('Note not found or unauthorized');
    }

    // Delete note using findByIdAndDelete
    await Note.findByIdAndDelete(req.params.id);

    res.redirect('/view');  // Redirect to the view page after deletion
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).send('Error deleting note');
  }
});



module.exports = router;
