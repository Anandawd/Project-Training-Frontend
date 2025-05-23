// src/mock/interfaces.ts
// Definisi interface untuk mock data sesuai dengan ERD

// Core Entities
export interface IPlacement {
  id: number;
  code: string;
  name: string;
  country: string;
  city: string;
  status: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IDepartment {
  id: number;
  code: string;
  name: string;
  description: string;
  status: boolean;
  placement_code: string;
  employee_manager_id: string | null;
  employee_supervisor_id: string | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IPosition {
  id: number;
  code: string;
  name: string;
  description: string;
  level: number; // 1|2|3|4|5
  status: boolean;
  placement_code: string;
  department_code: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

// Employee Management
export interface IEmployee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string; // M|F
  birth_date: string;
  address: string;
  phone: string;
  email: string;
  hire_date: string;
  end_date: string | null;
  status: string; // A = Active, I = Inactive
  position_code: string;
  position_name: string;
  department_code: string;
  department_name: string;
  placement_code: string;
  placement_name: string;
  supervisor_id: string | null;
  supervisor_name: string | null;
  employee_type: string;
  payment_frequency: string;
  payment_frequency_code: string;
  daily_rate: number;
  base_salary: number;
  tax_number: string;
  identity_number: string;
  marital_status: string;
  health_insurance_number: string;
  social_security_number: string;
  bank_name: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
  payment_method: string;
  payment_method_code: string;
  profile_photo: string;
  leave_quota: number;
  leave_remaining: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IEmployeeDocument {
  id: number;
  employee_id: string;
  document_type: string;
  document_type_name: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  issue_date: string;
  expiry_date: string | null;
  remark: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IEmployeeSalary {
  id: number;
  employee_id: string;
  base_salary: number;
  adjustment_reason: string;
  effective_date: string;
  end_date: string | null;
  is_current: boolean;
  remark: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

// Payroll Components
export interface IComponentCategory {
  id: number;
  placement_code: string;
  code: string;
  name: string;
  description: string;
  type: string; // Earnings|Deductions
  status: boolean;
  entity_type: string; // category
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IPayrollComponent {
  id: number;
  placement_code: string;
  category_code: string;
  name: string;
  code: string;
  description: string;
  default_amount: number;
  default_quantity: number;
  unit: string;
  type: string; // Earnings|Deductions
  is_taxable: boolean;
  is_fixed: boolean;
  is_prorated: boolean;
  is_included_in_bpjs_health: boolean;
  is_included_in_bpjs_employee: boolean;
  is_show_in_payslip: boolean;
  active: boolean;
  calculation_method: string;
  formula: string;
  entity_type: string; // earnings|deductions
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface IEmployeePayrollComponent {
  id: number;
  employee_id: string;
  payroll_component_id: number;
  payroll_component: string;
  payroll_component_name: string;
  component_type: string;
  amount: number;
  qty: number;
  quantity: number;
  effective_date: string;
  end_date: string | null;
  is_current: boolean;
  is_override: boolean;
  default_amount: number;
  unit: string;
  category: string;
  is_taxable: boolean;
  is_fixed: boolean;
  remark: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

// Payroll Period
export interface IPayrollPeriod {
  id: number;
  placement_id: number;
  period_name: string;
  period_type: string; // Daily|Weekly|Bi-weekly|Monthly
  start_date: string;
  end_date: string;
  payment_date: string;
  status: string; // Draft|Pending|Approve|Ready to Payment|Processing|Completed|Rejected
  created_by: string;
  remark: string;
  default_tax_income_type: string; // PPh21|PPh26
  default_tax_method: string; // Gross|GrossUp|Netto
  created_at: string;
  updated_at: string;
}

export interface IPayroll {
  id: number;
  employee_id: string;
  period_id: number;
  basic_salary: number;
  gross_salary: number;
  total_deductions: number;
  statutory_contributions: number;
  tax_amount: number;
  net_salary: number;
  total_workdays: number;
  actual_workdays: number;
  prorata_factor: number;
  status: string; // Draft|Pending|Approve|Ready to Payment|Completed|Rejected
  remark: string;
  payment_reference: string;
  payment_date: string;
  tax_income_type: string; // PPh21|PPh26
  tax_method: string; // Gross|GrossUp|Net
  payment_method: string; // Cash|Bank Transfer|E-Wallet Transfer|Virtual Account
  created_at: string;
  updated_at: string;
}

// Options Interfaces
export interface IOption {
  code: string;
  name: string;
  SubGroupName?: string;
}

export interface IOptions {
  employeeTypes: IOption[];
  genders: IOption[];
  paymentFrequencies: IOption[];
  maritalStatuses: IOption[];
  paymentMethods: IOption[];
  banks: IOption[];
  documentTypes: IOption[];
  adjustmentReasons: IOption[];
  componentTypes: IOption[];
}
