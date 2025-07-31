const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const create = require('./create');
const remove = require('./remove');

function modelController() {
  const Model = mongoose.model('ConstructionReport');
  const methods = createCRUDController('ConstructionReport');

  methods.create = (req, res) => create(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);

  return methods;
}

module.exports = modelController();
