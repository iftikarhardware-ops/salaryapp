import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Printer, 
  FileSpreadsheet, 
  Landmark, 
  Search, 
  Check, 
  Sparkles, 
  Building2, 
  DollarSign, 
  CreditCard,
  Filter,
  ArrowUpDown,
  Download,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PayrollCycle, PayrollItem, Employee, CompanySettings } from '../types/payroll';
import { formatCurrency } from '../utils/numberToWords';
import { calculatePayrollItem } from '../utils/calculations';

interface PayrollManagerProps {
  cycle: PayrollCycle;
  employees: Employee[];
  settings: CompanySettings;
  isBangla?: boolean;
  onUpdateCycle: (updatedCycle: PayrollCycle) => void;
  onOpenPayslip: (item: PayrollItem) => void;
  onOpenBankAdvice: () => void;
  onOpenMasterSheet: () => void;
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  cycle,
  employees,
  settings,
  onUpdateCycle,
  onOpenPayslip,
  onOpenBankAdvice,
  onOpenMasterSheet
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Edit State
  const [editPresent, setEditPresent] = useState<number>(26);
  const [editAbsent, setEditAbsent] = useState<number>(0);
  const [editBonus, setEditBonus] = useState<number>(0);
  const [editOTHours, setEditOTHours] = useState<number>(0);
  const [editAdvance, setEditAdvance] = useState<number>(0);
  const [editLateFine, setEditLateFine] = useState<number>(0);
  const [editTax, setEditTax] = useState<number>(0);

  const departments = Array.from(new Set(cycle.items.map(i => i.department)));

  const handleStartEdit = (item: PayrollItem) => {
    setEditingItemId(item.employeeId);
    setEditPresent(item.presentDays);
    setEditAbsent(item.absentDays);
    setEditBonus(item.bonusAmount);
    setEditOTHours(item.overtimeHours);
    setEditAdvance(item.advanceSalaryDeduction);
    setEditLateFine(item.lateFineDeduction);
    setEditTax(item.taxDeduction);
  };

  const handleSaveEdit = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const existingItem = cycle.items.find(i => i.employeeId === employeeId);

    const recalculatedItem = calculatePayrollItem(
      employee,
      cycle.workingDays,
      editPresent,
      editAbsent,
      existingItem?.leaveDays || 0,
      editOTHours,
      editBonus,
      editAdvance,
      existingItem?.loanDeduction || 0,
      editLateFine,
      editTax,
      existingItem?.otherDeduction || 0,
      existingItem?.remarks || '',
      { isPaid: existingItem?.isPaid || false }
    );

    const updatedItems = cycle.items.map(i => i.employeeId === employeeId ? recalculatedItem : i);
    onUpdateCycle({
      ...cycle,
      items: updatedItems
    });
    setEditingItemId(null);
  };

  const handleTogglePaid = (employeeId: string) => {
    const updatedItems = cycle.items.map(item => {
      if (item.employeeId === employeeId) {
        const nextPaid = !item.isPaid;
        return {
          ...item,
          isPaid: nextPaid,
          paidAt: nextPaid ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return item;
    });

    onUpdateCycle({
      ...cycle,
      items: updatedItems
    });
  };

  const handleMarkAllPaid = () => {
    const updatedItems = cycle.items.map(item => ({
      ...item,
      isPaid: true,
      paidAt: new Date().toISOString().split('T')[0]
    }));

    onUpdateCycle({
      ...cycle,
      status: 'Paid',
      items: updatedItems
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleAdvanceStatus = (nextStatus: PayrollCycle['status']) => {
    onUpdateCycle({
      ...cycle,
      status: nextStatus,
      verifiedAt: nextStatus === 'Verified' ? new Date().toISOString().split('T')[0] : cycle.verifiedAt,
      approvedAt: nextStatus === 'Approved' ? new Date().toISOString().split('T')[0] : cycle.approvedAt
    });
  };

  // Filter Items
  const filteredItems = cycle.items.filter(item => {
    const matchSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = departmentFilter === 'ALL' || item.department === departmentFilter;
    const matchPayment = paymentFilter === 'ALL' || item.paymentMethod === paymentFilter;
    return matchSearch && matchDept && matchPayment;
  });

  return (
    <div className="space-y-6">
      {/* Cycle Stage Workflow Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                {cycle.month} {cycle.year} Payroll Register
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                ({cycle.workingDays} Scheduled Days)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Review attendance, adjustments, allowances & generate disbursement vouchers.
            </p>
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {cycle.status === 'Draft' && (
            <button
              onClick={() => handleAdvanceStatus('Verified')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-4 h-4 text-amber-600" />
              <span>Verify by Accounts</span>
            </button>
          )}

          {cycle.status === 'Verified' && (
            <button
              onClick={() => handleAdvanceStatus('Approved')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Executive Approval</span>
            </button>
          )}

          {cycle.status !== 'Paid' ? (
            <button
              onClick={handleMarkAllPaid}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Disburse & Mark All as Paid</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payroll Fully Disbursed</span>
            </span>
          )}

          <button
            onClick={onOpenBankAdvice}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>Bank Advice</span>
          </button>

          <button
            onClick={onOpenMasterSheet}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Master Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by employee name, ID, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
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

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter by payment channel"
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="bKash">bKash</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Employee Details</th>
                <th className="px-4 py-3.5 text-center">Attendance</th>
                <th className="px-4 py-3.5 text-right">Basic & Allowances</th>
                <th className="px-4 py-3.5 text-right">Gross Total</th>
                <th className="px-4 py-3.5 text-right">Deductions (No PF)</th>
                <th className="px-4 py-3.5 text-right font-black">Net Payable</th>
                <th className="px-4 py-3.5">Channel / Account</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No payroll entries found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isEditing = editingItemId === item.employeeId;

                  return (
                    <tr key={item.employeeId} className={`hover:bg-slate-50/80 transition-colors ${item.isPaid ? 'bg-emerald-50/20' : ''}`}>
                      {/* Employee Info */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">
                          {item.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.employeeId} • {item.designation}
                        </div>
                      </td>

                      {/* Attendance (Present / Absent) */}
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 block">P</span>
                              <input
                                type="number"
                                min="0"
                                max={cycle.workingDays}
                                value={editPresent}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setEditPresent(val);
                                  setEditAbsent(Math.max(0, cycle.workingDays - val));
                                }}
                                className="w-12 px-1 py-1 border border-slate-300 rounded font-mono text-center text-xs"
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-rose-500 block">A</span>
                              <input
                                type="number"
                                min="0"
                                max={cycle.workingDays}
                                value={editAbsent}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setEditAbsent(val);
                                  setEditPresent(Math.max(0, cycle.workingDays - val));
                                }}
                                className="w-12 px-1 py-1 border border-slate-300 rounded font-mono text-center text-xs text-rose-600"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="font-mono font-bold text-slate-800">{item.presentDays}</span>
                            <span className="text-slate-400 text-[10px]"> / {item.workingDays}d</span>
                            {item.absentDays > 0 && (
                              <span className="block text-[10px] text-rose-600 font-semibold font-mono">
                                ({item.absentDays}d Unpaid)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Basic & Structure */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-slate-900 font-medium">
                          {formatCurrency(item.basicSalary, settings.currencySymbol)}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          +{formatCurrency(item.totalAllowances, settings.currencySymbol)} allow
                        </span>
                      </td>

                      {/* Total Gross */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {isEditing ? (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Bonus / OT:</span>
                            <input
                              type="number"
                              min="0"
                              value={editBonus}
                              placeholder="Bonus"
                              onChange={(e) => setEditBonus(Number(e.target.value))}
                              className="w-16 px-1 py-1 border border-slate-300 rounded font-mono text-right text-xs"
                            />
                          </div>
                        ) : (
                          <div>
                            <span>{formatCurrency(item.totalGrossSalary, settings.currencySymbol)}</span>
                            {item.bonusAmount > 0 && (
                              <span className="block text-[10px] text-indigo-600 font-semibold">
                                +{formatCurrency(item.bonusAmount, settings.currencySymbol)} bonus
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Deductions (Strictly No PF/ESI) */}
                      <td className="px-4 py-3 text-right font-mono">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="number"
                              min="0"
                              value={editAdvance}
                              placeholder="Advance"
                              onChange={(e) => setEditAdvance(Number(e.target.value))}
                              className="w-16 px-1 py-0.5 border border-slate-300 rounded font-mono text-right text-xs"
                            />
                            <input
                              type="number"
                              min="0"
                              value={editLateFine}
                              placeholder="Late fine"
                              onChange={(e) => setEditLateFine(Number(e.target.value))}
                              className="w-16 px-1 py-0.5 border border-slate-300 rounded font-mono text-right text-xs text-rose-600"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className={item.totalDeductions > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                              {item.totalDeductions > 0 ? `-${formatCurrency(item.totalDeductions, settings.currencySymbol)}` : '0.00'}
                            </span>
                            {item.advanceSalaryDeduction > 0 && (
                              <span className="block text-[10px] text-amber-700">
                                (Adv: -{item.advanceSalaryDeduction})
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Net Payable */}
                      <td className="px-4 py-3 text-right font-mono font-black text-indigo-900 text-sm">
                        {formatCurrency(item.netPayable, settings.currencySymbol)}
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{item.paymentMethod}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                          {item.bankName !== 'N/A' ? `${item.bankName} (${item.accountNumber})` : item.accountNumber}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePaid(item.employeeId)}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            item.isPaid 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {item.isPaid ? 'PAID' : 'PENDING'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(item.employeeId)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold"
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onOpenPayslip(item)}
                                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="View & Print Official Payslip"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </>
                          )}
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
    </div>
  );
};
