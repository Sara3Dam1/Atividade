// Model de Categoria - acesso ao banco de dados

const pool = require('../config/db');

async function create(nome, descricao) {
  const [result] = await pool.query(
    'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
    [nome, descricao || null]
  );
  return result;
}

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM categorias ORDER BY id DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
  return rows[0];
}

async function update(id, nome, descricao) {
  const [result] = await pool.query(
    'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
    [nome, descricao, id]
  );
  return result;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
