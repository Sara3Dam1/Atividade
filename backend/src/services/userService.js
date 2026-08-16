const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { signToken } = require('../config/jwt');

const registerUser = async ({ nome, email, password }) => {
  if (!nome || !email || !password) {
    const error = new Error('Nome, e-mail e senha são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);

  if (existingUser.length > 0) {
    const error = new Error('E-mail já cadastrado.');
    error.statusCode = 409;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, hashPassword]
  );

  const user = {
    id: result.insertId,
    nome,
    email,
  };

  return {
    user,
    token: signToken({ id: user.id, email: user.email, nome: user.nome }),
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('E-mail e senha são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

  if (users.length === 0) {
    const error = new Error('Credenciais inválidas.');
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];
  const passwordMatches = await bcrypt.compare(password, user.senha_hash);

  if (!passwordMatches) {
    const error = new Error('Credenciais inválidas.');
    error.statusCode = 401;
    throw error;
  }

  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
    },
    token: signToken({ id: user.id, email: user.email, nome: user.nome }),
  };
};

module.exports = {
  registerUser,
  loginUser,
};
