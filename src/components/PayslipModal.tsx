import React from 'react';
import { Printer, Download, X, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PayrollItem, PayrollCycle, CompanySettings } from '../types/payroll';
import { formatCurrency, numberToBanglaWords, numberToEnglishWords, toBanglaNumber } from '../utils/numberToWords';

interface PayslipModalProps {
  item: PayrollItem;
  cycle: PayrollCycle;
  settings: CompanySettings;
  isBangla: boolean;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  item,
  cycle,
  settings,
  isBangla,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const banglaWords = numberToBanglaWords(item.netPayable);
  const englishWords = numberToEnglishWords(item.netPayable);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-800 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-bold">
              {isBangla ? 'অফিসিয়াল স্যালারি স্লিপ (Official Payslip Voucher)' : 'Official Payslip Voucher'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {isBangla ? 'প্রিন্ট / PDF সেভ করুন' : 'Print / Save PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 print:p-6 print:m-0 print:border-none">
          {/* Company Header */}
          <div className="border-b-2 border-indigo-600 pb-5 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center text-white font-bold">
                <div className="w-4 h-4 border-2 border-white rounded-xs rotate-45"></div>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {settings.companyBanglaName || settings.companyName}
              </h1>
            </div>
            <p className="text-sm font-bold text-slate-700">{settings.companyName}</p>
            <p className="text-xs text-slate-500 mt-0.5">{settings.addressBangla || settings.address} • ফোন: {settings.phone} • {settings.email}</p>
            
            <div className="mt-4 inline-block px-4 py-1 bg-slate-100 border border-slate-300 rounded-full font-bold text-xs text-indigo-900 uppercase tracking-wider">
              {isBangla ? `মাসিক বেতন বিবরণী - ${cycle.banglaMonth} ${toBanglaNumber(cycle.year)}` : `Salary Slip for the month of ${cycle.month} ${cycle.year}`}
            </div>
          </div>

          {/* Employee & Payment Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'এমপ্লয়ি আইডি' : 'Employee ID'}
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">{item.employeeId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'এমপ্লয়ির নাম' : 'Employee Name'}
              </span>
              <span className="font-bold text-slate-900">{item.employeeBanglaName}</span>
              <span className="text-slate-500 block text-[11px]">({item.employeeName})</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'পদবী ও বিভাগ' : 'Designation & Dept'}
              </span>
              <span className="font-bold text-slate-800">{item.designation}</span>
              <span className="text-slate-500 block text-[11px]">{item.department}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'কার্যদিবস ও উপস্থিতি' : 'Days & Attendance'}
              </span>
              <span className="font-semibold text-slate-800">
                {isBangla ? `মোট কার্যদিবস: ${toBanglaNumber(item.workingDays)} দিন` : `Working Days: ${item.workingDays}`}
              </span>
              <span className="text-emerald-700 block text-[11px] font-bold">
                {isBangla ? `উপস্থিত: ${toBanglaNumber(item.presentDays)} দিন | অনুপস্থিত: ${toBanglaNumber(item.absentDays)} দিন` : `Present: ${item.presentDays}d | Abs: ${item.absentDays}d`}
              </span>
            </div>

            <div className="sm:col-span-2 border-t border-slate-200 pt-2">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'পেমেন্ট মেথড ও ব্যাংক অ্যাকাউন্ট' : 'Payment Method & Bank'}
              </span>
              <span className="font-semibold text-slate-800 font-mono">
                {item.paymentMethod} • {item.bankName}
              </span>
            </div>
            <div className="sm:col-span-2 border-t border-slate-200 pt-2">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                {isBangla ? 'অ্যাকাউন্ট নম্বর / ট্রানজেকশন আইডি' : 'Account / Ref No.'}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {item.accountNumber} {item.transactionRef ? `(${item.transactionRef})` : ''}
              </span>
            </div>
          </div>

          {/* Dual Column: Earnings vs Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Left: Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50/80 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                <span>{isBangla ? 'প্রাপ্তিসমূহ / উপার্জন (Earnings)' : 'Earnings Breakdown'}</span>
                <span>{settings.currencySymbol}</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-slate-700">{isBangla ? 'মূল বেতন (Basic Salary)' : 'Basic Salary'}</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(item.basicSalary, '', isBangla)}</span>
                </div>
                {item.houseRentAllowance > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'বাড়ি ভাড়া ভাতা (House Rent)' : 'House Rent Allowance'}</span>
                    <span className="font-mono text-slate-800">{formatCurrency(item.houseRentAllowance, '', isBangla)}</span>
                  </div>
                )}
                {item.medicalAllowance > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'চিকিৎসা ভাতা (Medical)' : 'Medical Allowance'}</span>
                    <span className="font-mono text-slate-800">{formatCurrency(item.medicalAllowance, '', isBangla)}</span>
                  </div>
                )}
                {item.conveyanceAllowance > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'যাতায়াত ভাতা (Conveyance)' : 'Conveyance Allowance'}</span>
                    <span className="font-mono text-slate-800">{formatCurrency(item.conveyanceAllowance, '', isBangla)}</span>
                  </div>
                )}
                {item.foodAllowance > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'খাবার ভাতা (Food)' : 'Food Allowance'}</span>
                    <span className="font-mono text-slate-800">{formatCurrency(item.foodAllowance, '', isBangla)}</span>
                  </div>
                )}
                {item.specialAllowance > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'বিশেষ ভাতা (Special)' : 'Special Allowance'}</span>
                    <span className="font-mono text-slate-800">{formatCurrency(item.specialAllowance, '', isBangla)}</span>
                  </div>
                )}
                {item.bonusAmount > 0 && (
                  <div className="px-4 py-2 flex justify-between bg-indigo-50/50">
                    <span className="font-bold text-indigo-900">{isBangla ? 'বোনাস / ইনসেন্টিভ (Bonus)' : 'Bonus / Incentive'}</span>
                    <span className="font-mono font-bold text-indigo-900">+{formatCurrency(item.bonusAmount, '', isBangla)}</span>
                  </div>
                )}
                {item.overtimeAmount > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? `ওভারটাইম (${toBanglaNumber(item.overtimeHours)} ঘণ্টা)` : `Overtime (${item.overtimeHours} hrs)`}</span>
                    <span className="font-mono text-slate-800">+{formatCurrency(item.overtimeAmount, '', isBangla)}</span>
                  </div>
                )}
                <div className="px-4 py-3 bg-slate-50 flex justify-between font-bold text-slate-900 border-t border-slate-200">
                  <span>{isBangla ? 'সর্বমোট গ্রস স্যালারি (Gross)' : 'Total Gross Earnings'}</span>
                  <span className="font-mono text-sm">{formatCurrency(item.totalGrossSalary, settings.currencySymbol, isBangla)}</span>
                </div>
              </div>
            </div>

            {/* Right: Deductions (PF & ESI excluded) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-50/80 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center justify-between">
                <span>{isBangla ? 'কর্তনসমূহ (Deductions)' : 'Deductions (No PF/ESI)'}</span>
                <span>{settings.currencySymbol}</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-slate-600">{isBangla ? 'অনুপস্থিতি কর্তন (Absence)' : 'Absence Deduction'}</span>
                  <span className="font-mono text-rose-600">{item.absenceDeduction > 0 ? `-${formatCurrency(item.absenceDeduction, '', isBangla)}` : '০.০০'}</span>
                </div>
                {item.advanceSalaryDeduction > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'অগ্রিম বেতন কর্তন (Advance)' : 'Advance Deduction'}</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(item.advanceSalaryDeduction, '', isBangla)}</span>
                  </div>
                )}
                {item.loanEmiDeduction > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'লোন কিস্তি (Loan EMI)' : 'Loan EMI'}</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(item.loanEmiDeduction, '', isBangla)}</span>
                  </div>
                )}
                {item.lateFineDeduction > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'লেট জরিমানা (Late Fine)' : 'Late Penalty'}</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(item.lateFineDeduction, '', isBangla)}</span>
                  </div>
                )}
                {item.taxDeduction > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? 'আয়কর (Income Tax / TDS)' : 'Income Tax / TDS'}</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(item.taxDeduction, '', isBangla)}</span>
                  </div>
                )}
                {item.otherDeduction > 0 && (
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{isBangla ? `অন্যান্য (${item.otherDeductionReason || 'অন্যান্য'})` : `Other (${item.otherDeductionReason || 'Other'})`}</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(item.otherDeduction, '', isBangla)}</span>
                  </div>
                )}
                <div className="px-4 py-2 flex justify-between text-slate-400 italic">
                  <span>Provident Fund (PF):</span>
                  <span>{isBangla ? 'প্রযোজ্য নয় (N/A)' : 'N/A'}</span>
                </div>
                <div className="px-4 py-2 flex justify-between text-slate-400 italic">
                  <span>ESI Contribution:</span>
                  <span>{isBangla ? 'প্রযোজ্য নয় (N/A)' : 'N/A'}</span>
                </div>
                <div className="px-4 py-3 bg-slate-50 flex justify-between font-bold text-rose-700 border-t border-slate-200">
                  <span>{isBangla ? 'সর্বমোট কর্তন (Total Deduct)' : 'Total Deductions'}</span>
                  <span className="font-mono text-sm">-{formatCurrency(item.totalDeductions, settings.currencySymbol, isBangla)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Total Net Payable Box */}
          <div className="p-5 bg-indigo-900 text-white rounded-xl mb-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
                  {isBangla ? 'সর্বমোট প্রদেয় নিট বেতন (Net Payable Amount)' : 'Net Payable Salary'}
                </p>
                <p className="text-sm font-semibold text-indigo-100 mt-1">
                  {isBangla ? 'কথায় (In Words): ' : 'In Words: '}
                  <span className="italic font-bold text-amber-300">
                    {isBangla ? banglaWords : englishWords}
                  </span>
                </p>
                {isBangla && (
                  <p className="text-xs text-indigo-300 italic font-mono mt-0.5">
                    ({englishWords})
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-black font-mono tracking-tight text-white">
                  {formatCurrency(item.netPayable, settings.currencySymbol, isBangla)}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-indigo-200 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBangla ? 'হিসাব সম্পন্ন ও সঠিক' : 'Verified & Computed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Footnote about PF & ESI */}
          <p className="text-[11px] text-slate-500 italic text-center mb-10 border-t border-slate-200 pt-3">
            * {settings.pfEsiNote}
          </p>

          {/* 3-Column Signatures Block */}
          <div className="grid grid-cols-3 gap-8 pt-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-1.5 font-bold text-slate-800">
                {item.employeeBanglaName}
              </div>
              <div className="text-slate-500 text-[11px]">
                {isBangla ? 'কর্মচারীর স্বাক্ষর' : "Employee's Signature"}
              </div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-1.5 font-bold text-slate-800">
                {settings.accountantName}
              </div>
              <div className="text-slate-500 text-[11px]">
                {settings.accountantTitle}
              </div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-4/5 mx-auto pt-1.5 font-bold text-slate-800">
                {settings.approverName}
              </div>
              <div className="text-slate-500 text-[11px]">
                {settings.approverTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
