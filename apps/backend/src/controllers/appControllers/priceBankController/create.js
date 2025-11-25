const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const Provider = mongoose.model('Provider')

const create = async (Model, req, res) => {
  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  const resource = await Resource.findById(result.resource);
  const provider = await Provider.findById(result.provider);

  await Model.updateMany(
    {
      resource: resource._id,
      provider: provider._id,
    },
    {
      $set: { disabled: true },
    }
  );

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
