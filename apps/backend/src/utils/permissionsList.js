const permissions = {
  Admin: {
    budget: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
      'convert',
    ],
    cashflow: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    certification: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    client: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    constructionreport: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    currency: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    invoice: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
      'mail',
    ],
    payment: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
      'mail',
    ],
    pricebank: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    project: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    provider: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    projectinventory: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    projectplan: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    projecttype: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    quote: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
      'mail',
      'convert',
    ],
    resource: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    servicetype: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
    task: ['create', 'read', 'update', 'delete', 'search', 'list', 'listAll', 'filter', 'summary'],
    taxes: ['create', 'read', 'update', 'delete', 'search', 'list', 'listAll', 'filter', 'summary'],
    unitofmeasurement: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'listAll',
      'filter',
      'summary',
    ],
  },
  ProjectManager: {
    budget: [
      'create',
      'read',
      'update',
      'delete',
      'search',
      'list',
      'filter',
      'summary',
      'convert',
    ],
    cashflow: ['read', 'search', 'list', 'filter', 'summary'],
    certification: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    client: ['read', 'search', 'list', 'filter'],
    constructionreport: ['read', 'search', 'list', 'filter', 'summary'],
    currency: ['read', 'search', 'list'],
    pricebank: ['read', 'search', 'list', 'filter'],
    project: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    projectinventory: ['read', 'search', 'list', 'filter'],
    projectplan: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    projecttype: ['read', 'search', 'list'],
    quote: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary', 'convert'],
    resource: ['read', 'search', 'list'],
    servicetype: ['read', 'search', 'list'],
    task: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    taxes: ['read', 'search', 'list'],
  },

  SiteSupervisor: {
    budget: ['read', 'search', 'list', 'summary'],
    certification: ['read', 'search', 'list'],
    client: ['read', 'search', 'list'],
    constructionreport: ['read', 'search', 'list', 'summary'],
    pricebank: ['read', 'search', 'list'],
    project: ['read', 'search', 'list'],
    projectplan: ['read', 'search', 'list'],
    quote: ['read', 'search', 'list'],
    resource: ['read', 'search', 'list'],
    servicetype: ['read', 'search', 'list'],
    task: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    projectinventory: ['read', 'search', 'list'],
  },

  Accountant: {
    budget: ['read', 'search', 'list', 'summary'],
    cashflow: ['read', 'search', 'list', 'filter', 'summary'],
    certification: ['read', 'search', 'list', 'summary'],
    client: ['read', 'search', 'list'],
    currency: ['read', 'search', 'list'],
    project: ['read', 'search', 'list'],
    quote: ['read', 'search', 'list', 'filter', 'summary'],
    taxes: ['read', 'search', 'list', 'summary'],
    invoice: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary', 'mail'],
    payment: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary', 'mail'],
  },

  InventoryManager: {
    projectinventory: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    resource: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    servicetype: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    Supplier: ['create', 'read', 'update', 'delete', 'search', 'list', 'filter', 'summary'],
    pricebank: ['read', 'search', 'list'],
    project: ['read', 'search', 'list'],
    task: ['read', 'search', 'list'],
  },

  GeneralDirector: {
    budget: ['read', 'search', 'list', 'summary'],
    cashflow: ['read', 'search', 'list', 'summary'],
    certification: ['read', 'search', 'list', 'summary'],
    client: ['read', 'search', 'list'],
    constructionreport: ['read', 'search', 'list', 'summary'],
    currency: ['read', 'search', 'list'],
    pricebank: ['read', 'search', 'list'],
    project: ['read', 'search', 'list', 'summary'],
    projectinventory: ['read', 'search', 'list'],
    projectplan: ['read', 'search', 'list', 'summary'],
    projecttype: ['read', 'search', 'list'],
    quote: ['read', 'search', 'list', 'summary'],
    resource: ['read', 'search', 'list'],
    servicetype: ['read', 'search', 'list'],
    task: ['read', 'search', 'list'],
    taxes: ['read', 'search', 'list'],
  },
};

module.exports = permissions;
