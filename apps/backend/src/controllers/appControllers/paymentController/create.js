const mongoose = require('mongoose');

const ProjectInventoryModel = mongoose.model('ProjectInventory');
const CashFlowModel = mongoose.model('CashFlow');
const ResourceModel = mongoose.model('Resource');
const PriceBankModel = mongoose.model('PriceBank');

const create = async (Model, req, res) => {
  req.body.removed = false;

  if (req.body.paymentType === 'resource') {
    const cashFlow = await CashFlowModel.findById(req.body.cashFlow);

    if (!cashFlow) {
      return res.status(404).json({
        success: false,
        message: 'CashFlow not found',
      });
    }

    const projectInventory = await ProjectInventoryModel.findOne({ project: cashFlow.project });

    if (!projectInventory) {
      return res.status(404).json({
        success: false,
        message: 'ProjectInventory not found for the given CashFlow project',
      });
    }

    const resource = await ResourceModel.findById(req.body.resource);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    const priceBank = await PriceBankModel.findById(req.body.priceBank);

    if (!priceBank) {
      return res.status(404).json({
        success: false,
        message: 'PriceBank not found',
      });
    }

    if (
      projectInventory.items.some(
        (item) => item.resource._id.toString() === resource._id.toString()
      )
    ) {
      const item = projectInventory.items.find(
        (item) => item.resource._id.toString() === resource._id.toString()
      );
      item.quantity += req.body.quantity;
      item.quantityAvailable += req.body.quantity;
    } else {
      projectInventory.items.push({
        resource: resource._id,
        quantity: req.body.quantity,
        quantityAvailable: req.body.quantity,
        priceBank: priceBank._id,
      });
    }
    projectInventory.updated = Date.now();
    await projectInventory.save();

    req.body = {
      description: req.body.description,
      amount: priceBank.unitPrice * req.body.quantity,
      date: req.body.date,
      paymentType: 'expense',
      cashFlow: req.body.cashFlow,
    };
  }

  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model',
  });
};

module.exports = create;
