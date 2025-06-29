export interface Entity {
  _id: string;
}

export interface UnitOfMeasurement extends Entity {
  name: string;
  description: string;
  symbol: string;
}

export interface Resource extends Entity {
  name: string;
  description: string;
  resourceType: string;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface Currency extends Entity {
  name: string;
  symbol: string;
  dollarValue: number;
  quoteDate: Date;
}

export interface Provider extends Entity {
  name: string;
  phone: string;
  email: string;
}

export interface Client extends Entity {
  name: string;
  phone: string;
  country: string;
  address: string;
  email: string;
  createdBy?: string;
}

export interface Taxes extends Entity {
  taxName: string;
  taxValue: number;
}

export interface PriceBank extends Entity {
  unitPrice: number;
  quoteDate: Date;
  resource: Resource;
  currency: Currency;
  provider: Provider;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface ProjectType extends Entity {
  name: string;
  description: string;
  color: string;
}

export interface ServiceType extends Entity {
  name: string;
  description: string;
  color: string;
}

export interface Budget extends Entity {
  name: string;
  note: string;
  createdBy: Client;
}

const ProjectEnum = 'active' | 'inactive' | 'completed' | 'in_progress' | 'on_hold'

export interface Project extends Entity {
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

export interface Task extends Entity {
  name: string;
  description?: string;
  category: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'delayed';
  startDate: Date;
  endDate: Date;
  project: Project;
}

export interface Payment extends Entity {
  description: string;
  amount: number;
  paymentType: string;
  date: Date;
  currency: Currency;
  cashFlow: CashFlow;
}

export interface CashFlow extends Entity {
  estimatedTotal: number;
  availableBudget: number;
  total: number;
  project: Project
}
