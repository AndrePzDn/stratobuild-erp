const mongoose = require('mongoose');

const taskStatusEnum = [
  'not_started',
  'in_progress',
  'completed',
  'on_hold',
  'cancelled',
  'delayed',
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
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: taskStatusEnum,
    default: 'not_started',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  parentTask: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    autopopulate: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Task', schema);
