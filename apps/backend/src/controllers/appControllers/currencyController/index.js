const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Currency');

const create = require('./create');
const list = require('./paginatedList');

function modelController() {
  const Model = mongoose.model('Currency');
  const methods = createCRUDController('Currency');

  methods.create = (req, res) => create(Model, req, res);
  methods.list = (req, res) => list(Model, req, res);
  return methods;
}

module.exports = modelController();
