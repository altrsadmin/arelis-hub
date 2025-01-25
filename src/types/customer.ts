export type PersonType = 'individual' | 'company';

export interface CustomerAddress {
  street: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  personType: PersonType;
  document: string;
  legalName?: string;
  tradeName?: string;
  socialName?: string;
  address?: CustomerAddress;
  hasCompleteRegistration: boolean;
  created_at: string;
  updated_at: string;
}