const bcrypt = require('bcrypt');
const User = require('../models/User');

// Show login form
exports.showLoginPage = (req, res) => {
  res.render('login', { error: req.query.error || null });
};

// Show register form
exports.showRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

// Handle login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      req.session.user = { id: user._id, username: user.username };  // Store user info in session
      console.log(`${username} has logged in`);
      res.redirect('/note');  // Redirect to note.ejs after successful login
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    res.render('login', { error: 'Server error. Try again.' });
  }
};

// Handle register
exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists' });
    }

    const newUser = new User({ username, password });  // Store password directly
    await newUser.save();
    req.session.user = { id: user._id, username: user.username };  // Store user info in session
    res.redirect('/note');  // Redirect to note.ejs after successful registration
  } catch (err) {
    res.render('register', { error: 'Registration failed. Try again.' });
  }
};


// Middleware to protect routes
exports.authenticate = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
