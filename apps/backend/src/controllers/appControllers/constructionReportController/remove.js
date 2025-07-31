const mongoose = require('mongoose');
const TaskModel = mongoose.model('Task');

const remove = async (Model, req, res) => {
  let updates = {
    removed: true,
  };

  const currentItem = await Model.findById(req.params.id).exec();

  if (!currentItem) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  const task = await TaskModel.findById(currentItem.task._id).exec();

  if (!task) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Task not found ',
    });
  }

  task.reports = task.reports.filter(
    (report) => report._id.toString() !== currentItem._id.toString()
  );

  await task.save();

  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: updates },
    {
      new: true,
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the document ',
    });
  }
};

module.exports = remove;
