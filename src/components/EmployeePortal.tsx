import React from 'react';
import { 
  User, 
  CreditCard, 
  FileText, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  HandCoins 
} from 'lucide-react';
import { AuthUser } from '../types/auth';
import { Employee, PayrollCycle, PayrollItem, AdvanceLoanRecord, CompanySettings } from '../types/payroll';
import { formatCurrency } from '../utils/numberToWords';

interface EmployeePortalProps {
  currentUser: AuthUser;
  employee: Employee;
  cycles: PayrollCycle[];
  advances: AdvanceLoanRecord[];
  settings: CompanySettings;
  isBangla?: boolean;
  onOpenPayslip: (item: PayrollItem, cycle: PayrollCycle) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  currentUser,
  employee,
  cycles,
  advances,
  settings,
  onOpenPayslip
}) => {
  const myPayrollHistory = cycles.map(cycle => {
    const item = cycle.items.find(i => i.employeeId === employee.id);
    return {
      cycle,
      item
    };
  }).filter(h => h.item !== undefined) as { cycle: PayrollCycle; item: PayrollItem }[];

  const myAdvances = advances.filter(a => a.employeeId === employee.id);
  const totalAllowances = employee.houseRentAllowance + employee.medicalAllowance + employee.conveyanceAllowance + employee.foodAllowance + employee.specialAllowance;
  const totalGross = employee.basicSalary + totalAllowances;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-black">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {employee.status}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {employee.designation} • {employee.department} • <span className="font-mono font-bold text-white">{employee.id}</span>
            </p>
          </div>
        </div>

        <div className="text-right bg-white/10 px-5 py-3 rounded-xl border border-white/10">
          <span className="text-[11px] text-slate-300 uppercase font-bold tracking-wider block">
            Monthly Agreed Gross Salary
          </span>
          <span className="text-2xl font-black font-mono text-white">
            {formatCurrency(totalGross, settings.currencySymbol)}
          </span>
          <span className="text-[10px] text-emerald-300 block mt-0.5 font-semibold">
            ✓ No PF/ESI Deductions Applied
          </span>
        </div>
      </div>

      {/* Salary Structure Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          My Compensation & Allowance Structure
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Basic Salary</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {formatCurrency(employee.basicSalary, settings.currencySymbol)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">House Rent</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {formatCurrency(employee.houseRentAllowance, settings.currencySymbol)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Medical Allowance</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {formatCurrency(employee.medicalAllowance, settings.currencySymbol)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Conveyance / Travel</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {formatCurrency(employee.conveyanceAllowance, settings.currencySymbol)}
            </span>
          </div>
        </div>

        {/* Bank details */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            <span className="font-semibold">Payment Channel: </span>
            <span className="font-mono font-bold text-slate-900">{employee.paymentMethod}</span>
            {employee.bankName !== 'N/A' && <span> • {employee.bankName}</span>}
          </div>
          <div>
            <span className="font-semibold">Account Number: </span>
            <span className="font-mono font-bold text-slate-900">{employee.accountNumber}</span>
          </div>
        </div>
      </div>

      {/* Payslip History Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            My Monthly Payslips & Salary Statements
          </h3>
          <span className="text-xs text-slate-500">
            {myPayrollHistory.length} statements on file
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Payroll Cycle</th>
                <th className="px-4 py-3 text-center">Attendance</th>
                <th className="px-4 py-3 text-right">Gross Total</th>
                <th className="px-4 py-3 text-right">Deductions (No PF)</th>
                <th className="px-4 py-3 text-right">Net Compensation</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myPayrollHistory.map(({ cycle, item }) => (
                <tr key={cycle.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{cycle.month} {cycle.year}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {item.presentDays}/{item.workingDays} days
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                    {formatCurrency(item.totalGrossSalary, settings.currencySymbol)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600 font-semibold">
                    {item.totalDeductions > 0 ? `-${formatCurrency(item.totalDeductions, settings.currencySymbol)}` : '0.00'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700 text-sm">
                    {formatCurrency(item.netPayable, settings.currencySymbol)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.isPaid ? 'DISBURSED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onOpenPayslip(item, cycle)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advance / Loan Status if any */}
      {myAdvances.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <HandCoins className="w-4 h-4" />
            My Salary Advances & Loan Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {myAdvances.map(adv => (
              <div key={adv.id} className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">{adv.reason}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    {adv.status}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-slate-600 mt-2">
                  <span>Total Amount: {formatCurrency(adv.amount, settings.currencySymbol)}</span>
                  <span>Monthly EMI: {formatCurrency(adv.monthlyDeduction, settings.currencySymbol)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200 flex justify-between font-bold text-amber-900 font-mono">
                  <span>Remaining Balance:</span>
                  <span>{formatCurrency(adv.remainingBalance, settings.currencySymbol)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
