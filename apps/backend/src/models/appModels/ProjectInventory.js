const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', autopopulate: true, required: true },
  items: [
    {
      quantityUsed: { type: Number, default: 0 },
      quantityAvailable: { type: Number, default: 0 },
      quantity: { type: Number, required: true },
      resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',
        autopopulate: true,
        required: true,
      },
    },
  ],
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProjectInventory', schema);
