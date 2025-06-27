const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  unitPrice: { type: Number, required: true },
  quoteDate: { type: Date, default: Date.now },

  resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', autopopulate: true, required: true },
  currency: { type: mongoose.Schema.ObjectId, ref: 'Currency', autopopulate: true, required: true },
  provider: { type: mongoose.Schema.ObjectId, ref: 'Provider', autopopulate: true, required: true },
  unitOfMeasurement: {
    type: mongoose.Schema.ObjectId,
    ref: 'UnitOfMeasurement',
    autopopulate: true,
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PriceBank', schema);
