import {
  LayoutDashboard,
  Folder,
  Users,
  Settings,
  Package,
  DollarSign,
  UserCog,
} from "lucide-react";

export const sidebarItems = [
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
      { label: "Proyectos", redirect: "/project/list/1" },
      { label: "Presupuesto", redirect: "/budget" },
      // { label: "Certificaciones", redirect: "/certification" },
      // { label: "Servicios", redirect: "/service/project" },
      // { label: "Categorías", redirect: "/category/project" },
    ],
  },
  {
    label: "Clientes",
    icon: <Users />,
    children: [
      { label: "Clientes", redirect: "/customer" },
      { label: "Cotizaciones", redirect: "/quote" },
    ],
  },
  {
    label: "Facturación",
    icon: <DollarSign />,
    children: [
      { label: "Facturas", redirect: "/invoice" },
      { label: "Impuestos", redirect: "/taxes" },
      { label: "Monedas", redirect: "/currencies" },
    ],
  },
  {
    label: "Recursos",
    icon: <Package />,
    children: [
      { label: "Banco de precios", redirect: "/bank-price" },
      { label: "Recursos", redirect: "/resources" },
      { label: "UOM", redirect: "/UOM" },
      { label: "Proveedores", redirect: "/providers" },
    ],
  },
  {
    label: "Usuarios",
    icon: <UserCog />,
    redirect: "/admin-users",
    children: [],
  },
  {
    label: "Configuración",
    icon: <Settings />,
    redirect: "/settings",
    children: [],
  },
];
