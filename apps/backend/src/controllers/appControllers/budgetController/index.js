const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Budget');

const create = require('./create');
const update = require('./update');
const convert = require('./convertBudgetToProject');

function modelController() {
  const Model = mongoose.model('Budget');
  const methods = createCRUDController('Budget');

  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.convert = (req, res) => convert(Model, req, res);
  return methods;
}

module.exports = modelController();
