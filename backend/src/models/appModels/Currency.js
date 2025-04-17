const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },

  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: false },
  dollarValue: { type: Number, required: true },
  quoteDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Currency', schema);
