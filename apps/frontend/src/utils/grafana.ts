const grafanaBase = 'http://localhost:5000';
const dashboardUid = 'bei9p1fgxsyrkb';
const dashboardPath = 'proyectsbystatedistribution';

const filters = {
  Project: [
    'Condominio Illimani',
    'Mejoramiento Vial Ruta 7',
    'Pavimentación Av. Libertador',
    'Residencial Valle Verde',
    'Urbanización Los Álamos',
  ],
  ProjectStatus: ['Completado', 'active'],
  ProjectType: ['Carretera', 'Casa', 'Category A', 'Terreno'],
  MaterialCategory: ['Cement', 'Plumbing', 'Steel', 'Wood'],
  ResourceType: ['Equipment', 'Human'],
  ResourceRole: ['Engineer', 'Supervisor', 'Worker'],
};

export const panels = [
  { id: 5, width: 320, height: 400 },
  { id: 3, width: 680, height: 400 },
  { id: 1, width: 320, height: 400 },
  { id: 4, width: 1400, height: 300 },
  { id: 6, width: 1400, height: 300 },
];

export const buildGrafanaUrl = (panelId) => {
  const params = new URLSearchParams({
    orgId: 1,
    from: 1675310400000,
    to: 1735790399000,
    timezone: 'browser',
    theme: 'light',
    panelId: panelId,
    __feature: 'dashboardSceneSolo',
  });

  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((val) => params.append(`var-${key}`, val));
  });

  return `${grafanaBase}/d-solo/${dashboardUid}/${dashboardPath}?${params.toString()}`;
};


