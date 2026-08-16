// Model de Usuário - acesso ao banco de dados

const pool = require('../config/db');

async function create(nome, email, senhaHash) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return result;
}

async function getAll() {
  const [rows] = await pool.query('SELECT id, nome, email, criado_em FROM usuarios ORDER BY id DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0];
}

async function update(id, nome, email) {
  const [result] = await pool.query(
    'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
    [nome, email, id]
  );
  return result;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  getByEmail,
  update,
  remove,
};
