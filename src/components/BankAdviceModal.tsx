import React, { useState } from 'react';
import { Printer, Download, Copy, Check, X, Landmark, FileSpreadsheet } from 'lucide-react';
import { PayrollCycle, CompanySettings } from '../types/payroll';
import { formatCurrency, numberToBanglaWords, numberToEnglishWords, toBanglaNumber } from '../utils/numberToWords';

interface BankAdviceModalProps {
  cycle: PayrollCycle;
  settings: CompanySettings;
  isBangla: boolean;
  onClose: () => void;
}

export const BankAdviceModal: React.FC<BankAdviceModalProps> = ({
  cycle,
  settings,
  isBangla,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [bankTarget, setBankTarget] = useState<string>('ALL');

  // Filter items that are Bank Transfer
  const bankItems = cycle.items.filter(item => {
    const isBank = item.paymentMethod === 'Bank Transfer';
    if (!isBank) return false;
    if (bankTarget === 'ALL') return true;
    return item.bankName.toLowerCase().includes(bankTarget.toLowerCase());
  });

  const totalBankAmount = bankItems.reduce((sum, item) => sum + item.netPayable, 0);
  const banglaWords = numberToBanglaWords(totalBankAmount);
  const englishWords = numberToEnglishWords(totalBankAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `BANK SALARY TRANSFER ADVICE\n`;
    text += `Company: ${settings.companyName}\n`;
    text += `Month: ${cycle.month} ${cycle.year}\n`;
    text += `Total Net Salary: ${formatCurrency(totalBankAmount, settings.currencySymbol)}\n\n`;
    text += `SL | Employee ID | Name | Bank Name | Account No | Amount\n`;
    text += `---------------------------------------------------------\n`;
    bankItems.forEach((item, idx) => {
      text += `${idx + 1}. ${item.employeeId} | ${item.employeeName} | ${item.bankName} | ${item.accountNumber} | ${item.netPayable}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['SL', 'Employee ID', 'Employee Name', 'Bank Name', 'Branch', 'Account Number', 'Routing No', 'Net Salary Amount'];
    const rows = bankItems.map((item, idx) => [
      idx + 1,
      item.employeeId,
      `"${item.employeeName}"`,
      `"${item.bankName}"`,
      `"${item.paymentMethod}"`,
      `"${item.accountNumber}"`,
      '',
      item.netPayable
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bank_Transfer_Advice_${cycle.month}_${cycle.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-6 py-3.5 bg-slate-800 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold">
              {isBangla ? 'ব্যাংক স্যালারি ট্রান্সফার অ্যাডভাইস লেটার' : 'Bank Salary Transfer Advice Letter'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isBangla ? 'কপি হয়েছে' : 'Copied') : (isBangla ? 'টেক্সট কপি' : 'Copy Text')}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBangla ? 'ব্যাংক CSV' : 'Bank CSV'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{isBangla ? 'অফিসিয়াল প্রিন্ট' : 'Print Letter'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Bank Advice Content */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 print:p-6 print:m-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {settings.companyName}
                </h1>
                <p className="text-xs font-bold text-slate-700">{settings.companyBanglaName}</p>
                <p className="text-xs text-slate-500">{settings.address} • Phone: {settings.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">{isBangla ? 'তারিখ:' : 'Date:'}</p>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed mb-6">
            <div>
              <p className="font-bold">To</p>
              <p className="font-bold text-slate-900">The Branch Manager,</p>
              <p className="text-slate-600">Corporate Banking Division</p>
            </div>

            <p className="font-bold text-slate-900 text-sm bg-slate-100 p-2 rounded">
              Subject: Salary Disbursement Advice for the month of {cycle.month} {cycle.year} ({cycle.banglaMonth})
            </p>

            <p>
              Dear Sir/Madam,<br />
              Please find enclosed herewith the salary disbursement schedule for our employees for the month of{' '}
              <strong>{cycle.month} {cycle.year}</strong>. Kindly debit our corporate account and credit the respective employee accounts as detailed in the statement below:
            </p>
          </div>

          {/* Bank Transfer Schedule Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 text-center w-12">#</th>
                  <th className="px-3 py-2">{isBangla ? 'আইডি' : 'Emp ID'}</th>
                  <th className="px-3 py-2">{isBangla ? 'এমপ্লয়ির নাম' : 'Employee Name'}</th>
                  <th className="px-3 py-2">{isBangla ? 'ব্যাংক' : 'Bank Name'}</th>
                  <th className="px-3 py-2">{isBangla ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}</th>
                  <th className="px-3 py-2 text-right">{isBangla ? 'নেট স্যালারি' : 'Net Salary Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bankItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                      {isBangla ? 'কোনো ব্যাংক ট্রান্সফার রেকর্ড নেই।' : 'No bank transfer records.'}
                    </td>
                  </tr>
                ) : (
                  bankItems.map((item, idx) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center font-mono text-slate-500">
                        {isBangla ? toBanglaNumber(idx + 1) : idx + 1}
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-slate-700">{item.employeeId}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {item.employeeName}
                        <span className="text-[11px] text-slate-500 block">{item.employeeBanglaName}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{item.bankName}</td>
                      <td className="px-3 py-2 font-mono font-bold text-slate-900">{item.accountNumber}</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.netPayable, settings.currencySymbol, isBangla)}
                      </td>
                    </tr>
                  ))
                )}
                {/* Total Row */}
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                  <td colSpan={5} className="px-3 py-2.5 text-right uppercase">
                    {isBangla ? 'সর্বমোট ব্যাংক ট্রান্সফার (Total Transfer Amount):' : 'Total Net Transfer Amount:'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm">
                    {formatCurrency(totalBankAmount, settings.currencySymbol, isBangla)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in words */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-8">
            <span className="font-bold text-slate-700">{isBangla ? 'কথায় (In Words): ' : 'In Words: '}</span>
            <span className="font-bold text-indigo-900 italic">{isBangla ? banglaWords : englishWords}</span>
            {isBangla && <span className="block text-slate-500 font-mono italic mt-0.5">({englishWords})</span>}
          </div>

          <p className="text-xs text-slate-700 mb-12">
            Your prompt cooperation in executing this payroll disbursement is highly appreciated.
          </p>

          {/* Authorized Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-500 w-3/4 mx-auto pt-2 font-bold text-slate-900">
                {settings.accountantName}
              </div>
              <div className="text-slate-500 text-[11px]">
                {settings.accountantTitle}
              </div>
            </div>

            <div>
              <div className="border-t border-slate-500 w-3/4 mx-auto pt-2 font-bold text-slate-900">
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
