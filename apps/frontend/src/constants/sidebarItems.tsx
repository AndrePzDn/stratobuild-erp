import {
  LayoutDashboard,
  Folder,
  Users,
  Settings,
  Package,
  DollarSign,
  UserCog,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  redirect?: string;
  icon?: JSX.Element;
  children?: SidebarItem[];
  entity?: string;
};

export const sidebarItems: SidebarItem[] = [
  {
    label: "Panel",
    redirect: "/home",
    icon: <LayoutDashboard />,
    children: [],
  },
  {
    label: "Gestión de Proyectos",
    icon: <Folder />,
    children: [
      { label: "Proyectos", redirect: "/project/list/1", entity: "project" },
      { label: "Presupuesto", redirect: "/budget", entity: "budget" },
      // { label: "Certificaciones", redirect: "/certification", entity: "certification" },
      { label: "Servicios", redirect: "/service/project", entity: "servicetype" },
      { label: "Categorías", redirect: "/category/project", entity: "projecttype" },
    ],
  },
  {
    label: "Clientes",
    icon: <Users />,
    children: [
      { label: "Clientes", redirect: "/customer", entity: "client" },
      { label: "Cotizaciones", redirect: "/quote", entity: "quote" },
    ],
  },
  // {
  //   label: "Facturación",
  //   icon: <DollarSign />,
  //   children: [
  //     { label: "Facturas", redirect: "/invoice" },
  //     { label: "Impuestos", redirect: "/taxes" },
  //     { label: "Monedas", redirect: "/currencies" },
  //   ],
  // },
  {
    label: "Recursos",
    icon: <Package />,
    children: [
      { label: "Banco de precios", redirect: "/bank-price", entity: "pricebank" },
      { label: "Recursos", redirect: "/resources", entity: "resource" },
      { label: "UOM", redirect: "/UOM", entity: "unitofmeasurement" },
      { label: "Proveedores", redirect: "/providers", entity: "provider" },
    ],
  },
  {
    label: "Usuarios",
    icon: <UserCog />,
    redirect: "/admin-users",
    entity: "admin",
    children: [],
  },
  // {
  //   label: "Configuración",
  //   icon: <Settings />,
  //   redirect: "/settings",
  //   children: [],
  // },
];
