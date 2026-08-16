const { createMovement, listMovements } = require('../services/movementService');

const create = async (req, res, next) => {
  try {
    const movement = await createMovement(req.body);
    res.status(201).json(movement);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const movements = await listMovements();
    res.status(200).json(movements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
};
