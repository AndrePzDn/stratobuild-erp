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
  startDate: { type: Date },
  endDate: { type: Date },
  estimatedStartDate: { type: Date, required: true },
  estimatedEndDate: { type: Date, required: true },
  status: { type: String, enum: TaskEnum, default: 'not_started' },

  reports: [{ type: mongoose.Schema.ObjectId, ref: 'ConstructionReport', autopopulate: true }],
  assignedResources: [
    {
      resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',
        autopopulate: true,
        required: true,
      },
      quantity: { type: Number, min: 0 },
    },
  ],
  parentTask: { type: mongoose.Schema.ObjectId, ref: 'Task', autopopulate: true },
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Task', schema);
