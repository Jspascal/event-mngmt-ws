const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const sendError = (res, message) => {
  res.status(400).json({ error: message });
};

module.exports = {
  generateId,
  sendError,
};
