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
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'Currency',
    autopopulate: true,
  },
  total: {
    type: Number,
    required: true,
  },
  paid: {
    type: Number,
    default: 0,
  },
  resourceList: [
    {
      material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',
        autopopulate: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      total: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Budget', schema);
