const { calculate } = require('@/helpers');

const create = async (model, req, res) => {
  const { items = [], taxRate = 0 } = req.body;

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
  let body = req.body;

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;

  const result = await new model(body).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Resource created successfully',
  });
};

module.exports = create;
