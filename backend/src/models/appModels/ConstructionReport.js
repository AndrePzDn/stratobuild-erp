const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },

  task: { type: mongoose.Schema.ObjectId, ref: 'Task', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ConstructionReport', schema);
