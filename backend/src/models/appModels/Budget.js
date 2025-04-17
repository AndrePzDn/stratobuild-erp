const mongoose = require('mongoose');

const BudgetStatusEnum = ['draft', 'pending', 'approved', 'rejected', 'in_progress', 'done'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  converted: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },

  name: { type: String, required: true },
  note: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: BudgetStatusEnum, default: 'draft' },
  amountPaid: { type: Number, default: 0 },

  taxRate: { type: Number },
  subTotal: { type: Number },
  taxTotal: { type: Number },
  total: { type: Number },

  items: [
    {
      priceBank: {
        type: mongoose.Schema.ObjectId,
        ref: 'PriceBank',
        autopopulate: true,
      },
      quantity: { type: Number },
      total: { type: Number },
    },
  ],

  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'Currency',
    autopopulate: true,
    required: false,
  },
  created_by: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  quote: { type: mongoose.Schema.ObjectId, ref: 'Quote', autopopulate: true, required: true },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true, required: true },
  serviceType: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceType',
    autopopulate: true,
  },
  projectType: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProjectType',
    autopopulate: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Budget', schema);
