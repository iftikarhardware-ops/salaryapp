import React from 'react';
import { Printer, Download, FileSpreadsheet, ArrowLeft, ShieldCheck } from 'lucide-react';
import { PayrollCycle, CompanySettings } from '../types/payroll';
import { formatCurrency } from '../utils/numberToWords';

interface MasterSalarySheetProps {
  cycle: PayrollCycle;
  settings: CompanySettings;
  isBangla?: boolean;
  onBackToPayroll: () => void;
}

export const MasterSalarySheet: React.FC<MasterSalarySheetProps> = ({
  cycle,
  settings,
  onBackToPayroll
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = [
      'SL',
      'Employee ID',
      'Employee Name',
      'Designation',
      'Department',
      'Present Days',
      'Absent Days',
      'Basic Salary',
      'House Rent',
      'Medical',
      'Conveyance',
      'Bonus',
      'Overtime',
      'Total Gross',
      'Absence Deduction',
      'Advance Deduction',
      'Late Fine',
      'Tax / TDS',
      'Total Deductions (No PF/ESI)',
      'Net Payable',
      'Payment Mode',
      'Account Details',
      'Status'
    ];

    const rows = cycle.items.map((item, idx) => [
      idx + 1,
      item.employeeId,
      `"${item.employeeName}"`,
      `"${item.designation}"`,
      `"${item.department}"`,
      item.presentDays,
      item.absentDays,
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
      item.isPaid ? 'PAID' : 'PENDING'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Salary_Register_${cycle.month}_${cycle.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary totals
  const totalBasic = cycle.items.reduce((sum, i) => sum + i.basicSalary, 0);
  const totalHouseRent = cycle.items.reduce((sum, i) => sum + i.houseRentAllowance, 0);
  const totalMedical = cycle.items.reduce((sum, i) => sum + i.medicalAllowance, 0);
  const totalConveyance = cycle.items.reduce((sum, i) => sum + i.conveyanceAllowance, 0);
  const totalBonus = cycle.items.reduce((sum, i) => sum + i.bonusAmount, 0);
  const totalOT = cycle.items.reduce((sum, i) => sum + i.overtimeAmount, 0);
  const totalGross = cycle.items.reduce((sum, i) => sum + i.totalGrossSalary, 0);
  const totalAbsenceDed = cycle.items.reduce((sum, i) => sum + i.absenceDeduction, 0);
  const totalAdvanceDed = cycle.items.reduce((sum, i) => sum + i.advanceSalaryDeduction, 0);
  const totalLateFine = cycle.items.reduce((sum, i) => sum + i.lateFineDeduction, 0);
  const totalTax = cycle.items.reduce((sum, i) => sum + i.taxDeduction, 0);
  const totalDeductions = cycle.items.reduce((sum, i) => sum + i.totalDeductions, 0);
  const totalNet = cycle.items.reduce((sum, i) => sum + i.netPayable, 0);

  return (
    <div className="space-y-6">
      {/* Control Top Bar (Hidden on print) */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPayroll}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Master Payroll Register & Comprehensive Audit Sheet
            </h2>
            <p className="text-xs text-slate-500">
              {cycle.month} {cycle.year} • Full multi-column earnings, non-PF deductions & payment schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Master Register</span>
          </button>
        </div>
      </div>

      {/* Printable Master Register Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-8 overflow-x-auto print:border-none print:p-0">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
          <h1 className="text-xl font-black text-slate-900">{settings.companyName}</h1>
          <p className="text-xs text-slate-500">{settings.address} • {settings.phone}</p>
          
          <div className="mt-2 text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
            MASTER PAYROLL REGISTER — {cycle.month.toUpperCase()} {cycle.year} (WORKING DAYS: {cycle.workingDays})
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            * Strictly Non-Contributory Payroll Structure (PF & ESI Exempted)
          </p>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="border border-slate-300 p-2 text-center" rowSpan={2}>#</th>
                <th className="border border-slate-300 p-2" rowSpan={2}>Employee & ID</th>
                <th className="border border-slate-300 p-2" rowSpan={2}>Designation</th>
                <th className="border border-slate-300 p-2 text-center" colSpan={2}>Attendance</th>
                <th className="border border-slate-300 p-2 text-center bg-emerald-50/50" colSpan={6}>Gross Earnings & Allowances</th>
                <th className="border border-slate-300 p-2 text-right bg-emerald-100/50" rowSpan={2}>Total Gross</th>
                <th className="border border-slate-300 p-2 text-center bg-rose-50/50" colSpan={4}>Deductions (No PF/ESI)</th>
                <th className="border border-slate-300 p-2 text-right bg-rose-100/50" rowSpan={2}>Total Ded</th>
                <th className="border border-slate-300 p-2 text-right bg-indigo-50 font-black" rowSpan={2}>Net Payable</th>
                <th className="border border-slate-300 p-2" rowSpan={2}>Disbursement</th>
                <th className="border border-slate-300 p-2 text-center print:table-cell hidden" rowSpan={2}>Signature</th>
              </tr>
              <tr className="bg-slate-50 text-slate-600 text-[10px] font-semibold border-b border-slate-300">
                <th className="border border-slate-300 p-1.5 text-center">Present</th>
                <th className="border border-slate-300 p-1.5 text-center text-rose-600">Absent</th>
                <th className="border border-slate-300 p-1.5 text-right">Basic</th>
                <th className="border border-slate-300 p-1.5 text-right">Rent</th>
                <th className="border border-slate-300 p-1.5 text-right">Med</th>
                <th className="border border-slate-300 p-1.5 text-right">Conv</th>
                <th className="border border-slate-300 p-1.5 text-right">Bonus</th>
                <th className="border border-slate-300 p-1.5 text-right">OT</th>
                <th className="border border-slate-300 p-1.5 text-right text-rose-600">Absence</th>
                <th className="border border-slate-300 p-1.5 text-right text-rose-600">Advance</th>
                <th className="border border-slate-300 p-1.5 text-right text-rose-600">Fine</th>
                <th className="border border-slate-300 p-1.5 text-right text-rose-600">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cycle.items.map((item, idx) => (
                <tr key={item.employeeId} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-1.5 font-semibold text-slate-900 whitespace-nowrap">
                    <div>{item.employeeName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.employeeId}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-slate-700 whitespace-nowrap">
                    <div>{item.designation}</div>
                    <span className="text-[10px] text-slate-400">{item.department}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-slate-800">
                    {item.presentDays}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-rose-600 font-bold">
                    {item.absentDays}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(item.basicSalary, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-slate-700">
                    {formatCurrency(item.houseRentAllowance, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-slate-700">
                    {formatCurrency(item.medicalAllowance, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-slate-700">
                    {formatCurrency(item.conveyanceAllowance, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-indigo-700 font-bold">
                    {item.bonusAmount > 0 ? formatCurrency(item.bonusAmount, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-slate-700">
                    {item.overtimeAmount > 0 ? formatCurrency(item.overtimeAmount, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-slate-900 bg-emerald-50/40">
                    {formatCurrency(item.totalGrossSalary, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-rose-600">
                    {item.absenceDeduction > 0 ? formatCurrency(item.absenceDeduction, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-rose-600">
                    {item.advanceSalaryDeduction > 0 ? formatCurrency(item.advanceSalaryDeduction, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-rose-600">
                    {item.lateFineDeduction > 0 ? formatCurrency(item.lateFineDeduction, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono text-rose-600">
                    {item.taxDeduction > 0 ? formatCurrency(item.taxDeduction, '') : '-'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-rose-700 bg-rose-50/40">
                    {formatCurrency(item.totalDeductions, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-black text-indigo-900 bg-indigo-50/60 text-xs">
                    {formatCurrency(item.netPayable, '')}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                    <div>{item.paymentMethod}</div>
                    <span className="font-mono text-slate-400">{item.accountNumber}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center print:table-cell hidden h-8"></td>
                </tr>
              ))}

              {/* Grand Total Footer */}
              <tr className="bg-slate-200 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={5} className="border border-slate-300 p-2 text-right uppercase">
                  Grand Total Summary:
                </td>
                <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(totalBasic, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(totalHouseRent, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(totalMedical, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(totalConveyance, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-indigo-900">{formatCurrency(totalBonus, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(totalOT, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono font-bold bg-emerald-100/60">{formatCurrency(totalGross, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-rose-700">{formatCurrency(totalAbsenceDed, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-rose-700">{formatCurrency(totalAdvanceDed, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-rose-700">{formatCurrency(totalLateFine, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-rose-700">{formatCurrency(totalTax, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono font-bold bg-rose-100/60 text-rose-800">{formatCurrency(totalDeductions, '')}</td>
                <td className="border border-slate-300 p-2 text-right font-mono font-black bg-indigo-100 text-indigo-950 text-xs">{formatCurrency(totalNet, settings.currencySymbol)}</td>
                <td className="border border-slate-300 p-2" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 pt-12 text-center text-xs">
          <div>
            <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
              {settings.accountantName}
            </div>
            <div className="text-slate-500 text-[11px]">Prepared by (Chief Accountant)</div>
          </div>

          <div>
            <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
              {settings.accountantTitle}
            </div>
            <div className="text-slate-500 text-[11px]">Verified by (Accounts Controller)</div>
          </div>

          <div>
            <div className="border-t border-slate-400 w-4/5 mx-auto pt-2 font-bold text-slate-900">
              {settings.approverName}
            </div>
            <div className="text-slate-500 text-[11px]">{settings.approverTitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
