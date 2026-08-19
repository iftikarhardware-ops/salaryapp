import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Send, 
  Filter, 
  Printer, 
  ChevronRight, 
  Edit3, 
  CheckCheck, 
  AlertCircle, 
  HelpCircle,
  Banknote,
  Search,
  Sparkles,
  ShieldAlert,
  Landmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PayrollCycle, PayrollItem, CompanySettings, Employee } from '../types/payroll';
import { formatCurrency, toBanglaNumber } from '../utils/numberToWords';
import { calculatePayrollItem } from '../utils/calculations';

interface PayrollManagerProps {
  cycle: PayrollCycle;
  employees: Employee[];
  settings: CompanySettings;
  isBangla: boolean;
  onUpdateCycle: (updatedCycle: PayrollCycle) => void;
  onOpenPayslip: (item: PayrollItem) => void;
  onOpenBankAdvice: () => void;
  onOpenMasterSheet: () => void;
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  cycle,
  employees,
  settings,
  isBangla,
  onUpdateCycle,
  onOpenPayslip,
  onOpenBankAdvice,
  onOpenMasterSheet
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
  const [editingItem, setEditingItem] = useState<PayrollItem | null>(null);

  // Filter items
  const filteredItems = cycle.items.filter(item => {
    const matchesSearch = 
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeBanglaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'ALL' ? true :
      filterStatus === 'PAID' ? item.isPaid :
      !item.isPaid;

    return matchesSearch && matchesStatus;
  });

  // Toggle individual payment status
  const handleTogglePaid = (employeeId: string) => {
    const updatedItems = cycle.items.map(item => {
      if (item.employeeId === employeeId) {
        const nextPaid = !item.isPaid;
        return {
          ...item,
          isPaid: nextPaid,
          paymentDate: nextPaid ? new Date().toISOString().split('T')[0] : undefined,
          transactionRef: nextPaid ? `TRX-${Date.now().toString().slice(-6)}` : ''
        };
      }
      return item;
    });

    onUpdateCycle({
      ...cycle,
      items: updatedItems
    });
  };

  // Mark all as paid / Disburse Salary Now
  const handleDisburseAll = () => {
    const today = new Date().toISOString().split('T')[0];
    const updatedItems = cycle.items.map(item => ({
      ...item,
      isPaid: true,
      paymentDate: item.paymentDate || today,
      transactionRef: item.transactionRef || `TRX-${Date.now().toString().slice(-6)}`
    }));

    onUpdateCycle({
      ...cycle,
      status: 'Paid',
      disbursedAt: today,
      items: updatedItems
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Recalculate full cycle with updated working days
  const handleWorkingDaysChange = (newDays: number) => {
    const val = Math.max(1, newDays);
    const updatedItems = cycle.items.map(item => {
      const emp = employees.find(e => e.id === item.employeeId);
      if (!emp) return item;
      return calculatePayrollItem(
        emp,
        val,
        val - item.absentDays,
        item.absentDays,
        item.leaveDays,
        item.overtimeHours,
        item.bonusAmount,
        item.advanceSalaryDeduction,
        item.loanEmiDeduction,
        item.lateFineDeduction,
        item.taxDeduction,
        item.otherDeduction,
        item.otherDeductionReason,
        item
      );
    });

    onUpdateCycle({
      ...cycle,
      workingDays: val,
      items: updatedItems
    });
  };

  // Save changes from Edit Modal
  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const emp = employees.find(e => e.id === editingItem.employeeId);
    if (!emp) return;

    const recalculated = calculatePayrollItem(
      emp,
      cycle.workingDays,
      editingItem.presentDays,
      editingItem.absentDays,
      editingItem.leaveDays,
      editingItem.overtimeHours,
      editingItem.bonusAmount,
      editingItem.advanceSalaryDeduction,
      editingItem.loanEmiDeduction,
      editingItem.lateFineDeduction,
      editingItem.taxDeduction,
      editingItem.otherDeduction,
      editingItem.otherDeductionReason,
      editingItem
    );

    const updatedItems = cycle.items.map(item => 
      item.employeeId === editingItem.employeeId ? recalculated : item
    );

    onUpdateCycle({
      ...cycle,
      items: updatedItems
    });

    setEditingItem(null);
  };

  // Download CSV Report
  const handleDownloadCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Bangla Name',
      'Designation',
      'Department',
      'Working Days',
      'Present',
      'Absent',
      'OT Hours',
      'Basic Salary',
      'House Rent',
      'Medical',
      'Conveyance',
      'Bonus',
      'OT Pay',
      'Total Gross',
      'Absence Deduction',
      'Advance Deduction',
      'Late Fine',
      'Tax/TDS',
      'Total Deductions (No PF/ESI)',
      'Net Payable',
      'Payment Method',
      'Bank/MFS Details',
      'Payment Status',
      'Trx Ref'
    ];

    const rows = cycle.items.map(item => [
      item.employeeId,
      `"${item.employeeName}"`,
      `"${item.employeeBanglaName}"`,
      `"${item.designation}"`,
      `"${item.department}"`,
      item.workingDays,
      item.presentDays,
      item.absentDays,
      item.overtimeHours,
      item.basicSalary,
      item.houseRentAllowance,
      item.medicalAllowance,
      item.conveyanceAllowance,
      item.bonusAmount,
      item.overtimeAmount,
      item.totalGrossSalary,
      item.absenceDeduction,
      item.advanceSalaryDeduction,
      item.lateFineDeduction,
      item.taxDeduction,
      item.totalDeductions,
      item.netPayable,
      item.paymentMethod,
      `"${item.bankName} - ${item.accountNumber}"`,
      item.isPaid ? 'PAID' : 'UNPAID',
      item.transactionRef || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_Payroll_${cycle.month}_${cycle.year}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPaid = cycle.items.filter(i => i.isPaid).length;
  const isAllPaid = totalPaid === cycle.items.length && cycle.items.length > 0;

  return (
    <div className="space-y-6">
      {/* Workflow Step Bar & Month Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-100/70 border border-indigo-200 text-indigo-900 font-bold text-xs">
            {isBangla ? 'পে-রোল মাস:' : 'Cycle:'} {cycle.month} {cycle.year} ({cycle.banglaMonth})
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <span>{isBangla ? 'মাসের মোট কার্যদিবস:' : 'Working Days:'}</span>
            <input
              type="number"
              min="1"
              max="31"
              value={cycle.workingDays}
              onChange={(e) => handleWorkingDaysChange(parseInt(e.target.value) || 26)}
              aria-label={isBangla ? 'কার্যদিবস সংখ্যা' : 'Working Days count'}
              className="w-14 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-center text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-slate-400">{isBangla ? 'দিন' : 'days'}</span>
          </div>
        </div>

        {/* Step states: Draft -> Verified -> Approved -> Paid */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => onUpdateCycle({ ...cycle, status: 'Draft' })}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              cycle.status === 'Draft' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            1. {isBangla ? 'খসড়া (Draft)' : 'Draft'}
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => onUpdateCycle({ ...cycle, status: 'Verified', verifiedAt: new Date().toISOString().split('T')[0] })}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              cycle.status === 'Verified' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            2. {isBangla ? 'একাউন্টস যাচাই (Verified)' : 'Verified'}
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => onUpdateCycle({ ...cycle, status: 'Approved', approvedAt: new Date().toISOString().split('T')[0] })}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              cycle.status === 'Approved' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            3. {isBangla ? 'অনুমোদিত (Approved)' : 'Approved'}
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => onUpdateCycle({ ...cycle, status: 'Paid', disbursedAt: new Date().toISOString().split('T')[0] })}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              cycle.status === 'Paid' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            4. {isBangla ? 'পরিশোধিত (Paid)' : 'Paid'}
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table header control toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isBangla ? 'এমপ্লয়ি নাম বা আইডি খুঁজুন...' : 'Search employee...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded ${filterStatus === 'ALL' ? 'bg-white shadow-xs text-indigo-700 font-bold' : 'text-slate-600'}`}
              >
                {isBangla ? 'সকল' : 'All'} ({cycle.items.length})
              </button>
              <button
                onClick={() => setFilterStatus('PAID')}
                className={`px-2.5 py-1 rounded ${filterStatus === 'PAID' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'}`}
              >
                {isBangla ? 'পরিশোধিত' : 'Paid'} ({totalPaid})
              </button>
              <button
                onClick={() => setFilterStatus('UNPAID')}
                className={`px-2.5 py-1 rounded ${filterStatus === 'UNPAID' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'text-slate-600'}`}
              >
                {isBangla ? 'বকেয়া' : 'Pending'} ({cycle.items.length - totalPaid})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onOpenMasterSheet}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              {isBangla ? 'মাস্টার শিট ভিউ' : 'Master Register'}
            </button>
            <button
              onClick={onOpenBankAdvice}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
            >
              <Landmark className="w-3.5 h-3.5" />
              {isBangla ? 'ব্যাংক ট্রান্সফার লেটার' : 'Bank Advice'}
            </button>
          </div>
        </div>

        {/* Geometric Balance Tabular Grid */}
        <div className="overflow-x-auto">
          {/* Header Row exactly matching Geometric Balance styling */}
          <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-12 px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[800px]">
            <div className="col-span-3">{isBangla ? 'এমপ্লয়ির নাম (Employee Name)' : 'Employee Name'}</div>
            <div className="col-span-2">{isBangla ? 'পদবী (Designation)' : 'Designation'}</div>
            <div className="col-span-2 text-right">{isBangla ? 'মূল বেতন (Basic)' : 'Basic Salary'}</div>
            <div className="col-span-2 text-right">{isBangla ? 'ভাতা (Allowances)' : 'Allowances'}</div>
            <div className="col-span-1 text-right">{isBangla ? 'কর্তন' : 'Deductions'}</div>
            <div className="col-span-2 text-right">{isBangla ? 'প্রদেয় বেতন (Net Payable)' : 'Net Payable'}</div>
          </div>

          {/* Table Data Rows */}
          <div className="divide-y divide-slate-100 min-w-[800px]">
            {filteredItems.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400 text-xs">
                {isBangla ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No records match your query.'}
              </div>
            ) : (
              filteredItems.map((item) => {
                const totalAllowances = item.houseRentAllowance + item.medicalAllowance + item.conveyanceAllowance + item.foodAllowance + item.specialAllowance + item.bonusAmount + item.overtimeAmount;

                return (
                  <div
                    key={item.employeeId}
                    className={`grid grid-cols-12 px-6 py-4 items-center text-sm transition-colors group ${
                      item.isPaid ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Col 1: Employee Name */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {item.employeeBanglaName}
                        </span>
                        {item.isPaid && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {isBangla ? 'পরিশোধিত' : 'Paid'}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs font-mono">
                        ({item.employeeName}) • <span className="text-slate-500 font-semibold">{item.employeeId}</span>
                      </div>
                    </div>

                    {/* Col 2: Designation */}
                    <div className="col-span-2 text-slate-500 italic text-xs">
                      <div>{item.designation}</div>
                      <div className="text-[10px] not-italic text-slate-400 font-mono">
                        {item.paymentMethod} {item.bankName !== 'N/A' ? `(${item.bankName.split(' ')[0]})` : ''}
                      </div>
                    </div>

                    {/* Col 3: Basic Salary */}
                    <div className="col-span-2 text-right font-mono font-medium text-slate-700">
                      {formatCurrency(item.basicSalary, settings.currencySymbol, isBangla)}
                      <div className="text-[10px] text-slate-400">
                        {isBangla ? `${toBanglaNumber(item.presentDays)} দিন উপস্থিত` : `${item.presentDays}d present`}
                      </div>
                    </div>

                    {/* Col 4: Allowances */}
                    <div className="col-span-2 text-right text-emerald-600 font-mono font-semibold">
                      +{formatCurrency(totalAllowances, settings.currencySymbol, isBangla)}
                      {item.bonusAmount > 0 && (
                        <div className="text-[10px] text-indigo-600 font-semibold">
                          +{isBangla ? 'বোনাস:' : 'Bonus:'} {formatCurrency(item.bonusAmount, settings.currencySymbol, isBangla)}
                        </div>
                      )}
                    </div>

                    {/* Col 5: Deductions */}
                    <div className="col-span-1 text-right text-rose-500 font-mono font-semibold">
                      {item.totalDeductions > 0 ? `-${formatCurrency(item.totalDeductions, settings.currencySymbol, isBangla)}` : '৳ 0'}
                      <div className="text-[10px] text-slate-400">
                        {item.absentDays > 0 ? (isBangla ? `${toBanglaNumber(item.absentDays)} দিন অনুপস্থিত` : `${item.absentDays}d abs`) : ''}
                      </div>
                    </div>

                    {/* Col 6: Net Payable & Quick Action */}
                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                      <div>
                        <div className="font-bold text-slate-900 font-mono text-base">
                          {formatCurrency(item.netPayable, settings.currencySymbol, isBangla)}
                        </div>
                      </div>

                      {/* Action Menu Buttons */}
                      <div className="flex items-center gap-1 pl-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          title={isBangla ? 'উপস্থিতি ও বেতন সমন্বয় এডিট করুন' : 'Edit Attendance & Adjustments'}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenPayslip(item)}
                          title={isBangla ? 'স্যালারি স্লিপ ভিউ ও প্রিন্ট' : 'View & Print Payslip'}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTogglePaid(item.employeeId)}
                          title={item.isPaid ? (isBangla ? 'আনপেইড করুন' : 'Mark Unpaid') : (isBangla ? 'পরিশোধিত মার্ক করুন' : 'Mark Paid')}
                          className={`p-1 rounded transition-colors ${
                            item.isPaid 
                              ? 'text-emerald-600 hover:bg-emerald-50' 
                              : 'text-slate-300 hover:text-emerald-600 hover:bg-slate-100'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Table footer count */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 font-medium">
          <p>
            {isBangla 
              ? `মোট ${toBanglaNumber(filteredItems.length)} জন কর্মকর্তা/কর্মচারীর স্যালারি তালিকা প্রদর্শিত` 
              : `Showing ${filteredItems.length} records`}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>{isBangla ? 'মোট প্রদেয়:' : 'Total Net:'} <strong className="text-slate-800">{formatCurrency(cycle.items.reduce((sum, i) => sum + i.netPayable, 0), settings.currencySymbol, isBangla)}</strong></span>
          </div>
        </div>
      </div>

      {/* Bottom Action Banner exactly matching Geometric Balance design */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-900 rounded-xl p-6 text-white shadow-lg gap-4">
        <div>
          <h3 className="text-lg font-bold">
            {isBangla ? 'ব্যাংক ট্রান্সফার ও বেতন পরিশোধের জন্য প্রস্তুত' : 'Ready for Bank Transfer'}
          </h3>
          <p className="text-indigo-200 text-xs mt-1">
            {isBangla 
              ? 'চূড়ান্ত পরিশোধের আগে এমপ্লয়িদের ব্যাংক একাউন্ট ও কর্তনের বিবরণ যাচাই করে নিন। (PF/ESI মুক্ত)' 
              : 'Check employee account details before finalizing the transaction. (No PF/ESI)'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleDownloadCSV}
            className="px-5 py-2.5 bg-indigo-800 text-white rounded-lg border border-indigo-700 font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            {isBangla ? 'CSV রিপোর্ট ডাউনলোড' : 'Download CSV Report'}
          </button>
          <button
            onClick={handleDisburseAll}
            className="px-6 py-2.5 bg-white text-indigo-900 rounded-lg font-extrabold text-xs shadow-lg shadow-indigo-950/40 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            {isBangla ? 'সকল স্যালারি প্রদান করুন' : 'Disburse Salary Now'}
          </button>
        </div>
      </div>

      {/* Edit Attendance & Adjustments Modal for Single Employee */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {isBangla ? 'উপস্থিতি ও স্যালারি সমন্বয়' : 'Attendance & Salary Adjustments'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editingItem.employeeBanglaName} ({editingItem.employeeName}) • {editingItem.employeeId}
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItemEdit} className="p-6 space-y-5">
              {/* Attendance & OT */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
                  {isBangla ? '১. মাসিক উপস্থিতি ও ওভারটাইম' : '1. Attendance & Overtime'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'উপস্থিত দিন' : 'Present Days'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={cycle.workingDays}
                      value={editingItem.presentDays}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setEditingItem({
                          ...editingItem,
                          presentDays: p,
                          absentDays: Math.max(0, cycle.workingDays - p - editingItem.leaveDays)
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'অনুপস্থিত দিন (Absent)' : 'Absent Days'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={cycle.workingDays}
                      value={editingItem.absentDays}
                      onChange={(e) => {
                        const abs = Number(e.target.value);
                        setEditingItem({
                          ...editingItem,
                          absentDays: abs,
                          presentDays: Math.max(0, cycle.workingDays - abs - editingItem.leaveDays)
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'ছুটি (Leave with pay)' : 'Paid Leave'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={cycle.workingDays}
                      value={editingItem.leaveDays}
                      onChange={(e) => setEditingItem({ ...editingItem, leaveDays: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'ওভারটাইম (ঘণ্টা)' : 'OT Hours'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.overtimeHours}
                      onChange={(e) => setEditingItem({ ...editingItem, overtimeHours: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Bonus / Incentive */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
                  {isBangla ? '২. অতিরিক্ত সংযোজন (Bonus / Incentives)' : '2. Extra Earnings'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'উৎসব / বিশেষ বোনাস (Bonus)' : 'Bonus Amount'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.bonusAmount}
                      onChange={(e) => setEditingItem({ ...editingItem, bonusAmount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown (Strictly NO PF, NO ESI) */}
              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center justify-between">
                  <span>{isBangla ? '৩. কর্তনসমূহ (Deductions - No PF/ESI)' : '3. Deductions (No PF / ESI)'}</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                    PF ও ESI প্রযোজ্য নয়
                  </span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'অগ্রিম বেতন কর্তন (Advance)' : 'Advance Deduction'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.advanceSalaryDeduction}
                      onChange={(e) => setEditingItem({ ...editingItem, advanceSalaryDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-rose-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'লেট জরিমানা (Late Fine)' : 'Late Fine / Penalty'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.lateFineDeduction}
                      onChange={(e) => setEditingItem({ ...editingItem, lateFineDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-rose-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'আয়কর কর্তন (Income Tax/TDS)' : 'Income Tax / TDS'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.taxDeduction}
                      onChange={(e) => setEditingItem({ ...editingItem, taxDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-rose-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'অন্যান্য কর্তন (Other Deduction)' : 'Other Deduction'} ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingItem.otherDeduction}
                      onChange={(e) => setEditingItem({ ...editingItem, otherDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-rose-600 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBangla ? 'অন্যান্য কর্তনের কারণ / নোট' : 'Deduction Reason / Notes'}
                    </label>
                    <input
                      type="text"
                      value={editingItem.otherDeductionReason || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, otherDeductionReason: e.target.value })}
                      placeholder="e.g. Asset damage recovery"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {isBangla ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-200"
                >
                  {isBangla ? 'হিসাব আপডেট করুন' : 'Update & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
