const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProjectPlan', schema);
