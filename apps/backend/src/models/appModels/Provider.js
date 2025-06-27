const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
});

module.exports = mongoose.model('Provider', schema);
