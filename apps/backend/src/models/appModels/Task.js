const mongoose = require('mongoose');

const TaskEnum = ['not_started', 'in_progress', 'completed', 'on_hold', 'delayed'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  progress: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  estimatedStartDate: { type: Date },
  estimatedEndDate: { type: Date },
  status: { type: String, enum: TaskEnum, default: 'not_started' },

  reports: [{ type: mongoose.Schema.ObjectId, ref: 'ConstructionReport', autopopulate: true }],
  parentTask: { type: mongoose.Schema.ObjectId, ref: 'Task', autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Task', schema);
