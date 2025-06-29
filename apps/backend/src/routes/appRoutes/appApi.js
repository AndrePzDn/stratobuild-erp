const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const permissionChecker = require('@/controllers/middlewaresControllers/createUserMiddleware');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  const mapRoute = (path, method, action) => {
    const checker = permissionChecker(entity, action);
    router[method](`/${entity}${path}`, checker.hasPermission, catchErrors(controller[action]));
  };
  mapRoute('/create', 'post', 'create');
  mapRoute('/read/:id', 'get', 'read');
  mapRoute('/update/:id', 'patch', 'update');
  mapRoute('/delete/:id', 'delete', 'delete');
  mapRoute('/search', 'get', 'search');
  mapRoute('/list', 'get', 'list');
  mapRoute('/listAll', 'get', 'listAll');
  mapRoute('/filter', 'get', 'filter');
  mapRoute('/summary', 'get', 'summary');

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    mapRoute('mail', 'post', 'mail');
  }

  if (entity === 'quote' || entity === 'budget') {
    mapRoute('/convert/:id', 'post', 'convert');
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
