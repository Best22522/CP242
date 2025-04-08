const notes = [];

const getNotes = (req, res) => {
  res.render('index', { notes });
};

const addNote = (req, res) => {
  const { title, content } = req.body;
  notes.push({ id: notes.length + 1, title, content });
  res.redirect('/');
};

const editNote = (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);
  res.render('edit', { note });
};

const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const note = notes.find((note) => note.id === id);
  note.title = title;
  note.content = content;
  res.redirect('/');
};

const deleteNote = (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((note) => note.id === id);
  notes.splice(index, 1);
  res.redirect('/');
};

module.exports = {
  getNotes,
  addNote,
  editNote,
  updateNote,
  deleteNote,
};

