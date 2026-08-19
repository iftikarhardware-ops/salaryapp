import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Landmark, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '../utils/numberToWords';

interface MetricCardsProps {
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  netPayout: number;
  currencySymbol: string;
  status: string;
  isBangla?: boolean;
  bankTotal: number;
  cashTotal: number;
  mfsTotal: number;
  paidCount: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalEmployees,
  totalGross,
  totalDeductions,
  netPayout,
  currencySymbol,
  status,
  bankTotal,
  cashTotal,
  mfsTotal,
  paidCount
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
            Draft Review
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Accounts Verified
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1.5"></span>
            Executive Approved
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
            Disbursed & Paid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 Geometric Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Staff */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Employees
            </span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {totalEmployees}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Disbursement:</span>
              <span className="font-semibold text-slate-700">{paidCount}/{totalEmployees} Staff Paid</span>
            </div>
          </div>
        </div>

        {/* Total Gross Salary */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Gross Payroll
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {formatCurrency(totalGross, currencySymbol)}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Basic + Allowances:</span>
              <span className="font-semibold text-emerald-600">100% Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Total Non-PF Deductions */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Deductions
            </span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-rose-600 tracking-tight font-mono">
              {formatCurrency(totalDeductions, currencySymbol)}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Statutory PF/ESI:</span>
              <span className="font-bold text-slate-700">0.00 (Exempt)</span>
            </div>
          </div>
        </div>

        {/* Net Salary Payout */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 border border-indigo-800 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              Net Payable Payout
            </span>
            <div className="p-2 bg-white/10 rounded-lg text-indigo-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white tracking-tight font-mono">
              {formatCurrency(netPayout, currencySymbol)}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[11px]">
              <span className="text-indigo-200">Cycle Status:</span>
              <span>{getStatusBadge()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Channel Disbursement Breakdown */}
      <div className="bg-white px-5 py-3 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Disbursement Channels:
          </span>
        </div>

        <div className="flex items-center gap-6 flex-wrap font-mono">
          <div className="flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500">Bank Transfer:</span>
            <span className="font-bold text-slate-900">{formatCurrency(bankTotal, currencySymbol)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-pink-600" />
            <span className="text-slate-500">MFS / bKash:</span>
            <span className="font-bold text-slate-900">{formatCurrency(mfsTotal, currencySymbol)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">Cash Counter:</span>
            <span className="font-bold text-slate-900">{formatCurrency(cashTotal, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
