const mongoose = require('mongoose');
const TaskModel = mongoose.model('Task');

const create = async (Model, req, res) => {
  const { task } = req.body;

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  const relatedTask = await TaskModel.findById(task).exec();

  if (!relatedTask) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  relatedTask.reports.push(result._id);
  relatedTask.save().catch(() => {
    return res.status(500).json({
      success: false,
      message: 'Error saving related task',
    });
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model',
  });
};

module.exports = create;
