const mongoose = require('mongoose');

const PaymentTypeEnum = ['income', 'expense'];

const schema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },

  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  paymentType: { type: String, enum: PaymentTypeEnum, required: true },

  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'Currency',
    autopopulate: true,
    required: false,
  },
  cashFlow: { type: mongoose.Schema.ObjectId, ref: 'CashFlow', autopopulate: true, required: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Payment', schema);
