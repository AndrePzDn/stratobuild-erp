const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  description: { type: String, required: true },
  symbol: { type: String, required: true },
});

module.exports = mongoose.model('UnitOfMeasurement', schema);
