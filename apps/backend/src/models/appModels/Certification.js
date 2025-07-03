const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  description: { type: String, required: true },
  certificationType: { type: String, required: true },
  certificationUrl: { type: String, required: true },

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Certification', schema);
