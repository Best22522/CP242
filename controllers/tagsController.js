const tags = [];

const getTags = (req, res) => {
  res.json({ tags });
};

// Implement other controllers related to tags

module.exports = {
  getTags,
  // Export other tag controllers
};
