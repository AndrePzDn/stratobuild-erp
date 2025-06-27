const mongoose = require('mongoose');

const ProjectEnum = ['active', 'inactive', 'completed', 'in_progress', 'on_hold'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ProjectEnum, required: true, default: 'active' },
  startDate: { type: Date, default: Date.now },
  estimatedPrice: { type: Number, default: 0 },
  endDate: { type: Date },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true, required: true },
  budget: { type: mongoose.Schema.ObjectId, ref: 'Budget', autopopulate: true, required: true },
  serviceType: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceType',
    autopopulate: true,
    required: true,
  },
  projectType: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProjectType',
    autopopulate: true,
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Project', schema);
