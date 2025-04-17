const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
