const mongoose = require('mongoose');
const moment = require('moment');

const ProjectModel = mongoose.model('Project');
const TaskModel = mongoose.model('Task');
const CashFlowModel = mongoose.model('CashFlow');

const convertBudgetToProject = async (Model, req, res) => {
  const { createdBy } = req.body;

  const budget = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!budget) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Budget not found',
    });
  }

  if (budget.converted) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Budget is already converted to a budget',
    });
  }

  const projectData = {
    name: budget.name,
    createdBy: budget.createdBy,
    client: budget.client,
    serviceType: budget.serviceType,
    projectType: budget.projectType,
    endDate: moment().add(1, 'year').toDate(),
    budget: budget,
    createdBy,
  };

  const project = await new ProjectModel(projectData).save();

  budget.converted = true;
  budget.status = 'in_progress';

  await budget.save();

  const taskData = {
    name: 'Nueva Tarea',
    category: 'Sin Categoria',
    progress: 0,
    startDate: new Date(),
    endDate: moment().add(1, 'month').toDate(),
    status: 'not_started',
    project: project._id,
  };

  await new TaskModel(taskData).save();

  const cashFlowData = {
    estimatedTotal: budget.total,
    availableBudget: 0,
    total: 0,
    project: project._id,
  };

  await new CashFlowModel(cashFlowData).save();

  return res.status(200).json({
    success: true,
    result: project,
    message: 'Successfully converted budget to project',
  });
};

module.exports = convertBudgetToProject;
