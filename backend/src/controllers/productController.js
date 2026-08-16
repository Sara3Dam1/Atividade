const {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

const create = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const products = await listProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};
