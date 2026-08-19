import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileSpreadsheet, 
  CreditCard, 
  HandCoins, 
  Landmark, 
  Settings, 
  ShieldCheck, 
  Calendar,
  LogOut,
  ChevronDown,
  Plus
} from 'lucide-react';
import { CompanySettings, PayrollCycle } from '../types/payroll';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: CompanySettings;
  cycles: PayrollCycle[];
  selectedCycleId: string;
  onSelectCycle: (cycleId: string) => void;
  onOpenNewCycleModal: () => void;
  isBangla?: boolean;
  setIsBangla?: (val: boolean) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onSwitchUser?: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  cycles,
  selectedCycleId,
  onSelectCycle,
  onOpenNewCycleModal,
  currentUser,
  onLogout
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const currentCycle = cycles.find(c => c.id === selectedCycleId) || cycles[0];
  const isEmployeeRole = currentUser?.role === 'employee';

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 no-print">
      {/* Top Bar */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity matching Geometric Balance */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 text-white font-black text-sm tracking-tighter">
            EE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                EliteEdge Accounting
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                PF & ESI Exempt
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              {settings.companyName}
            </p>
          </div>
        </div>

        {/* Cycle Selector & User Profile */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Active Cycle Selector (for Accountant & Approver) */}
          {!isEmployeeRole && (
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1.5 gap-2">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-600">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Payroll Cycle:</span>
              </div>
              <select
                value={selectedCycleId}
                onChange={(e) => onSelectCycle(e.target.value)}
                aria-label="Select Payroll Cycle"
                className="bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {cycles.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.month} {cycle.year} — [{cycle.status.toUpperCase()}]
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenNewCycleModal}
                title="Initiate New Month Payroll Cycle"
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded border border-indigo-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Cycle</span>
              </button>
            </div>
          )}

          {/* User Profile & Session Dropdown */}
          {currentUser && (
            <div className="relative">
              <div 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-90"
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[10px] font-semibold text-indigo-600">
                    {currentCycle?.month} {currentCycle?.year} ({currentUser.role === 'accountant' ? 'Chief Accountant' : currentUser.role === 'approver' ? 'Managing Director' : 'Employee Portal'})
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center font-black text-xs text-indigo-900 shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
                  <div className="p-2.5 border-b border-slate-100 mb-1 bg-slate-50 rounded-lg">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 font-semibold text-[10px] rounded uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch User</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      {!isEmployeeRole && (
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
            Payroll Processing
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Attendance Register
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
            Employee Directory & Salaries
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
            Master Salary Register
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
            Advance Salary & Loans
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
            Bank Transfer Advice
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
            Settings & Policy
          </button>
        </div>
      )}
    </header>
  );
};
