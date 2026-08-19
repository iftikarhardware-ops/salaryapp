import React, { useState } from 'react';
import { Printer, Download, Copy, Check, X, Landmark, FileSpreadsheet } from 'lucide-react';
import { PayrollCycle, CompanySettings } from '../types/payroll';
import { formatCurrency, numberToEnglishWords } from '../utils/numberToWords';

interface BankAdviceModalProps {
  cycle: PayrollCycle;
  settings: CompanySettings;
  isBangla?: boolean;
  onClose: () => void;
}

export const BankAdviceModal: React.FC<BankAdviceModalProps> = ({
  cycle,
  settings,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  // Filter items that are Bank Transfer
  const bankItems = cycle.items.filter(item => item.paymentMethod === 'Bank Transfer');
  const totalBankAmount = bankItems.reduce((sum, item) => sum + item.netPayable, 0);
  const englishWords = numberToEnglishWords(totalBankAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `SALARY DISBURSEMENT ADVICE STATEMENT\n`;
    text += `Company: ${settings.companyName}\n`;
    text += `Disbursement Period: ${cycle.month} ${cycle.year}\n`;
    text += `Total Net Transfer: ${formatCurrency(totalBankAmount, settings.currencySymbol)}\n\n`;
    text += `SL | Emp ID | Employee Name | Bank Name | Account No | Amount (${settings.currencySymbol})\n`;
    text += `------------------------------------------------------------------------------------\n`;
    bankItems.forEach((item, idx) => {
      text += `${idx + 1}. ${item.employeeId} | ${item.employeeName} | ${item.bankName} | ${item.accountNumber} | ${item.netPayable}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['SL', 'Employee ID', 'Employee Name', 'Designation', 'Bank Name', 'Account Number', 'Routing Number', 'Net Salary Payable'];
    const rows = bankItems.map((item, idx) => [
      idx + 1,
      item.employeeId,
      `"${item.employeeName}"`,
      `"${item.designation}"`,
      `"${item.bankName}"`,
      `"${item.accountNumber}"`,
      '',
      item.netPayable
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bank_Salary_Advice_${cycle.month}_${cycle.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Action Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Bank Salary Transfer Advice & Disbursement Schedule
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Bank Advice Statement */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 print:p-6 print:m-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {settings.companyName}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">{settings.address} • Phone: {settings.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Date of Issuance</p>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed mb-6">
            <div>
              <p className="font-bold">To</p>
              <p className="font-bold text-slate-900">The Branch Manager</p>
              <p className="text-slate-600">Corporate Banking & Treasury Services</p>
            </div>

            <div className="bg-slate-100 p-2.5 rounded-lg font-bold text-slate-900">
              Subject: Corporate Payroll Disbursement Schedule for {cycle.month} {cycle.year}
            </div>

            <p>
              Dear Sir/Madam,<br />
              Please find enclosed the formal salary disbursement schedule for our employees for the payroll period of{' '}
              <strong>{cycle.month} {cycle.year}</strong>. We hereby instruct and authorize you to debit our corporate account and credit the respective beneficiary accounts according to the schedule below:
            </p>
          </div>

          {/* Bank Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5 text-center w-12">#</th>
                  <th className="px-3.5 py-2.5">Emp ID</th>
                  <th className="px-3.5 py-2.5">Beneficiary Employee</th>
                  <th className="px-3.5 py-2.5">Beneficiary Bank</th>
                  <th className="px-3.5 py-2.5">Account Number</th>
                  <th className="px-3.5 py-2.5 text-right">Net Payable Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bankItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3.5 py-6 text-center text-slate-400">
                      No bank transfer beneficiaries found for this cycle.
                    </td>
                  </tr>
                ) : (
                  bankItems.map((item, idx) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-3.5 py-2 font-mono font-bold text-slate-700">{item.employeeId}</td>
                      <td className="px-3.5 py-2 font-semibold text-slate-900">
                        {item.employeeName}
                        <span className="text-[11px] text-slate-400 block">{item.designation}</span>
                      </td>
                      <td className="px-3.5 py-2 text-slate-700">{item.bankName}</td>
                      <td className="px-3.5 py-2 font-mono font-bold text-slate-900">{item.accountNumber}</td>
                      <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.netPayable, settings.currencySymbol)}
                      </td>
                    </tr>
                  ))
                )}
                {/* Total Row */}
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                  <td colSpan={5} className="px-3.5 py-3 text-right uppercase">
                    Total Bank Transfer Disbursement:
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-sm">
                    {formatCurrency(totalBankAmount, settings.currencySymbol)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in words */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-8">
            <span className="font-bold text-slate-700">Total in Words: </span>
            <span className="font-bold text-indigo-900 italic">{englishWords}</span>
          </div>

          <p className="text-xs text-slate-600 mb-12">
            Your timely execution of this salary transfer order is highly appreciated.
          </p>

          {/* Authorized Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-2 font-bold text-slate-900">
                {settings.accountantName}
              </div>
              <div className="text-slate-500 text-[11px]">{settings.accountantTitle}</div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-2 font-bold text-slate-900">
                {settings.approverName}
              </div>
              <div className="text-slate-500 text-[11px]">{settings.approverTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
