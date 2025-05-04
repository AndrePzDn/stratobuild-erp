const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

const create = require('./create');
const update = require('./update');
const convert = require('./convertQuoteToBudget');

function modelController() {
  const Model = mongoose.model('Quote');
  const methods = createCRUDController('Quote');

  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.convert = (req, res) => convert(Model, req, res);
  return methods;
}

module.exports = modelController();
