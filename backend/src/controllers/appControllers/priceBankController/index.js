const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('PriceBank');

const list = require('./paginatedList');
const search = require('./search');

function modelController() {
  const Model = mongoose.model('PriceBank');
  const methods = createCRUDController('PriceBank');

  methods.search = (req, res) => search(Model, req, res);
  // methods.list = (req, res) => list(Model, req, res);

  return methods;
}

module.exports = modelController();
