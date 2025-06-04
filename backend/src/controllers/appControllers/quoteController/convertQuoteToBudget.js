const mongoose = require('mongoose');
const moment = require('moment');

const QuoteModel = mongoose.model('Quote');
const BudgetModel = mongoose.model('Budget');

const convertQuoteToBudget = async (Model, req, res) => {
  const quote = await QuoteModel.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!quote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Quote not found',
    });
  }

  if (quote.converted) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Quote is already converted to a budget.',
    });
  }

  const budgetData = {
    name: quote.name,
    date: moment(),
    expiredDate: moment().add(1, 'month'),
    client: quote.client,
    taxRate: quote.taxRate,
    quote: quote._id,
    subTotal: quote.subTotal,
    taxTotal: quote.taxTotal,
    total: quote.total,
    note: quote.note || '',
    currency: quote.currency || null,
    created_by: quote.created_by,
    removed: false,
    status: 'draft',
    amountPaid: 0,
    approved: false,
    converted: false,
  };

  const budget = await new BudgetModel(budgetData).save();

  quote.converted = true;
  quote.status = 'converted';

  await quote.save();

  return res.status(200).json({
    success: true,
    result: budget,
    message: 'Successfully converted quote to budget',
  });
};

module.exports = convertQuoteToBudget;
