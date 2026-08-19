export type Department = 
  | 'Accounts & Finance' 
  | 'IT & Software' 
  | 'Marketing & Sales' 
  | 'Human Resources' 
  | 'Operations & Admin' 
  | 'Design & Creative' 
  | 'Customer Support'
  | 'Executive / Management';

export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'bKash' | 'Nagad' | 'Rocket';

export type PayrollStatus = 'Draft' | 'Verified' | 'Approved' | 'Paid';

export interface Employee {
  id: string; // EMP-001
  name: string; // Ariful Huq
  banglaName: string; // আরিফুল হক
  designation: string; // Software Engineer
  department: Department;
  joinDate: string; // YYYY-MM-DD
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatarUrl?: string;
  
  // Payment Details
  paymentMethod: PaymentMethod;
  bankName: string; // e.g., 'Dutch-Bangla Bank', 'BRAC Bank', 'City Bank', 'Islami Bank'
  accountNumber: string;
  accountTitle: string;
  branchName: string;
  routingNumber?: string;
  mfsNumber?: string; // For bKash/Nagad

  // Salary Structure (No PF / No ESI)
  basicSalary: number; // মূল বেতন
  houseRentAllowance: number; // বাড়ি ভাড়া
  medicalAllowance: number; // চিকিৎসা ভাতা
  conveyanceAllowance: number; // যাতায়াত ভাতা
  foodAllowance: number; // খাবার ভাতা
  specialAllowance: number; // বিশেষ ভাতা
  overtimeHourlyRate?: number; // per hour rate (if 0, auto-calculated)
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

  // Earnings Breakdown
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  foodAllowance: number;
  specialAllowance: number;
  bonusAmount: number; // উৎসব / পারফর্মেন্স বোনাস
  overtimeAmount: number;
  totalGrossSalary: number; // সর্বমোট উপার্জন (Gross)

  // Deductions Breakdown (Strictly NO PF, NO ESI)
  absenceDeduction: number; // অনুপস্থিতি কর্তন
  advanceSalaryDeduction: number; // অগ্রিম বেতন কর্তন
  loanEmiDeduction: number; // ঋণ কিস্তি
  lateFineDeduction: number; // লেট জরিমানা
  taxDeduction: number; // আয়কর / TDS
  otherDeduction: number; // অন্যান্য কর্তন
  otherDeductionReason?: string;
  totalDeductions: number; // সর্বমোট কর্তন

  // Final Payable
  netPayable: number; // সর্বমোট প্রদেয় বেতন (Net Salary)
  
  // Status & Payment Info
  isPaid: boolean;
  paymentDate?: string;
  transactionRef?: string;
  remarks?: string;
}

export interface PayrollCycle {
  id: string; // '2026-08'
  month: string; // 'August'
  banglaMonth: string; // 'আগস্ট'
  year: number; // 2026
  status: PayrollStatus;
  workingDays: number;
  createdAt: string;
  verifiedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
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
  currencySymbol: string; // '৳' or 'BDT' or 'Tk'
  currencyCode: string; // 'BDT'
  defaultWorkingDays: number;
  accountantName: string;
  accountantTitle: string;
  approverName: string;
  approverTitle: string;
  pfEsiNote: string; // "এই প্রতিষ্ঠানে PF এবং ESI কর্তন প্রযোজ্য নয় (No PF & ESI Applied)"
}
