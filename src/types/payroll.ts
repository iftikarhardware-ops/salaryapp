export type Department = 
  | 'Accounts & Finance' 
  | 'IT & Software' 
  | 'Engineering'
  | 'Marketing & Sales' 
  | 'Human Resources' 
  | 'Operations & Admin' 
  | 'Design & Creative' 
  | 'Customer Support'
  | 'Executive / Management';

export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'bKash' | 'Nagad' | 'Rocket';

export type PayrollStatus = 'Draft' | 'Verified' | 'Approved' | 'Paid';

export type AttendanceStatus = 'P' | 'A' | 'HD' | 'L' | 'WO' | 'H'; // Present, Absent, Half Day, Leave, Weekly Off, Holiday

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn?: string; // HH:MM
  checkOut?: string; // HH:MM
  lateMinutes?: number;
  overtimeHours?: number;
  remarks?: string;
}

export interface Employee {
  id: string; // EMP-001
  name: string; // Rahul Sharma
  banglaName: string;
  designation: string; // Software Engineer
  department: Department;
  joinDate: string; // YYYY-MM-DD
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatarUrl?: string;
  
  // Payment Details
  paymentMethod: PaymentMethod;
  bankName: string;
  accountNumber: string;
  accountTitle: string;
  branchName: string;
  routingNumber?: string;
  mfsNumber?: string;

  // Salary Structure (No PF / No ESI)
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  foodAllowance: number;
  specialAllowance: number;
  overtimeHourlyRate?: number;
}

export interface PayrollItem {
  employeeId: string;
  employeeName: string;
  employeeBanglaName: string;
  designation: string;
  department: Department;
  paymentMethod: PaymentMethod;
  bankName: string;
  accountNumber: string;

  // Monthly Attendance & Performance
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtimeHours: number;
  overtimeHourlyRate: number;
  overtimeAmount: number;

  // Monthly Gross Allowances Breakdown
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  foodAllowance: number;
  specialAllowance: number;
  bonusAmount: number;
  totalAllowances: number;
  totalGrossSalary: number;

  // Deductions (Strictly No PF/ESI)
  absenceDeduction: number;
  advanceSalaryDeduction: number;
  loanDeduction: number;
  lateFineDeduction: number;
  taxDeduction: number;
  otherDeduction: number;
  totalDeductions: number;

  // Final Payout
  netPayable: number;
  isPaid: boolean;
  paidAt?: string;
  remarks?: string;
}

export interface PayrollCycle {
  id: string; // e.g., '2026-08'
  month: string; // e.g., 'August'
  banglaMonth: string;
  year: number; // e.g., 2026
  status: PayrollStatus;
  workingDays: number;
  createdAt: string;
  verifiedAt?: string;
  approvedAt?: string;
  items: PayrollItem[];
  notes?: string;
}

export interface AdvanceLoanRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  disbursedDate: string;
  monthlyDeduction: number;
  totalDeducted: number;
  remainingBalance: number;
  reason: string;
  status: 'Active' | 'Completed';
}

export interface CompanySettings {
  companyName: string;
  companyBanglaName: string;
  tagline: string;
  address: string;
  addressBangla: string;
  phone: string;
  email: string;
  website: string;
  currencySymbol: string;
  currencyCode: string;
  defaultWorkingDays: number;
  accountantName: string;
  accountantTitle: string;
  approverName: string;
  approverTitle: string;
  pfEsiNote: string;
}

export interface PayrollTotals {
  totalEmployees: number;
  totalBasic: number;
  totalAllowances: number;
  totalGross: number;
  totalAbsenceDeductions: number;
  totalAdvanceDeductions: number;
  totalOtherDeductions: number;
  totalDeductions: number;
  totalNetPayable: number;
  bankTotal: number;
  cashTotal: number;
  mfsTotal: number;
  paidCount: number;
  pendingCount: number;
}
