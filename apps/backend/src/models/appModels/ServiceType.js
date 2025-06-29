const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: false, trim: true, lowercase: true },
});

module.exports = mongoose.model('ServiceType', schema);
