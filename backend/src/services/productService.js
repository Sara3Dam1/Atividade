const pool = require('../config/db');

const createProduct = async ({ nome, descricao, categoria_id, preco, quantidade, estoque_minimo }) => {
  if (!nome || !categoria_id || preco === undefined || quantidade === undefined) {
    const error = new Error('Nome, categoria, preço e quantidade em estoque são obrigatórios.');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO produtos (nome, descricao, categoria_id, preco, quantidade, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, descricao || null, categoria_id, Number(preco), Number(quantidade), Number(estoque_minimo) || 0]
  );

  return await getProductById(result.insertId);
};

const listProducts = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nome as categoria_nome
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.id DESC
  `);

  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nome as categoria_nome
    FROM produtos p
    INNER JOIN categorias c ON c.id = p.categoria_id
    WHERE p.id = ?
  `, [id]);

  if (rows.length === 0) {
    const error = new Error('Produto não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

const updateProduct = async (id, { nome, descricao, categoria_id, preco, quantidade, estoque_minimo }) => {
  const product = await getProductById(id);

  await pool.query(
    'UPDATE produtos SET nome = ?, descricao = ?, categoria_id = ?, preco = ?, quantidade = ?, estoque_minimo = ? WHERE id = ?',
    [
      nome || product.nome,
      descricao !== undefined ? descricao : product.descricao,
      categoria_id || product.categoria_id,
      preco !== undefined ? Number(preco) : Number(product.preco),
      quantidade !== undefined ? Number(quantidade) : Number(product.quantidade),
      estoque_minimo !== undefined ? Number(estoque_minimo) : Number(product.estoque_minimo),
      id,
    ]
  );

  return await getProductById(id);
};

const deleteProduct = async (id) => {
  await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
