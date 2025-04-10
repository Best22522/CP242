app.get('/note', (req, res) => {
    const loggedInUser = req.session.user; // Assuming you're storing user data in the session
    res.render('note', { loggedInUser });
  });
  