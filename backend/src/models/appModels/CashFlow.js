const mongoose = require('mongoose');

const TaskEnum = ['not_started', 'in_progress', 'completed', 'on_hold', 'delayed'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  estimatedTotal: { type: Number, required: true },
  availableBudget: { type: Number, required: true },
  total: { type: Number, required: true },

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('CashFlow', schema);
