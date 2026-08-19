import React from 'react';
import { 
  Building2, 
  Users, 
  FileSpreadsheet, 
  CreditCard, 
  HandCoins, 
  Landmark, 
  Settings, 
  ShieldCheck, 
  Calendar
} from 'lucide-react';
import { CompanySettings, PayrollCycle } from '../types/payroll';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: CompanySettings;
  cycles: PayrollCycle[];
  selectedCycleId: string;
  onSelectCycle: (cycleId: string) => void;
  onOpenNewCycleModal: () => void;
  isBangla: boolean;
  setIsBangla: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  cycles,
  selectedCycleId,
  onSelectCycle,
  onOpenNewCycleModal,
  isBangla,
  setIsBangla
}) => {
  const currentCycle = cycles.find(c => c.id === selectedCycleId) || cycles[0];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 no-print">
      {/* Top Bar */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo matching Geometric Balance */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none">
                {isBangla ? 'ফিনট্র্যাক পে-রোল প্রো' : 'FinTrack Payroll Pro'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {isBangla ? 'PF ও ESI মুক্ত' : 'No PF/ESI'}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
              {isBangla ? `${settings.companyBanglaName || settings.companyName} • স্যালারি ম্যানেজমেন্ট` : `${settings.companyName} • Corporate Payroll Management`}
            </p>
          </div>
        </div>

        {/* Cycle Selector & Accountant Info */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Active Cycle Badge / Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1.5 gap-2">
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-600">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{isBangla ? 'স্যালারি সাইকেল:' : 'Salary Cycle:'}</span>
            </div>
            <select
              value={selectedCycleId}
              onChange={(e) => onSelectCycle(e.target.value)}
              aria-label={isBangla ? 'স্যালারি সাইকেল নির্বাচন করুন' : 'Select Salary Cycle'}
              className="bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.month} {cycle.year} ({cycle.banglaMonth}) - [{cycle.status}]
                </option>
              ))}
            </select>
            <button
              onClick={onOpenNewCycleModal}
              title={isBangla ? 'নতুন মাসের সাইকেল শুরু করুন' : 'Start New Month Cycle'}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded border border-indigo-200 transition-colors"
            >
              + {isBangla ? 'নতুন মাস' : 'New Month'}
            </button>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setIsBangla(!isBangla)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <span className={isBangla ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>বাংলা</span>
            <span className="text-slate-300">/</span>
            <span className={!isBangla ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>EN</span>
          </button>

          {/* Accountant Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">{settings.accountantName}</p>
              <p className="text-[11px] font-medium text-slate-500">
                {currentCycle?.month} {currentCycle?.year} ({settings.accountantTitle.split('(')[0].trim()})
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              একাউন্টস
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 flex items-center gap-1 border-t border-slate-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'payroll'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {isBangla ? 'পে-রোল প্রসেসিং (Monthly Payroll)' : 'Monthly Payroll Processing'}
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'employees'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          {isBangla ? 'এমপ্লয়ি ও স্যালারি সেটআপ' : 'Employees & Salary Structure'}
        </button>

        <button
          onClick={() => setActiveTab('sheet')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'sheet'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isBangla ? 'মাস্টার স্যালারি শিট (Salary Register)' : 'Master Salary Register'}
        </button>

        <button
          onClick={() => setActiveTab('advances')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'advances'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HandCoins className="w-4 h-4" />
          {isBangla ? 'অগ্রিম বেতন ও ঋণ (Advances & Loans)' : 'Advances & Loans'}
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'bank'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Landmark className="w-4 h-4" />
          {isBangla ? 'ব্যাংক ট্রান্সফার স্টেটমেন্ট (Bank Advice)' : 'Bank Transfer Advice'}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          {isBangla ? 'কোম্পানি সেটিংস' : 'Company Settings'}
        </button>
      </div>
    </header>
  );
};
