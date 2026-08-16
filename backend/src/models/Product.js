// Model de Produto - acesso ao banco de dados

const pool = require('../config/db');

async function create(nome, categoriId, preco, quantidade, descricao, estoqueMinimo) {
  const [result] = await pool.query(
    'INSERT INTO produtos (nome, categoria_id, preco, quantidade, descricao, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, categoriId, preco, quantidade, descricao || null, estoqueMinimo || 0]
  );
  return result;
}

async function getAll() {
  const [rows] = await pool.query(`
    SELECT p.*, c.nome as categoria_nome 
    FROM produtos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id 
    ORDER BY p.id DESC
  `);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, c.nome as categoria_nome 
     FROM produtos p 
     LEFT JOIN categorias c ON p.categoria_id = c.id 
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

async function update(id, nome, categoriId, preco, quantidade, descricao, estoqueMinimo) {
  const [result] = await pool.query(
    'UPDATE produtos SET nome = ?, categoria_id = ?, preco = ?, quantidade = ?, descricao = ?, estoque_minimo = ? WHERE id = ?',
    [nome, categoriId, preco, quantidade, descricao, estoqueMinimo, id]
  );
  return result;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
