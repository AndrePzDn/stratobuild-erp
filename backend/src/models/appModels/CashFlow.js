const mongoose = require('mongoose');

const paymentType = ['income', 'expense'];

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
  payments: [
    {
      description: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: mongoose.Schema.ObjectId,
        ref: 'Currency',
        autopopulate: true,
      },
      paymentType: {
        type: String,
        enum: paymentType,
        required: true,
      },
    },
  ],
  estimatedTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    autopopulate: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('CashFlow', schema);
