import { Employee, PayrollCycle, AdvanceLoanRecord, CompanySettings } from '../types/payroll';
import { calculatePayrollItem } from './calculations';

const EMPLOYEES_KEY = 'eliteedge_inr_payroll_employees_v1';
const CYCLES_KEY = 'eliteedge_inr_payroll_cycles_v1';
const ADVANCES_KEY = 'eliteedge_inr_payroll_advances_v1';
const SETTINGS_KEY = 'eliteedge_inr_payroll_settings_v1';

export const initialCompanySettings: CompanySettings = {
  companyName: 'EliteEdge Accounting & Financial Advisory India Pvt. Ltd.',
  companyBanglaName: 'EliteEdge Enterprise Solutions India',
  tagline: 'Corporate Payroll & Enterprise Compensation Management System',
  address: 'Level 14, Tower 2, Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
  addressBangla: 'Level 14, Tower 2, Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
  phone: '+91 22 6123 4567 / +91 98200 11223',
  email: 'payroll@eliteedge.in',
  website: 'www.eliteedge.in',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultWorkingDays: 26,
  accountantName: 'Vikramaditya Iyer, CA',
  accountantTitle: 'Chief Financial Accountant & Corporate Controller',
  approverName: 'Rajesh Mehra',
  approverTitle: 'Managing Director & Chief Executive Officer',
  pfEsiNote: 'Strict Non-Contributory Payroll Structure: This organization does not apply statutory Provident Fund (PF) or Employee State Insurance (ESI) deductions. All compensation and discretionary deductions are governed by company employment agreement.'
};

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-101',
    name: 'Rahul Sharma',
    banglaName: 'Rahul Sharma',
    designation: 'Principal Software Architect',
    department: 'IT & Software',
    joinDate: '2022-04-01',
    email: 'rahul.sharma@eliteedge.in',
    phone: '+91 98201 22334',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100234567890',
    accountTitle: 'Rahul Sharma',
    branchName: 'BKC Financial Center Branch, Mumbai',
    routingNumber: 'HDFC0000123',
    basicSalary: 65000,
    houseRentAllowance: 12000,
    medicalAllowance: 3000,
    conveyanceAllowance: 3000,
    foodAllowance: 0,
    specialAllowance: 2000,
    overtimeHourlyRate: 500
  },
  {
    id: 'EMP-102',
    name: 'Priya Nair',
    banglaName: 'Priya Nair',
    designation: 'Head of Brand & Growth Marketing',
    department: 'Marketing & Sales',
    joinDate: '2021-08-15',
    email: 'priya.nair@eliteedge.in',
    phone: '+91 98450 33445',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'ICICI Bank Ltd.',
    accountNumber: '001105012345',
    accountTitle: 'Priya Nair',
    branchName: 'Nariman Point Branch, Mumbai',
    routingNumber: 'ICIC0000011',
    basicSalary: 55000,
    houseRentAllowance: 10000,
    medicalAllowance: 2500,
    conveyanceAllowance: 2500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 450
  },
  {
    id: 'EMP-103',
    name: 'Amit Patel',
    banglaName: 'Amit Patel',
    designation: 'Senior DevOps & Cloud Engineer',
    department: 'Engineering',
    joinDate: '2023-02-01',
    email: 'amit.patel@eliteedge.in',
    phone: '+91 97123 44556',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'Axis Bank Ltd.',
    accountNumber: '918020045678912',
    accountTitle: 'Amit Patel',
    branchName: 'Andheri West Branch, Mumbai',
    routingNumber: 'UTIB0000245',
    basicSalary: 48000,
    houseRentAllowance: 8000,
    medicalAllowance: 2000,
    conveyanceAllowance: 2000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 400
  },
  {
    id: 'EMP-104',
    name: 'Ananya Sen',
    banglaName: 'Ananya Sen',
    designation: 'Director of Business Operations',
    department: 'Operations & Admin',
    joinDate: '2020-10-10',
    email: 'ananya.sen@eliteedge.in',
    phone: '+91 98300 55667',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'State Bank of India (SBI)',
    accountNumber: '309876543210',
    accountTitle: 'Ananya Sen',
    branchName: 'Corporate Centre, Nariman Point',
    routingNumber: 'SBIN0000691',
    basicSalary: 75000,
    houseRentAllowance: 15000,
    medicalAllowance: 4000,
    conveyanceAllowance: 4000,
    foodAllowance: 0,
    specialAllowance: 2000,
    overtimeHourlyRate: 600
  },
  {
    id: 'EMP-105',
    name: 'Rohan Verma',
    banglaName: 'Rohan Verma',
    designation: 'Lead UI/UX Product Designer',
    department: 'Design & Creative',
    joinDate: '2023-06-15',
    email: 'rohan.verma@eliteedge.in',
    phone: '+91 98111 66778',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '2411890123',
    accountTitle: 'Rohan Verma',
    branchName: 'Powai Branch, Mumbai',
    routingNumber: 'KKBK0000654',
    basicSalary: 42000,
    houseRentAllowance: 6000,
    medicalAllowance: 2000,
    conveyanceAllowance: 2000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 350
  },
  {
    id: 'EMP-106',
    name: 'Deepa Menon',
    banglaName: 'Deepa Menon',
    designation: 'Senior Financial Controller',
    department: 'Accounts & Finance',
    joinDate: '2021-03-01',
    email: 'deepa.menon@eliteedge.in',
    phone: '+91 94470 77889',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100456789012',
    accountTitle: 'Deepa Menon',
    branchName: 'Fort Branch, Mumbai',
    routingNumber: 'HDFC0000060',
    basicSalary: 58000,
    houseRentAllowance: 10000,
    medicalAllowance: 2500,
    conveyanceAllowance: 2500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 450
  },
  {
    id: 'EMP-107',
    name: 'Suresh Kumar',
    banglaName: 'Suresh Kumar',
    designation: 'Office Administrator & Facilities Lead',
    department: 'Operations & Admin',
    joinDate: '2022-11-15',
    email: 'suresh.k@eliteedge.in',
    phone: '+91 98400 88990',
    status: 'Active',
    paymentMethod: 'bKash',
    bankName: 'UPI / Corporate Wallet (GPay / PhonePe)',
    accountNumber: '9840088990@upi',
    accountTitle: 'Suresh Kumar',
    branchName: 'Instant UPI Corporate Gateway',
    mfsNumber: '9840088990@upi',
    basicSalary: 28000,
    houseRentAllowance: 3000,
    medicalAllowance: 1500,
    conveyanceAllowance: 1500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 200
  },
  {
    id: 'EMP-108',
    name: 'Kavita Joshi',
    banglaName: 'Kavita Joshi',
    designation: 'Customer Success Specialist',
    department: 'Customer Support',
    joinDate: '2023-09-01',
    email: 'kavita.j@eliteedge.in',
    phone: '+91 97654 99001',
    status: 'Active',
    paymentMethod: 'Cash',
    bankName: 'Corporate Cash Desk',
    accountNumber: 'Corporate Cash Counter',
    accountTitle: 'Kavita Joshi',
    branchName: 'Treasury Desk, BKC HQ',
    basicSalary: 32000,
    houseRentAllowance: 3500,
    medicalAllowance: 1500,
    conveyanceAllowance: 1500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 250
  }
];

export const initialAdvanceLoans: AdvanceLoanRecord[] = [
  {
    id: 'ADV-001',
    employeeId: 'EMP-104',
    employeeName: 'Ananya Sen',
    amount: 25000,
    disbursedDate: '2026-08-01',
    monthlyDeduction: 5000,
    totalDeducted: 5000,
    remainingBalance: 20000,
    reason: 'Emergency Medical & Family Advance',
    status: 'Active'
  },
  {
    id: 'ADV-002',
    employeeId: 'EMP-107',
    employeeName: 'Suresh Kumar',
    amount: 8000,
    disbursedDate: '2026-08-05',
    monthlyDeduction: 1500,
    totalDeducted: 1500,
    remainingBalance: 6500,
    reason: 'Relocation & Housing Security Advance',
    status: 'Active'
  }
];

export function createInitialPayrollCycle(employees: Employee[]): PayrollCycle {
  const workingDays = 26;
  const items = employees.map(emp => {
    let absent = 0;
    let lateFine = 0;
    let advanceDed = 0;
    let bonus = 0;
    let otHours = 0;

    if (emp.id === 'EMP-101') {
      absent = 0;
      lateFine = 500;
    } else if (emp.id === 'EMP-102') {
      absent = 0;
      lateFine = 0;
    } else if (emp.id === 'EMP-104') {
      absent = 0;
      advanceDed = 5000;
    } else if (emp.id === 'EMP-107') {
      absent = 0;
      advanceDed = 1500;
    }

    return calculatePayrollItem(
      emp,
      workingDays,
      workingDays - absent,
      absent,
      0,
      otHours,
      bonus,
      advanceDed,
      0,
      lateFine,
      0,
      0,
      '',
      { isPaid: false }
    );
  });

  return {
    id: '2026-08',
    month: 'August',
    banglaMonth: 'August',
    year: 2026,
    status: 'Verified',
    workingDays,
    createdAt: '2026-08-01',
    verifiedAt: '2026-08-18',
    items,
    notes: 'August 2026 EliteEdge India Corporate Payroll Cycle (Non-Contributory No PF/ESI)'
  };
}

export function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading employees', e);
  }
  saveEmployees(initialEmployees);
  return initialEmployees;
}

export function saveEmployees(employees: Employee[]) {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Error saving employees', e);
  }
}

export function loadPayrollCycles(): PayrollCycle[] {
  try {
    const raw = localStorage.getItem(CYCLES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading payroll cycles', e);
  }
  const defaultCycle = createInitialPayrollCycle(initialEmployees);
  savePayrollCycles([defaultCycle]);
  return [defaultCycle];
}

export function savePayrollCycles(cycles: PayrollCycle[]) {
  try {
    localStorage.setItem(CYCLES_KEY, JSON.stringify(cycles));
  } catch (e) {
    console.error('Error saving payroll cycles', e);
  }
}

export function loadAdvanceLoans(): AdvanceLoanRecord[] {
  try {
    const raw = localStorage.getItem(ADVANCES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading advance loans', e);
  }
  saveAdvanceLoans(initialAdvanceLoans);
  return initialAdvanceLoans;
}

export function saveAdvanceLoans(records: AdvanceLoanRecord[]) {
  try {
    localStorage.setItem(ADVANCES_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving advance loans', e);
  }
}

export function loadSettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings', e);
  }
  saveSettings(initialCompanySettings);
  return initialCompanySettings;
}

export function saveSettings(settings: CompanySettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}
