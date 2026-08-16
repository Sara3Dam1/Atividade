const pool = require('../config/db');
const { getProductById } = require('./productService');

const createMovement = async ({ produto_id, usuario_id, tipo, quantidade, observacao }) => {
  if (!produto_id || !usuario_id || !tipo || !quantidade) {
    const error = new Error('Produto, usuário, tipo e quantidade são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
    const error = new Error('Tipo de movimentação inválido. Use ENTRADA ou SAIDA.');
    error.statusCode = 400;
    throw error;
  }

  const product = await getProductById(produto_id);
  const amount = Number(quantidade);

  if (amount <= 0) {
    const error = new Error('A quantidade deve ser maior que zero.');
    error.statusCode = 400;
    throw error;
  }

  if (tipo === 'SAIDA' && product.quantidade < amount) {
    const error = new Error('Quantidade insuficiente em estoque para essa saída.');
    error.statusCode = 400;
    throw error;
  }

  const novaQuantidade = tipo === 'ENTRADA' ? product.quantidade + amount : product.quantidade - amount;

  const [result] = await pool.query(
    'INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)',
    [produto_id, usuario_id, tipo, amount, observacao || null]
  );

  await pool.query('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produto_id]);

  const [movementRows] = await pool.query('SELECT * FROM movimentacoes WHERE id = ?', [result.insertId]);
  const movement = movementRows[0];

  const updatedProduct = await getProductById(produto_id);
  return { ...movement, product: updatedProduct };
};

const listMovements = async () => {
  const [rows] = await pool.query(`
    SELECT m.*, p.nome as produto_nome
    FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.criado_em DESC
  `);

  return rows;
};

module.exports = {
  createMovement,
  listMovements,
};
