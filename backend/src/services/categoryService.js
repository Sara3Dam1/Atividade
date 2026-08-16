const pool = require('../config/db');

const createCategory = async ({ nome, descricao }) => {
  if (!nome) {
    const error = new Error('Nome da categoria é obrigatório.');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
    [nome, descricao || null]
  );

  return {
    id: result.insertId,
    nome,
    descricao: descricao || null,
  };
};

const listCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categorias ORDER BY id DESC');
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);

  if (rows.length === 0) {
    const error = new Error('Categoria não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

const updateCategory = async (id, { nome, descricao }) => {
  const category = await getCategoryById(id);

  await pool.query('UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?', [
    nome || category.nome,
    descricao !== undefined ? descricao : category.descricao,
    id,
  ]);

  return await getCategoryById(id);
};

const deleteCategory = async (id) => {
  await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
};

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
