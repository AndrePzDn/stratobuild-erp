const create = async (model, req, res) => {
  const { symbol } = req.body;
  const existingCurrency = await model.findOne({ symbol, enabled: true });

  if (
    existingCurrency &&
    existingCurrency.quoteDate &&
    existingCurrency.quoteDate < new Date(req.body.quoteDate)
  ) {
    existingCurrency.enabled = false;
    await existingCurrency.save();
  }

  if (existingCurrency) {
    if (
      (existingCurrency.quoteDate && existingCurrency.quoteDate >= new Date(req.body.quoteDate)) ||
      existingCurrency.quoteDate > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'La divisa ya existe con una fecha de cotización más reciente o igual.',
      });
    }
  }

  const result = await new model(req.body).save();
  return res.status(200).json({
    success: true,
    result: result,
    message: 'Resource created successfully',
  });
};

module.exports = create;
