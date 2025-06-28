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

  if (
    (existingCurrency.quoteDate && existingCurrency.quoteDate >= new Date(req.body.quoteDate)) ||
    existingCurrency.quoteDate > new Date()
  ) {
    return res.status(400).json({
      success: false,
      message: 'A currency with this symbol already exists with a more recent quote date.',
    });
  }

  const result = await new model(req.body).save();
  return res.status(200).json({
    success: true,
    result: result,
    message: 'Resource created successfully',
  });
};

module.exports = create;
