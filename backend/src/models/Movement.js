// Model de Movimentação - acesso ao banco de dados

const pool = require('../config/db');

async function create(produtoId, usuarioId, tipo, quantidade, observacao) {
  const [result] = await pool.query(
    'INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)',
    [produtoId, usuarioId, tipo, quantidade, observacao || null]
  );
  return result;
}

async function getAll() {
  const [rows] = await pool.query(`
    SELECT m.*, p.nome as produto_nome 
    FROM movimentacoes m 
    LEFT JOIN produtos p ON m.produto_id = p.id 
    ORDER BY m.criado_em DESC
  `);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT m.*, p.nome as produto_nome 
     FROM movimentacoes m 
     LEFT JOIN produtos p ON m.produto_id = p.id 
     WHERE m.id = ?`,
    [id]
  );
  return rows[0];
}

async function update(id, tipo, quantidade, observacao) {
  const [result] = await pool.query(
    'UPDATE movimentacoes SET tipo = ?, quantidade = ?, observacao = ? WHERE id = ?',
    [tipo, quantidade, observacao, id]
  );
  return result;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM movimentacoes WHERE id = ?', [id]);
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
