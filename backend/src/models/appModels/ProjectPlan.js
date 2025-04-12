const mongoose = require('mongoose');

const projectStatusEnum = [
  'active',
  'inactive',
  'completed',
  'in_progress',
  'on hold',
  'not started',
];

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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: projectStatusEnum,
    default: 'active',
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
    autopopulate: true,
  },
  tasks: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Task',
    autopopulate: true,
  },
  report: {
    type: [mongoose.Schema.ObjectId],
    ref: 'ConstructionReport',
    autopopulate: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProjectPlan', schema);
