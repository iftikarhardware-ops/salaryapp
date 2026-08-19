import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  CreditCard, 
  Building2, 
  Download, 
  ShieldCheck, 
  Check, 
  X,
  Smartphone,
  Landmark,
  Banknote
} from 'lucide-react';
import { Employee, CompanySettings } from '../types/payroll';
import { formatCurrency } from '../utils/numberToWords';

interface EmployeeManagerProps {
  employees: Employee[];
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  settings: CompanySettings;
  isBangla?: boolean;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  onSaveEmployee,
  onDeleteEmployee,
  settings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '',
    name: '',
    banglaName: '',
    designation: '',
    department: 'Engineering',
    joinDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: '',
    status: 'Active',
    paymentMethod: 'Bank Transfer',
    bankName: 'BRAC Bank PLC',
    accountNumber: '',
    accountTitle: '',
    branchName: 'Corporate Branch',
    routingNumber: '',
    basicSalary: 35000,
    houseRentAllowance: 3000,
    medicalAllowance: 1500,
    conveyanceAllowance: 1000,
    foodAllowance: 0,
    specialAllowance: 0,
    overtimeHourlyRate: 250
  });

  const departments = ['Engineering', 'IT & Software', 'Marketing & Sales', 'Accounts & Finance', 'Operations & Admin', 'Human Resources', 'Design & Creative', 'Customer Support'];

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    const nextId = `EMP-${(100 + employees.length + 1).toString()}`;
    setFormData({
      id: nextId,
      name: '',
      banglaName: '',
      designation: '',
      department: 'IT & Software',
      joinDate: new Date().toISOString().split('T')[0],
      email: '',
      phone: '',
      status: 'Active',
      paymentMethod: 'Bank Transfer',
      bankName: 'BRAC Bank PLC',
      accountNumber: '',
      accountTitle: '',
      branchName: 'Main Branch',
      routingNumber: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name) return;

    const empToSave: Employee = {
      id: formData.id,
      name: formData.name,
      banglaName: formData.banglaName || formData.name,
      designation: formData.designation || 'Staff',
      department: formData.department || 'Operations',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      email: formData.email || '',
      phone: formData.phone || '',
      status: (formData.status as any) || 'Active',
      paymentMethod: (formData.paymentMethod as any) || 'Bank Transfer',
      bankName: formData.bankName || 'N/A',
      accountNumber: formData.accountNumber || 'N/A',
      accountTitle: formData.accountTitle || formData.name,
      branchName: formData.branchName || '',
      routingNumber: formData.routingNumber || '',
      basicSalary: Number(formData.basicSalary) || 0,
      houseRentAllowance: Number(formData.houseRentAllowance) || 0,
      medicalAllowance: Number(formData.medicalAllowance) || 0,
      conveyanceAllowance: Number(formData.conveyanceAllowance) || 0,
      foodAllowance: Number(formData.foodAllowance) || 0,
      specialAllowance: Number(formData.specialAllowance) || 0,
      overtimeHourlyRate: Number(formData.overtimeHourlyRate) || 0
    };

    onSaveEmployee(empToSave);
    setIsModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const headers = ['Employee ID', 'Name', 'Designation', 'Department', 'Join Date', 'Email', 'Phone', 'Payment Mode', 'Bank Name', 'Account Number', 'Basic Salary', 'House Rent', 'Medical', 'Conveyance', 'Total Gross (No PF/ESI)'];
    const rows = employees.map(e => [
      e.id,
      `"${e.name}"`,
      `"${e.designation}"`,
      `"${e.department}"`,
      e.joinDate,
      e.email,
      e.phone,
      e.paymentMethod,
      `"${e.bankName}"`,
      `"${e.accountNumber}"`,
      e.basicSalary,
      e.houseRentAllowance,
      e.medicalAllowance,
      e.conveyanceAllowance,
      e.basicSalary + e.houseRentAllowance + e.medicalAllowance + e.conveyanceAllowance + e.foodAllowance + e.specialAllowance
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Employees_Master_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEmployees = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = departmentFilter === 'ALL' || e.department === departmentFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Action and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            aria-label="Filter by department"
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Employee & ID</th>
                <th className="px-4 py-3.5">Designation & Dept</th>
                <th className="px-4 py-3.5 text-right">Basic Salary</th>
                <th className="px-4 py-3.5 text-right">Allowances</th>
                <th className="px-4 py-3.5 text-right font-black">Gross Compensation</th>
                <th className="px-4 py-3.5">Payment Account</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No employees found matching the search.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const totalAllow = emp.houseRentAllowance + emp.medicalAllowance + emp.conveyanceAllowance + emp.foodAllowance + emp.specialAllowance;
                  const totalGross = emp.basicSalary + totalAllow;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {emp.id} • Joined: {emp.joinDate}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        <div>{emp.designation}</div>
                        <div className="text-[11px] text-slate-400">{emp.department}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                        {formatCurrency(emp.basicSalary, settings.currencySymbol)}
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-slate-600">
                        {formatCurrency(totalAllow, settings.currencySymbol)}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-indigo-900 text-sm">
                        {formatCurrency(totalGross, settings.currencySymbol)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{emp.paymentMethod}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {emp.bankName !== 'N/A' ? `${emp.bankName} - ${emp.accountNumber}` : emp.accountNumber}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          emp.status === 'Probation' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {emp.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Employee & Salary Structure"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${emp.name} from payroll system?`)) {
                                onDeleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Employee"
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

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                {editingEmployee ? 'Edit Employee & Salary Structure' : 'Enrol New Employee (No PF/ESI)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Section 1: Basic Information */}
              <div>
                <h4 className="font-bold text-indigo-700 uppercase tracking-wider mb-3">
                  1. Personal & Employment Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Employee ID*</label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Legal Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Corporate Designation*</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Employment Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="Active">Active Permanent</option>
                      <option value="Probation">Probationary</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Salary Structure (Strictly No PF/ESI) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-indigo-700 uppercase tracking-wider">
                    2. Monthly Compensation & Allowance Structure
                  </h4>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ PF & ESI Exempt
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Basic Salary ({settings.currencySymbol})*</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">House Rent ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.houseRentAllowance}
                      onChange={(e) => setFormData({ ...formData, houseRentAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Medical Allowance</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.medicalAllowance}
                      onChange={(e) => setFormData({ ...formData, medicalAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Conveyance / Travel</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.conveyanceAllowance}
                      onChange={(e) => setFormData({ ...formData, conveyanceAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* Overtime Rate */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overtime Rate per Hour ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.overtimeHourlyRate}
                    onChange={(e) => setFormData({ ...formData, overtimeHourlyRate: Number(e.target.value) })}
                    className="w-48 px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Section 3: Banking & Disbursement Details */}
              <div>
                <h4 className="font-bold text-indigo-700 uppercase tracking-wider mb-3">
                  3. Disbursement & Banking Channel
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="bKash">bKash (MFS)</option>
                      <option value="Cash">Cash Voucher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Name / Provider</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. BRAC Bank PLC"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Number / MFS</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Account or Mobile No."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
