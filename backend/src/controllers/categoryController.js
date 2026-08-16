const {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

const create = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).json({ message: 'Categoria removida com sucesso.' });
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
