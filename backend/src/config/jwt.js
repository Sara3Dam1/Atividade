const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'estoque-secret-dev';

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  signToken,
  verifyToken,
};
