import { Link } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DropboxOutlined,
  DollarOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

function useMenuItems() {
  const translate = useLanguage();
  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'project-management',
      icon: <ContainerOutlined />,
      label: translate('project_management'),
      children: [
        {
          key: 'project',
          label: translate('projects'),
        },
        {
          key: 'planning',
          label: translate('planning'),
        },
        {
          key: 'budget',
          label: translate('budget'),
        },
        {
          key: 'report',
          label: translate('reports'),
        },
        {
          key: 'certification',
          label: translate('certifications'),
        },
        {
          key: 'serviceCategory',
          label: translate('service_category'),
        },
        {
          key: 'projectCategory',
          label: translate('project_category'),
        },
      ],
    },
    {
      key: 'client-services',
      icon: <CustomerServiceOutlined />,
      label: translate('Client Services'),
      children: [
        {
          key: 'customer',
          label: <Link to={'/customer'}>{translate('customers')}</Link>,
        },
        {
          key: 'quote',
          label: <Link to={'/quote'}>{translate('quote')}</Link>,
        },
      ],
    },
    {
      key: 'billing',
      icon: <DollarOutlined />,
      label: translate('billings'),
      children: [
        {
          key: 'invoice',
          label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
        },
        {
          key: 'taxes',
          label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
        },
      ],
    },
    {
      key: 'resource-management',
      icon: <DropboxOutlined />,
      label: translate('resource_management'),

      children: [
        {
          key: 'resources',
          label: translate('resources'),
        },
        {
          key: 'UOM',
          label: translate('unit_of_measurement'),
        },
        {
          key: 'supplier',
          label: translate('suppliers'),
        },
      ],
    },
    {
      key: 'admin-user',
      icon: <TeamOutlined />,
      label: translate('admin_users'),
    },
    {
      key: 'settings',
      label: <Link to={'/settings'}>{translate('settings')}</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: 'about',
      label: <Link to={'/about'}>{translate('about')}</Link>,
      icon: <QuestionCircleOutlined />,
    },
  ];

  return items;
}

export default useMenuItems;
