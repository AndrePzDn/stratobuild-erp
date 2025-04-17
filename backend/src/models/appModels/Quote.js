const mongoose = require('mongoose');

const QuoteStatusEnum = ['pending', 'approved', 'rejected', 'expired', 'converted'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  expirated: { type: Boolean, default: false },
  converted: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },

  name: { type: String, required: true },
  date: { type: Date, required: true },
  expiredDate: { type: Date, required: true },
  status: { type: String, enum: QuoteStatusEnum, default: 'pending' },
  note: { type: String },
  taxRate: { type: Number },
  subTotal: { type: Number },
  taxTotal: { type: Number },
  total: { type: Number },

  items: [
    {
      itemName: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],

  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'Currency',
    autopopulate: true,
    required: false,
  },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Quote', schema);
