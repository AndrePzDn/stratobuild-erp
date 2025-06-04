const { calculate } = require('@/helpers');

const mongoose = require('mongoose');

const PriceBankModel = mongoose.model('PriceBank');

const update = async (model, req, res) => {
  const { id } = req.params;

  const budget = await model.findOne({ _id: id, removed: false }).exec();

  if (!budget) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Budget not found',
    });
  }

  if (budget.converted) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Budget is already converted to a project.',
    });
  }

  const { name, note, client, status, date, items = [] } = req.body;

  if (!items.length) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  let subTotal = 0;

  const sanitizedItems = await Promise.all(
    items.map(async (item) => {
      if (!item.priceBank || !item.quantity || item.quantity <= 0) {
        throw {
          status: 400,
          message: 'Invalid item data',
        };
      }

      const priceBank = await PriceBankModel.findById(item.priceBank);

      if (!priceBank) {
        throw {
          status: 404,
          message: 'Price bank not found',
        };
      }

      const itemTotal = calculate.multiply(item.quantity, priceBank.unitPrice);
      subTotal += itemTotal;

      return {
        priceBank: priceBank,
        quantity: item.quantity,
        total: itemTotal,
      };
    })
  );

  const taxRate = req.body.taxRate ?? budget.taxRate ?? 0;

  if (!isNaN(taxRate) && taxRate >= 0 && taxRate <= 100) {
    budget.taxRate = taxRate;
  } else {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid tax rate',
    });
  }

  const taxTotal = calculate.multiply(subTotal, budget.taxRate / 100);
  const total = calculate.add(subTotal, taxTotal);

  const updateBody = {
    ...req.body,
    name: name || budget.name,
    note: note || budget.note,
    client: client || budget.client,
    status: status || budget.status,
    date: date ? new Date(date) : budget.date,
    items: sanitizedItems,
    subTotal,
    taxTotal,
    total,
  };

  const result = await model.findOneAndUpdate({ _id: id, removed: false }, updateBody, {
    new: true,
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'Budget updated successfully',
  });
};

module.exports = update;
