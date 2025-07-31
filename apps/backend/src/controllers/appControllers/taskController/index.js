const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController')

const paginatedList = require('./paginatedList');
const update = require('./update');

function modelController() {
  const Model = mongoose.model('Task')
  const methods = createCRUDController('Task');

  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  return methods;
}

module.exports = modelController();
