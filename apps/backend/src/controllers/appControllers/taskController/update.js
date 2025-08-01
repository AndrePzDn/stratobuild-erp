const mongoose = require('mongoose');
const ProjectInventoryModel = mongoose.model('ProjectInventory');
const ResourceModel = mongoose.model('Resource');

const update = async (Model, req, res) => {
  req.body.removed = false;

  const task = await Model.findById(req.params.id).exec();
  const oldAssigned = task.assignedResources || [];
  const newAssigned = req.body.assignedResources || [];

  const resourceChanges = newAssigned
    .map((newResource) => {
      const oldResource = oldAssigned.find(
        (res) => res.resource._id.toString() === newResource.resource.toString()
      );

      const diff = oldResource ? newResource.quantity - oldResource.quantity : newResource.quantity;
      if (diff === 0) return null;

      return {
        key: newResource.resource,
        name: newResource.resource.name,
        oldValue: oldResource ? oldResource.quantity : 0,
        newValue: newResource.quantity,
        diff,
      };
    })
    .filter(Boolean);

  const removedResources = oldAssigned
    .filter(
      (oldResource) =>
        !newAssigned.some(
          (newResource) => newResource.resource.toString() === oldResource.resource._id.toString()
        )
    )
    .map((oldResource) => ({
      key: oldResource.resource._id,
      name: oldResource.resource.name,
      oldValue: oldResource.quantity,
      newValue: 0,
      diff: -oldResource.quantity,
    }));
  resourceChanges.push(...removedResources);

  const projectInventory = await ProjectInventoryModel.findOne({
    project: task.project._id,
  }).exec();

  if (!projectInventory) {
    return res.status(404).json({
      success: false,
      message: 'Project inventory not found',
    });
  }

  resourceChanges.forEach((change) => {
    const { key, diff } = change;
    const inventoryItem = projectInventory.items.find(
      (item) => item.resource._id.toString() === key.toString()
    );

    if (inventoryItem) {
      inventoryItem.resource = key;
      inventoryItem.quantity = inventoryItem.quantityAvailable + inventoryItem.quantityUsed;
      inventoryItem.quantityAvailable -= diff;
      inventoryItem.quantityUsed += diff;
    } else {
      projectInventory.items.push({
        resource: key,
        quantity: diff,
        quantityAvailable: diff,
        quantityUsed: 0,
      });
    }
  });

  const invalidItem = projectInventory.items.find(
    (item) => item.quantityAvailable < 0 || item.quantityUsed < 0
  );
  if (invalidItem) {
    const resource = await ResourceModel.findById(invalidItem.resource).exec();
    return res.status(400).json({
      success: false,
      message: `El recurso ${resource.name} no tiene suficiente cantidad disponible.`,
    });
  }

  await projectInventory.save();

  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
    },
    {
      ...req.body,
      updated: new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Document updated successfully',
    });
  }
};

module.exports = update;
