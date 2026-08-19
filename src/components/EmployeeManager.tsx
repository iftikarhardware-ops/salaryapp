import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  DollarSign, 
  CreditCard, 
  UserCheck, 
  UserX,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import { Employee, Department, PaymentMethod, CompanySettings } from '../types/payroll';
import { formatCurrency, toBanglaNumber } from '../utils/numberToWords';

interface EmployeeManagerProps {
  employees: Employee[];
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  settings: CompanySettings;
  isBangla: boolean;
}

const DEPARTMENTS: Department[] = [
  'Accounts & Finance',
  'IT & Software',
  'Marketing & Sales',
  'Human Resources',
  'Operations & Admin',
  'Design & Creative',
  'Customer Support',
  'Executive / Management'
];

const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'Cash', 'bKash', 'Nagad', 'Rocket'];

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  onSaveEmployee,
  onDeleteEmployee,
  settings,
  isBangla
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '',
    name: '',
    banglaName: '',
    designation: '',
    department: 'Accounts & Finance',
    joinDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: '',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'BRAC Bank Ltd.',
    accountNumber: '',
    accountTitle: '',
    branchName: '',
    routingNumber: '',
    mfsNumber: '',
    basicSalary: 30000,
    houseRentAllowance: 3000,
    medicalAllowance: 1500,
    conveyanceAllowance: 1000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 200
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.banglaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    const nextIdNum = employees.length + 101;
    setEditingEmployee(null);
    setFormData({
      id: `EMP-${nextIdNum}`,
      name: '',
      banglaName: '',
      designation: '',
      department: 'IT & Software',
      joinDate: new Date().toISOString().split('T')[0],
      email: '',
      phone: '',
      status: 'Active',
      paymentMethod: 'Bank Transfer',
      bankName: 'BRAC Bank Ltd.',
      accountNumber: '',
      accountTitle: '',
      branchName: '',
      routingNumber: '',
      mfsNumber: '',
      basicSalary: 35000,
      houseRentAllowance: 3000,
      medicalAllowance: 1500,
      conveyanceAllowance: 1000,
      foodAllowance: 0,
      specialAllowance: 0,
      overtimeHourlyRate: 250
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) {
      alert(isBangla ? 'অনুগ্রহ করে এমপ্লয়ি আইডি ও নাম প্রদান করুন।' : 'Please enter Employee ID and Name.');
      return;
    }

    const completeEmployee: Employee = {
      id: formData.id || `EMP-${Date.now()}`,
      name: formData.name || '',
      banglaName: formData.banglaName || formData.name || '',
      designation: formData.designation || 'Staff',
      department: (formData.department as Department) || 'Operations & Admin',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      email: formData.email || '',
      phone: formData.phone || '',
      status: formData.status || 'Active',
      paymentMethod: formData.paymentMethod || 'Bank Transfer',
      bankName: formData.bankName || 'N/A',
      accountNumber: formData.accountNumber || formData.mfsNumber || 'N/A',
      accountTitle: formData.accountTitle || formData.name || '',
      branchName: formData.branchName || '',
      routingNumber: formData.routingNumber || '',
      mfsNumber: formData.mfsNumber || '',
      basicSalary: Number(formData.basicSalary) || 0,
      houseRentAllowance: Number(formData.houseRentAllowance) || 0,
      medicalAllowance: Number(formData.medicalAllowance) || 0,
      conveyanceAllowance: Number(formData.conveyanceAllowance) || 0,
      foodAllowance: Number(formData.foodAllowance) || 0,
      specialAllowance: Number(formData.specialAllowance) || 0,
      overtimeHourlyRate: Number(formData.overtimeHourlyRate) || 0
    };

    onSaveEmployee(completeEmployee);
    setIsModalOpen(false);
  };

  const calculateGross = (data: Partial<Employee>) => {
    return (
      (Number(data.basicSalary) || 0) +
      (Number(data.houseRentAllowance) || 0) +
      (Number(data.medicalAllowance) || 0) +
      (Number(data.conveyanceAllowance) || 0) +
      (Number(data.foodAllowance) || 0) +
      (Number(data.specialAllowance) || 0)
    );
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Bangla Name', 'Department', 'Designation', 'Basic Salary', 'House Rent', 'Medical', 'Conveyance', 'Gross Salary', 'Payment Method', 'Bank Name', 'Account Number', 'Phone'];
    const rows = employees.map(e => [
      e.id,
      `"${e.name}"`,
      `"${e.banglaName}"`,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.basicSalary,
      e.houseRentAllowance,
      e.medicalAllowance,
      e.conveyanceAllowance,
      e.basicSalary + e.houseRentAllowance + e.medicalAllowance + e.conveyanceAllowance + e.foodAllowance + e.specialAllowance,
      e.paymentMethod,
      `"${e.bankName}"`,
      `"${e.accountNumber}"`,
      `"${e.phone}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_Employee_Salary_Setup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isBangla ? 'নাম, আইডি, পদবী বা অ্যাকাউন্ট নম্বর খুঁজুন...' : 'Search by name, ID, designation, account...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            aria-label={isBangla ? 'ডিপার্টমেন্ট নির্বাচন করুন' : 'Select Department'}
            className="border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">{isBangla ? 'সকল ডিপার্টমেন্ট (All)' : 'All Departments'}</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isBangla ? 'CSV এক্সপোর্ট' : 'Export CSV'}
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isBangla ? '+ নতুন এমপ্লয়ি যোগ করুন' : '+ Add Employee'}
          </button>
        </div>
      </div>

      {/* Employees Grid / Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {isBangla ? 'এমপ্লয়ি ডাটাবেজ ও ফিক্সড স্যালারি স্ট্রাকচার' : 'Employee Database & Salary Structure'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBangla ? `মোট ${toBanglaNumber(filteredEmployees.length)} জন কর্মকর্তা/কর্মচারী (PF ও ESI মুক্ত)` : `Showing ${filteredEmployees.length} employee records (No PF/ESI)`}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
            <span>● {isBangla ? 'PF ও ESI বাদ দিয়ে নির্ধারিত স্যালারি' : 'PF & ESI Excluded'}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{isBangla ? 'এমপ্লয়ি আইডি ও নাম' : 'Employee ID & Name'}</th>
                <th className="px-4 py-3">{isBangla ? 'ডিপার্টমেন্ট ও পদবী' : 'Department & Designation'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মূল বেতন (Basic)' : 'Basic Salary'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মোট ভাতা (Allowances)' : 'Allowances'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মোট গ্রস (Gross)' : 'Gross Salary'}</th>
                <th className="px-4 py-3">{isBangla ? 'পেমেন্ট চ্যানেল' : 'Payment Method'}</th>
                <th className="px-4 py-3 text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {isBangla ? 'কোনো এমপ্লয়ি রেকর্ড পাওয়া যায়নি।' : 'No employee records found.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const allowances = emp.houseRentAllowance + emp.medicalAllowance + emp.conveyanceAllowance + emp.foodAllowance + emp.specialAllowance;
                  const gross = emp.basicSalary + allowances;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-indigo-700 border border-slate-200 flex items-center justify-center font-bold text-xs">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{emp.banglaName || emp.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                              <span className="font-semibold text-indigo-600">{emp.id}</span>
                              <span>•</span>
                              <span>{emp.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-700">{emp.designation}</div>
                        <div className="text-[11px] text-slate-500">{emp.department}</div>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800">
                        {formatCurrency(emp.basicSalary, settings.currencySymbol, isBangla)}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono text-emerald-600 font-semibold">
                        +{formatCurrency(allowances, settings.currencySymbol, isBangla)}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {isBangla ? 'বাড়ি+চিকিৎসা+যাতায়াত' : 'Rent+Med+Conv'}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 bg-slate-50/30">
                        {formatCurrency(gross, settings.currencySymbol, isBangla)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>{emp.paymentMethod}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">
                          {emp.bankName} - {emp.accountNumber}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {emp.status === 'Active' ? (isBangla ? 'সক্রিয়' : 'Active') : emp.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title={isBangla ? 'স্যালারি ও তথ্য এডিট করুন' : 'Edit Employee'}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(isBangla ? `${emp.name} কে তালিকা থেকে ডিলিট করতে চান?` : `Delete employee ${emp.name}?`)) {
                                onDeleteEmployee(emp.id);
                              }
                            }}
                            title={isBangla ? 'ডিলিট করুন' : 'Delete'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Modal: Add / Edit with Custom Salary Structure */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {editingEmployee ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingEmployee
                      ? (isBangla ? 'এমপ্লয়ি তথ্য ও স্যালারি স্ট্রাকচার এডিট' : 'Edit Employee & Salary Structure')
                      : (isBangla ? 'নতুন এমপ্লয়ি যোগ ও স্যালারি নির্ধারণ' : 'Add New Employee & Salary Structure')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBangla ? 'PF এবং ESI ছাড়া পরিষ্কার বেতন কাঠামো ও ব্যাংক একাউন্ট সেটআপ' : 'Clean payroll breakdown without PF/ESI'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Section 1: Basic Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  {isBangla ? '১. ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য' : '1. Personal & Company Information'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'এমপ্লয়ি আইডি (Employee ID)*' : 'Employee ID*'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'নাম (English Name)*' : 'Full Name (English)*'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ariful Huq"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'বাংলায় নাম (Bangla Name)' : 'Bangla Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.banglaName}
                      onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                      placeholder="যেমন: আরিফুল হক"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'পদবী (Designation)*' : 'Designation*'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'ডিপার্টমেন্ট (Department)*' : 'Department*'}
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'যোগদানের তারিখ (Joining Date)' : 'Joining Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'মোবাইল নম্বর (Phone)' : 'Phone'}
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1711-XXXXXX"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'ইমেইল (Email)' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="employee@company.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'স্ট্যাটাস (Status)' : 'Status'}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="Active">{isBangla ? 'Active (সক্রিয়)' : 'Active'}</option>
                      <option value="On Leave">{isBangla ? 'On Leave (ছুটিতে)' : 'On Leave'}</option>
                      <option value="Terminated">{isBangla ? 'Terminated (অব্যাহতি)' : 'Terminated'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Salary Structure (No PF / No ESI) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {isBangla ? '২. স্যালারি স্ট্রাকচার ও ফিক্সড ভাতাসমূহ (No PF & No ESI)' : '2. Salary Structure & Allowances (No PF / ESI)'}
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {isBangla ? 'PF ও ESI প্রযোজ্য নয়' : 'No PF / ESI applied'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'মূল বেতন (Basic Salary)*' : 'Basic Salary*'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'বাড়ি ভাড়া ভাতা (House Rent)' : 'House Rent Allowance'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.houseRentAllowance}
                      onChange={(e) => setFormData({ ...formData, houseRentAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'চিকিৎসা ভাতা (Medical)' : 'Medical Allowance'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.medicalAllowance}
                      onChange={(e) => setFormData({ ...formData, medicalAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'যাতায়াত ভাতা (Conveyance)' : 'Conveyance Allowance'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.conveyanceAllowance}
                      onChange={(e) => setFormData({ ...formData, conveyanceAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'খাবার / টিফিন ভাতা (Food)' : 'Food Allowance'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.foodAllowance}
                      onChange={(e) => setFormData({ ...formData, foodAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'বিশেষ ভাতা (Special)' : 'Special Allowance'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.specialAllowance}
                      onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'ওভারটাইম রেট/ঘণ্টা (OT Rate/hr)' : 'OT Hourly Rate'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.overtimeHourlyRate}
                      onChange={(e) => setFormData({ ...formData, overtimeHourlyRate: Number(e.target.value) })}
                      placeholder="e.g. 250"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Gross Calculation Total Banner */}
                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    {isBangla ? 'সর্বমোট মাসিক গ্রস স্যালারি (Total Monthly Gross):' : 'Total Monthly Gross Salary:'}
                  </span>
                  <span className="text-sm font-extrabold text-indigo-900 font-mono">
                    {formatCurrency(calculateGross(formData), settings.currencySymbol, isBangla)}
                  </span>
                </div>
              </div>

              {/* Section 3: Bank / Payment Channel Setup */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {isBangla ? '৩. ব্যাংক একাউন্ট ও পেমেন্ট মেথড (Bank & Payment Channel)' : '3. Bank & Payment Channel Setup'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'পেমেন্ট মাধ্যম (Payment Method)' : 'Payment Method'}
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-semibold"
                    >
                      {PAYMENT_METHODS.map(pm => (
                        <option key={pm} value={pm}>{pm}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {formData.paymentMethod === 'Bank Transfer'
                        ? (isBangla ? 'ব্যাংকের নাম (Bank Name)' : 'Bank Name')
                        : (isBangla ? 'ওয়ালেট / গেটওয়ে নাম' : 'Wallet / Channel Name')}
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. BRAC Bank Ltd."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {formData.paymentMethod === 'Bank Transfer'
                        ? (isBangla ? 'একাউন্ট নম্বর (Account Number)*' : 'Account Number*')
                        : (isBangla ? 'মোবাইল একাউন্ট নম্বর*' : 'Mobile Account No*')}
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value, mfsNumber: e.target.value })}
                      placeholder="e.g. 1501203498120001"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'একাউন্ট টাইটেল (Account Title)' : 'Account Title'}
                    </label>
                    <input
                      type="text"
                      value={formData.accountTitle}
                      onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                      placeholder="Account holder name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'শাখার নাম (Branch Name)' : 'Branch Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      placeholder="e.g. Gulshan Branch"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBangla ? 'রাউটিং নম্বর (Routing No)' : 'Routing Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                      placeholder="e.g. 060261354"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isBangla ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
                >
                  {isBangla ? 'সংরক্ষণ করুন (Save Employee)' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
