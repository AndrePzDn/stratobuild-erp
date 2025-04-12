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
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['material', 'labor', 'machinery'],
    required: true,
  },
  unitOfMeasurement: {
    type: mongoose.Schema.ObjectId,
    ref: 'UnitOfMeasurement',
    autopopulate: true,
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Resource', schema);
