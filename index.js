const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const User = require('./models/User');  // Import the User model
const Note = require('./models/NoteM');  // Import the Note model


const taskController = require('./controllers/taskController');
const authController = require('./controllers/authController');

const app = express();

// --- MongoDB Connection ---
mongoose.connect('mongodb+srv://08042025g:08042025g@mongodatabase.x05kgnr.mongodb.net/?retryWrites=true&w=majority&appName=MongoDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// --- Middleware ---
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Example for home route
app.get('/', (req, res) => {
  const loggedInUser = req.session.user; // Assuming session stores user info
  console.log(loggedInUser);  // Add this to debug

  res.render('home', { loggedInUser });
});

// In your route handler for rendering 'note.ejs'
app.get('/note', (req, res) => {
  const loggedInUser = req.session.user;  // Retrieve the full user object from the session
  res.render('note', { loggedInUser });   // Pass it to the view
});

// In your route handler for rendering 'note.ejs'
app.get('/edit', (req, res) => {
  const loggedInUser = req.session.user;  // Retrieve the full user object from the session
  res.render('edit', { loggedInUser });   // Pass it to the view
});

// In your route handler for rendering 'note.ejs'
app.get('/create', (req, res) => {
  const loggedInUser = req.session.user;  // Retrieve the full user object from the session
  res.render('create', { loggedInUser });   // Pass it to the view
});

app.get('/view', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    console.log('User in session:', req.session.user);

    // Fetch the logged-in user from the database
    const loggedInUser = await User.findById(req.session.user.id);
    if (!loggedInUser) {
      return res.status(404).send('User not found');
    }

    // Fetch the user's notes
    const notes = await Note.find({ user: req.session.user.id });

    console.log('Fetched notes:', notes);

    // Render the view with notes and loggedInUser
    res.render('view', { notes, loggedInUser });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Server error');
  }
});

// Route สำหรับการสร้างโน้ตใหม่
app.post('/create', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const { title, content } = req.body;

    // สร้างโน้ตใหม่
    const newNote = new Note({
      title,
      content,
      user: req.session.user.id  // เพิ่ม user ID เพื่อเก็บว่าโน้ตนี้ของใคร
    });

    await newNote.save();  // บันทึกลง MongoDB

    res.redirect('/view');  // ไปที่หน้า view ที่จะแสดงโน้ตทั้งหมด
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).send('Server error');
  }
});

// Route สำหรับการดูโน้ตทั้งหมดของผู้ใช้
app.get('/view', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    console.log('User in session:', req.session.user);

    // Fetch the logged-in user from the database
    const loggedInUser = await User.findById(req.session.user.id);
    if (!loggedInUser) {
      return res.status(404).send('User not found');
    }

    // Fetch the user's notes
    const notes = await Note.find({ user: req.session.user.id });

    console.log('Fetched notes:', notes);

    // Render the view with notes and loggedInUser
    res.render('view', { notes, loggedInUser });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Server error');
  }
});

// Route สำหรับการแสดงฟอร์มแก้ไขโน้ต
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    // ตรวจสอบว่าโน้ตนี้เป็นของผู้ใช้ที่ล็อกอินอยู่
    if (note.user.toString() !== req.session.user.id) {
      return res.status(403).send('Not authorized');
    }

    res.render('edit', { note });
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).send('Server error');
  }
});

// Route สำหรับบันทึกการอัปเดตโน้ต
app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    // ตรวจสอบว่าโน้ตนี้เป็นของผู้ใช้ที่ล็อกอินอยู่
    if (note.user.toString() !== req.session.user.id) {
      return res.status(403).send('Not authorized');
    }

    // อัปเดตโน้ต
    note.title = title;
    note.content = content;
    await note.save();

    res.redirect('/view');  // ไปที่หน้า view เพื่อดูโน้ตที่อัปเดต
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).send('Server error');
  }
});

// Route สำหรับการลบโน้ต
app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    // ตรวจสอบว่าโน้ตนี้เป็นของผู้ใช้ที่ล็อกอินอยู่
    if (note.user.toString() !== req.session.user.id) {
      return res.status(403).send('Not authorized');
    }

    // ลบโน้ต
    await note.remove();
    res.redirect('/view');  // ไปที่หน้า view
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).send('Server error');
  }
});

// Import routes
const noteRoutes = require('./routes/noteRoutes');
app.use(noteRoutes);  // Use the note routes

app.use('/notes', noteRoutes);  // Linking the routes defined in noteroutes.js to /notes
app.get('/view/:name', taskController.viewTask);
app.get('/logout', authController.logout);
app.get('/sort', authController.authenticate, taskController.sortTasksByPriority);
app.get('/login', authController.showLoginPage);
app.post('/login', authController.login);
app.get('/register', authController.showRegisterPage);
app.post('/register', authController.register);
app.post('/add', authController.authenticate, taskController.addTask);
app.post('/delete', authController.authenticate, taskController.deleteMultipleTasks);
app.post('/search', authController.authenticate, taskController.searchTasksByName);

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
