import React from 'react';
import { Printer, Download, X, Building2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { PayrollItem, PayrollCycle, CompanySettings } from '../types/payroll';
import { formatCurrency, numberToEnglishWords } from '../utils/numberToWords';

interface PayslipModalProps {
  item: PayrollItem;
  cycle: PayrollCycle;
  settings: CompanySettings;
  isBangla?: boolean;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  item,
  cycle,
  settings,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const englishAmountInWords = numberToEnglishWords(item.netPayable);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Action Bar (Hidden on Print) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Salary Voucher & Compensation Statement
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Payslip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Payslip Container */}
        <div className="p-8 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 print:p-6 print:m-0">
          {/* Company Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">
                    FP
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {settings.companyName}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {settings.address} • Phone: {settings.phone} • Email: {settings.email}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-black uppercase text-slate-800 tracking-wider">
                  PAYSLIP / SALARY VOUCHER
                </span>
                <p className="text-xs font-bold text-indigo-900 mt-1 font-mono">
                  Period: {cycle.month} {cycle.year}
                </p>
              </div>
            </div>
          </div>

          {/* Employee & Payment Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-6">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Employee Name</span>
              <span className="font-bold text-slate-900 text-sm">{item.employeeName}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Employee ID</span>
              <span className="font-mono font-bold text-slate-900">{item.employeeId}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Designation</span>
              <span className="font-semibold text-slate-800">{item.designation}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
              <span className="font-semibold text-slate-800">{item.department}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Working Days</span>
              <span className="font-mono font-bold text-slate-800">{item.workingDays} Days</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Days Worked / Present</span>
              <span className="font-mono font-bold text-emerald-700">{item.presentDays} Days</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Disbursement Mode</span>
              <span className="font-semibold text-slate-800">{item.paymentMethod}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Account / Reference</span>
              <span className="font-mono font-bold text-slate-900 truncate block">
                {item.bankName !== 'N/A' ? `${item.bankName} (${item.accountNumber})` : item.accountNumber}
              </span>
            </div>
          </div>

          {/* 2-Column Earnings & Deductions Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex justify-between">
                <span>Earnings / Allowances</span>
                <span>Amount ({settings.currencySymbol})</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(item.basicSalary, '')}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance</span>
                  <span className="font-mono text-slate-800">{formatCurrency(item.houseRentAllowance, '')}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Medical Allowance</span>
                  <span className="font-mono text-slate-800">{formatCurrency(item.medicalAllowance, '')}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Conveyance / Transport</span>
                  <span className="font-mono text-slate-800">{formatCurrency(item.conveyanceAllowance, '')}</span>
                </div>
                {item.bonusAmount > 0 && (
                  <div className="px-4 py-2.5 flex justify-between bg-indigo-50/50">
                    <span className="text-indigo-800 font-semibold">Special / Performance Bonus</span>
                    <span className="font-mono font-bold text-indigo-900">+{formatCurrency(item.bonusAmount, '')}</span>
                  </div>
                )}
                {item.overtimeAmount > 0 && (
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-600">Overtime Pay ({item.overtimeHours} hrs)</span>
                    <span className="font-mono text-slate-800">+{formatCurrency(item.overtimeAmount, '')}</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
                <span>Total Gross Earnings (A):</span>
                <span className="font-mono text-sm">{formatCurrency(item.totalGrossSalary, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* Deductions Column (Strictly No PF/ESI) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-rose-800 uppercase tracking-wider flex justify-between">
                  <span>Deductions (No PF / ESI)</span>
                  <span>Amount ({settings.currencySymbol})</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-600">Absence Deduction ({item.absentDays} days)</span>
                    <span className="font-mono text-rose-600">{item.absenceDeduction > 0 ? `-${formatCurrency(item.absenceDeduction, '')}` : '0.00'}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-600">Advance Salary Adjustment</span>
                    <span className="font-mono text-rose-600">{item.advanceSalaryDeduction > 0 ? `-${formatCurrency(item.advanceSalaryDeduction, '')}` : '0.00'}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-600">Late Attendance Penalty</span>
                    <span className="font-mono text-rose-600">{item.lateFineDeduction > 0 ? `-${formatCurrency(item.lateFineDeduction, '')}` : '0.00'}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-600">Withholding Tax / TDS</span>
                    <span className="font-mono text-rose-600">{item.taxDeduction > 0 ? `-${formatCurrency(item.taxDeduction, '')}` : '0.00'}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between bg-emerald-50/40">
                    <span className="text-emerald-800 font-semibold">Provident Fund (PF)</span>
                    <span className="font-mono text-slate-500 font-semibold">0.00 (Exempt)</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between bg-emerald-50/40">
                    <span className="text-emerald-800 font-semibold">Employee State Insurance (ESI)</span>
                    <span className="font-mono text-slate-500 font-semibold">0.00 (Exempt)</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between text-xs font-bold text-rose-700">
                <span>Total Deductions (B):</span>
                <span className="font-mono text-sm">-{formatCurrency(item.totalDeductions, settings.currencySymbol)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="p-4 bg-indigo-950 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                Net Disbursed Compensation (A - B)
              </span>
              <span className="text-xs text-indigo-200 italic mt-0.5 block">
                Amount in Words: <strong className="text-white not-italic">{englishAmountInWords}</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                {formatCurrency(item.netPayable, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Non-PF Compliance Policy Note */}
          <p className="text-[11px] text-slate-500 italic mb-12 text-center">
            * {settings.pfEsiNote}
          </p>

          {/* 3 Executive Signature Blocks */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4">
            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
                {item.employeeName}
              </div>
              <div className="text-slate-500 text-[11px]">Employee Signature</div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
                {settings.accountantName}
              </div>
              <div className="text-slate-500 text-[11px]">Prepared by (Chief Accountant)</div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
                {settings.approverName}
              </div>
              <div className="text-slate-500 text-[11px]">Approved by (Managing Director)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
