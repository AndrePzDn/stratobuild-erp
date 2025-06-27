const { calculate } = require('@/helpers');

const create = async (model, req, res) => {
  const { items = [], taxRate = 0 } = req.body;

  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    subTotal = calculate.add(subTotal, total);
    item['total'] = total;
  });

  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

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
