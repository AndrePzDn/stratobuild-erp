const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const paginatedList = require('./paginatedList');

function modelController() {
  const Model = mongoose.model('ProjectInventory');
  const methods = createCRUDController('ProjectInventory');

  methods.list = (req, res) => paginatedList(Model, req, res);
  return methods;
}

module.exports = modelController();
