const mongoose = require('mongoose');

const projectStatusEnum = ['active', 'inactive', 'completed', 'in_progress', 'on_hold'];

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
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: projectStatusEnum,
    default: 'active',
  },
  certifications: {
    type: [mongoose.Schema.ObjectId],
    default: [],
  },
  projectCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProjectCategory',
    required: true,
    autopopulate: true,
  },
  serviceCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceCategory',
    required: true,
    autopopulate: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  budget: {
    type: mongoose.Schema.ObjectId,
    ref: 'Budget',
    required: true,
    autopopulate: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Project', schema);
