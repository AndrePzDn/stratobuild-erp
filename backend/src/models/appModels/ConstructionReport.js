const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ConstructionReport', schema);
