// Controller de Dashboard

const pool = require('../config/db');

const getStats = async (req, res, next) => {
  try {
    // Contar total de produtos
    const [products] = await pool.query('SELECT COUNT(*) as count FROM produtos');
    
    // Contar total de categorias
    const [categories] = await pool.query('SELECT COUNT(*) as count FROM categorias');
    
    // Contar movimentações recentes (últimos 30 dias)
    const [movements] = await pool.query(
      `SELECT COUNT(*) as count FROM movimentacoes 
       WHERE criado_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    res.status(200).json({
      totalProducts: products[0].count,
      totalCategories: categories[0].count,
      recentMovements: movements[0].count
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
