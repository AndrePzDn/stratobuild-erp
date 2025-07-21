const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const create = require('./create');

function modelController() {
  const Model = mongoose.model('Payment');
  const methods = createCRUDController('Payment');

  methods.create = (req, res) => create(Model, req, res);

  return methods;
}

module.exports = modelController();
