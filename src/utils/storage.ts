import { Employee, PayrollCycle, AdvanceLoanRecord, CompanySettings } from '../types/payroll';
import { calculatePayrollItem } from './calculations';

const EMPLOYEES_KEY = 'fintrack_payroll_employees_v1';
const CYCLES_KEY = 'fintrack_payroll_cycles_v1';
const ADVANCES_KEY = 'fintrack_payroll_advances_v1';
const SETTINGS_KEY = 'fintrack_payroll_settings_v1';

export const initialCompanySettings: CompanySettings = {
  companyName: 'FinTrack Corporate Ltd.',
  companyBanglaName: 'ফিনট্র্যাক কর্পোরেট লিমিটেড',
  tagline: 'Corporate Payroll & Financial Management',
  address: 'House 45, Road 11, Banani, Dhaka-1213, Bangladesh',
  addressBangla: 'বাড়ি ৪৫, রোড ১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
  phone: '+880 1712-345678',
  email: 'accounts@fintrackcorp.com',
  website: 'www.fintrackcorp.com',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  defaultWorkingDays: 26,
  accountantName: 'রহিম আহমেদ',
  accountantTitle: 'চীফ একাউন্টেন্ট (Chief Accountant)',
  approverName: 'আহসান হাবিব',
  approverTitle: 'ব্যবস্থাপনা পরিচালক (Managing Director)',
  pfEsiNote: 'এই প্রতিষ্ঠানে কোনো PF (Provident Fund) এবং ESI কর্তন প্রযোজ্য নয়। সকল ভাতা ও কর্তন কোম্পানির নিজস্ব স্যালারি পলিসি অনুযায়ী নির্ধারিত।'
};

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-101',
    name: 'Ariful Huq',
    banglaName: 'আরিফুল হক',
    designation: 'Senior Software Engineer',
    department: 'IT & Software',
    joinDate: '2022-03-15',
    email: 'ariful.h@fintrackcorp.com',
    phone: '+880 1711-223344',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'BRAC Bank Ltd.',
    accountNumber: '1501203498120001',
    accountTitle: 'Ariful Huq',
    branchName: 'Gulshan Branch',
    routingNumber: '060261354',
    basicSalary: 45000,
    houseRentAllowance: 3000,
    medicalAllowance: 1500,
    conveyanceAllowance: 1000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 350
  },
  {
    id: 'EMP-102',
    name: 'Nadia Sultana',
    banglaName: 'নাদিয়া সুলতানা',
    designation: 'Marketing Lead',
    department: 'Marketing & Sales',
    joinDate: '2021-06-01',
    email: 'nadia.s@fintrackcorp.com',
    phone: '+880 1819-334455',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'City Bank PLC',
    accountNumber: '1102948576001',
    accountTitle: 'Nadia Sultana',
    branchName: 'Banani Branch',
    routingNumber: '225261489',
    basicSalary: 38500,
    houseRentAllowance: 4000,
    medicalAllowance: 2000,
    conveyanceAllowance: 2000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 300
  },
  {
    id: 'EMP-103',
    name: 'Kamrul Islam',
    banglaName: 'কামরুল ইসলাম',
    designation: 'Office Admin & Logistics',
    department: 'Operations & Admin',
    joinDate: '2023-01-10',
    email: 'kamrul.i@fintrackcorp.com',
    phone: '+880 1912-998877',
    status: 'Active',
    paymentMethod: 'bKash',
    bankName: 'bKash Merchant/Personal',
    accountNumber: '01912998877',
    accountTitle: 'Kamrul Islam',
    branchName: 'MFS Wallet',
    mfsNumber: '01912998877',
    basicSalary: 22000,
    houseRentAllowance: 1500,
    medicalAllowance: 1000,
    conveyanceAllowance: 700,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 150
  },
  {
    id: 'EMP-104',
    name: 'Tanvir Ahmed',
    banglaName: 'তানভীর আহমেদ',
    designation: 'Operations Manager',
    department: 'Operations & Admin',
    joinDate: '2020-11-01',
    email: 'tanvir.a@fintrackcorp.com',
    phone: '+880 1713-556677',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'Dutch-Bangla Bank Ltd.',
    accountNumber: '11612000984321',
    accountTitle: 'Tanvir Ahmed',
    branchName: 'Mohakhali Branch',
    routingNumber: '090263421',
    basicSalary: 55000,
    houseRentAllowance: 6000,
    medicalAllowance: 3000,
    conveyanceAllowance: 3500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 400
  },
  {
    id: 'EMP-105',
    name: 'Farhana Boby',
    banglaName: 'ফারহানা ববি',
    designation: 'Junior UI/UX Designer',
    department: 'Design & Creative',
    joinDate: '2023-08-15',
    email: 'farhana.b@fintrackcorp.com',
    phone: '+880 1611-445566',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'Eastern Bank PLC',
    accountNumber: '1041050098765',
    accountTitle: 'Farhana Boby',
    branchName: 'Uttara Branch',
    routingNumber: '095262118',
    basicSalary: 28000,
    houseRentAllowance: 1000,
    medicalAllowance: 1000,
    conveyanceAllowance: 0,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 200
  },
  {
    id: 'EMP-106',
    name: 'Mahmudul Hasan',
    banglaName: 'মাহমুদুল হাসান',
    designation: 'Senior Accountant',
    department: 'Accounts & Finance',
    joinDate: '2021-01-05',
    email: 'mahmud.h@fintrackcorp.com',
    phone: '+880 1715-778899',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'Islami Bank Bangladesh PLC',
    accountNumber: '2050123020087654',
    accountTitle: 'Mahmudul Hasan',
    branchName: 'Dhanmondi Branch',
    routingNumber: '125261005',
    basicSalary: 42000,
    houseRentAllowance: 3500,
    medicalAllowance: 1500,
    conveyanceAllowance: 1500,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 320
  },
  {
    id: 'EMP-107',
    name: 'Sumaiya Akter',
    banglaName: 'সুমাইয়া আক্তার',
    designation: 'HR Executive',
    department: 'Human Resources',
    joinDate: '2022-09-01',
    email: 'sumaiya.a@fintrackcorp.com',
    phone: '+880 1812-337788',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'BRAC Bank Ltd.',
    accountNumber: '1501205566778899',
    accountTitle: 'Sumaiya Akter',
    branchName: 'Mirpur Branch',
    routingNumber: '060261992',
    basicSalary: 30000,
    houseRentAllowance: 2500,
    medicalAllowance: 1500,
    conveyanceAllowance: 1000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 220
  },
  {
    id: 'EMP-108',
    name: 'Sakib Al Hasan',
    banglaName: 'সাকিব আল হাসান',
    designation: 'Customer Support Lead',
    department: 'Customer Support',
    joinDate: '2023-03-01',
    email: 'sakib.h@fintrackcorp.com',
    phone: '+880 1511-224466',
    status: 'Active',
    paymentMethod: 'Cash',
    bankName: 'Cash on Hand',
    accountNumber: 'Cash Disbursement',
    accountTitle: 'Sakib Al Hasan',
    branchName: 'Head Office Cash Counter',
    basicSalary: 25000,
    houseRentAllowance: 2000,
    medicalAllowance: 1000,
    conveyanceAllowance: 1000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 180
  }
];

export const initialAdvanceLoans: AdvanceLoanRecord[] = [
  {
    id: 'ADV-001',
    employeeId: 'EMP-104',
    employeeName: 'Tanvir Ahmed',
    amount: 10000,
    disbursedDate: '2026-08-01',
    monthlyDeduction: 1200,
    totalDeducted: 1200,
    remainingBalance: 8800,
    reason: 'জরুরি পারিবারিক প্রয়োজন (Emergency medical)',
    status: 'Active'
  },
  {
    id: 'ADV-002',
    employeeId: 'EMP-103',
    employeeName: 'Kamrul Islam',
    amount: 3000,
    disbursedDate: '2026-08-05',
    monthlyDeduction: 500,
    totalDeducted: 500,
    remainingBalance: 2500,
    reason: 'বাড়ি ভাড়া অ্যাডভান্স (House rent advance)',
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
      // Ariful Huq (Matches design theme: Net 50,300)
      absent = 0;
      lateFine = 200;
      bonus = 0;
      otHours = 0;
    } else if (emp.id === 'EMP-102') {
      // Nadia Sultana (Matches design theme: Net 46,500)
      absent = 0;
      lateFine = 0;
      bonus = 0;
      otHours = 0;
    } else if (emp.id === 'EMP-103') {
      // Kamrul Islam (Net 24,700)
      absent = 0;
      advanceDed = 500;
      otHours = 0;
    } else if (emp.id === 'EMP-104') {
      // Tanvir Ahmed (Net 66,300)
      absent = 0;
      advanceDed = 1200;
      otHours = 0;
    } else if (emp.id === 'EMP-105') {
      // Farhana Boby (Net 29,900)
      absent = 0;
      lateFine = 100;
      otHours = 0;
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
    banglaMonth: 'আগস্ট',
    year: 2026,
    status: 'Verified',
    workingDays,
    createdAt: '2026-08-01',
    verifiedAt: '2026-08-18',
    items,
    notes: 'আগস্ট ২০২৬ মাসের রেগুলার স্যালারি শিট। কোনো PF ও ESI অন্তর্ভুক্ত নয়।'
  };
}

// Storage helpers
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
