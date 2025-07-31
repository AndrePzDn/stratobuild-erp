const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController')

const paginatedList = require('./paginatedList');

function modelController() {
  const Model = mongoose.model('Task')
  const methods = createCRUDController('Task');

  methods.list = (req, res) => paginatedList(Model, req, res);
  return methods;
}

module.exports = modelController();
