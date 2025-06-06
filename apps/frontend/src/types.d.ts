export interface UnitOfMeasurement {
  _id: string;
  name: string;
  description: string;
  symbol: string;
}

export interface Resource {
  _id: string;
  name: string;
  description: string;
  resourceType: string;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface Currency {
  _id: string;
  name: string;
  symbol: string;
  dollarValue: number;
  quoteDate: Date;
}

export interface Provider {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Client {
  _id: string;
  name: string;
  phone: string;
  country: string;
  address: string;
  email: string;
  createdBy?: string;
}

export interface Taxes {
  _id: string;
  taxName: string;
  taxValue: number;
}

export interface PriceBank {
  _id: string;
  unitPrice: number;
  quoteDate: Date;
  resource: Resource;
  currency: Currency;
  provider: Provider;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface ProjectType {
  _id: string;
  name: string;
  description: string;
  color: string;
}

export interface ServiceType {
  _id: string;
  name: string;
  description: string;
  color: string;
}

export interface Budget {
  _id: string;
  name: string;
  note: string;
  createdBy: Client;
}

const ProjectEnum = 'active' | 'inactive' | 'completed' | 'in_progress' | 'on_hold'

export interface Project {
  _id: string;
  name: string;
  location?: string;
  status: ProjectEnum;
  startDate: Date;
  endDate?: Date;
  projectType: ProjectType;
  serviceType: ServiceType;
  client: Client;
  budget: Budget;
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  category: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'delayed';
  startDate: Date;
  endDate: Date;
  project: Project;
}

export interface Payment {
  _id: string;
  description: string;
  amount: number;
  paymentType: string;
  date: Date;
  currency: Currency;
  cashFlow: CashFlow;
}

export interface CashFlow {
  _id: string;
  estimatedTotal: number;
  availableBudget: number;
  total: number;
  project: Project
}
