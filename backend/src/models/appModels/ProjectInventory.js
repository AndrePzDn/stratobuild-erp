const mongoose = require('mongoose');

const ProjectEnum = ['active', 'inactive', 'completed', 'in_progress', 'on_hold'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  quantity: { type: Number, required: true },

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
  resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProjectInventory', schema);
