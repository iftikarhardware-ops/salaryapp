import React from 'react';
import { Users, Banknote, ShieldAlert, CheckCircle2, Building, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency, toBanglaNumber } from '../utils/numberToWords';

interface MetricCardsProps {
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  netPayout: number;
  currencySymbol: string;
  status: string;
  isBangla: boolean;
  bankTotal?: number;
  cashTotal?: number;
  mfsTotal?: number;
  paidCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalEmployees,
  totalGross,
  totalDeductions,
  netPayout,
  currencySymbol,
  status,
  isBangla,
  bankTotal = 0,
  cashTotal = 0,
  mfsTotal = 0,
  paidCount = 0
}) => {
  const isPaidAll = paidCount === totalEmployees && totalEmployees > 0;

  return (
    <div className="space-y-3 no-print">
      {/* 4 Main Geometric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Employees */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isBangla ? 'মোট কর্মকর্তা/কর্মচারী' : 'Total Employees'}
            </p>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">
            {isBangla ? toBanglaNumber(totalEmployees) : totalEmployees}{' '}
            <span className="text-xs font-medium text-slate-500">
              {isBangla ? 'জন সক্রিয়' : 'active'}
            </span>
          </p>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all" 
              style={{ width: totalEmployees > 0 ? `${Math.min(100, (paidCount / totalEmployees) * 100)}%` : '0%' }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center justify-between">
            <span>{isBangla ? 'পরিশোধিত:' : 'Paid:'} {isBangla ? toBanglaNumber(paidCount) : paidCount}/{isBangla ? toBanglaNumber(totalEmployees) : totalEmployees}</span>
            <span className="font-semibold text-indigo-600">
              {totalEmployees > 0 ? Math.round((paidCount / totalEmployees) * 100) : 0}%
            </span>
          </p>
        </div>

        {/* Card 2: Total Gross Salary */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isBangla ? 'সর্বমোট গ্রস স্যালারি' : 'Total Gross Salary'}
            </p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">
            {formatCurrency(totalGross, currencySymbol, isBangla)}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {isBangla ? 'মূল বেতন + সকল অনুমোদিত ভাতা' : 'Basic + all allowances'}
          </p>
        </div>

        {/* Card 3: Total Deductions */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isBangla ? 'মোট কর্তন (Deductions)' : 'Total Deductions'}
            </p>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 font-mono">
            {formatCurrency(totalDeductions, currencySymbol, isBangla)}
          </p>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-[11px] font-semibold text-slate-600">
            {isBangla ? '✓ কোনো PF / ESI কর্তন নেই' : '✓ No PF / ESI applied'}
          </div>
        </div>

        {/* Card 4: Net Payout */}
        <div className="bg-indigo-50/40 p-5 border border-indigo-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              {isBangla ? 'মোট প্রদেয় বেতন (Net Payout)' : 'Net Payout'}
            </p>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-800 font-mono">
            {formatCurrency(netPayout, currencySymbol, isBangla)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPaidAll 
                ? 'bg-emerald-100 text-emerald-800' 
                : status === 'Approved'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isBangla ? (
                isPaidAll ? 'পরিশোধ সম্পন্ন' : status === 'Approved' ? 'অনুমোদিত (পেমেন্ট প্রস্তুত)' : status === 'Verified' ? 'একাউন্টস যাচাইকৃত' : 'খসড়া প্রস্তুত'
              ) : (
                isPaidAll ? 'Fully Disbursed' : status
              )}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isBangla ? 'প্রদেয় হিসাব' : 'Payable'}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Channel Breakdown bar */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Building className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isBangla ? 'পেমেন্ট চ্যানেল অনুযায়ী বিভাজন:' : 'Payment Channel Breakdown:'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-slate-500">{isBangla ? 'ব্যাংক ট্রান্সফার:' : 'Bank:'}</span>
            <span className="font-bold text-slate-800">{formatCurrency(bankTotal, currencySymbol, isBangla)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-600"></span>
            <span className="text-slate-500">{isBangla ? 'বিকাশ / নগদ / MFS:' : 'bKash/MFS:'}</span>
            <span className="font-bold text-slate-800">{formatCurrency(mfsTotal, currencySymbol, isBangla)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-slate-500">{isBangla ? 'ক্যাশ অন হ্যান্ড:' : 'Cash:'}</span>
            <span className="font-bold text-slate-800">{formatCurrency(cashTotal, currencySymbol, isBangla)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
