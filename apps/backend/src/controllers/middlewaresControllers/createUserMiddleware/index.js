const hasPermission = require('./hasPermission');

const createUserMiddleware = (entityModel, action) => {
  let userMethods = {};

  userMethods.hasPermission = (req, res, next) =>
    hasPermission(req, res, next, {
      entityModel,
      action,
    });

  return userMethods;
};

module.exports = createUserMiddleware;
