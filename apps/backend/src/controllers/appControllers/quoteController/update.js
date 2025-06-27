const { calculate } = require('@/helpers');

const update = async (model, req, res) => {
  const { id } = req.params;

  const quote = await model.findOne({ _id: id, removed: false }).exec();

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

  const { items = [], taxRate = 0 } = req.body;

  if (!items.length) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  let subTotal = 0;

  const sanitizedItems = items.map((item) => {
    const price = Number(item.price) || 0;
    const itemTotal = calculate.multiply(item.quantity || 1, price);
    subTotal = calculate.add(subTotal, itemTotal);

    return {
      itemName: item.itemName,
      description: item.description,
      price: price,
    };
  });

  const taxTotal = calculate.multiply(subTotal, taxRate / 100);
  const total = calculate.add(subTotal, taxTotal);

  const updateBody = {
    ...req.body,
    items: sanitizedItems,
    subTotal,
    taxTotal,
    total,
    updated: new Date(),
  };

  if (!req.body.currency) {
    delete updateBody.currency;
  }

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
    message: 'Quote updated successfully',
  });
};

module.exports = update;
