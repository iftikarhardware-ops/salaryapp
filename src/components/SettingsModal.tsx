import React, { useState } from 'react';
import { Settings, Building2, UserCheck, ShieldCheck, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { CompanySettings, Employee, PayrollCycle, AdvanceLoanRecord } from '../types/payroll';

interface SettingsModalProps {
  settings: CompanySettings;
  onSaveSettings: (newSettings: CompanySettings) => void;
  isBangla: boolean;
  onResetAllData: () => void;
  employees: Employee[];
  cycles: PayrollCycle[];
  advances: AdvanceLoanRecord[];
  onImportFullData: (data: { settings: CompanySettings; employees: Employee[]; cycles: PayrollCycle[]; advances: AdvanceLoanRecord[] }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  isBangla,
  onResetAllData,
  employees,
  cycles,
  advances,
  onImportFullData
}) => {
  const [formData, setFormData] = useState<CompanySettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      settings: formData,
      employees,
      cycles,
      advances
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinTrack_Payroll_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.employees && parsed.cycles) {
          onImportFullData(parsed);
          alert(isBangla ? 'ডাটা সফলভাবে ইমপোর্ট ও রিস্টোর করা হয়েছে।' : 'Data successfully imported.');
        }
      } catch (err) {
        alert(isBangla ? 'অবৈধ ব্যাকআপ ফাইল!' : 'Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Settings Form */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {isBangla ? 'কোম্পানি প্রোফাইল ও স্যালারি পলিসি সেটিংস' : 'Company Profile & Salary Settings'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBangla ? 'অ্যাকাউন্ট্যান্ট স্বাক্ষর, ভাউচার হেডার ও কারেন্সি কাস্টমাইজেশন' : 'Signatures, currency & corporate details'}
              </p>
            </div>
          </div>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg animate-pulse">
              <Check className="w-3.5 h-3.5" />
              {isBangla ? 'সংরক্ষিত হয়েছে!' : 'Saved Successfully!'}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* Section 1: Company Profile */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {isBangla ? '১. প্রতিষ্ঠানের বিবরণ (Company Details)' : '1. Company Details'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'কোম্পানির নাম (English Name)*' : 'Company Name (English)*'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'কোম্পানির নাম (বাংলায়)' : 'Company Name (Bangla)'}
                </label>
                <input
                  type="text"
                  value={formData.companyBanglaName}
                  onChange={(e) => setFormData({ ...formData, companyBanglaName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'ঠিকানা (English Address)' : 'Address (English)'}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'ঠিকানা (বাংলায়)' : 'Address (Bangla)'}
                </label>
                <input
                  type="text"
                  value={formData.addressBangla}
                  onChange={(e) => setFormData({ ...formData, addressBangla: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'যোগাযোগের ফোন নম্বর' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'অ্যাকাউন্টস ইমেইল' : 'Accounts Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Currency & Working Days */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {isBangla ? '২. মুদ্রা ও ডিফল্ট কার্যদিবস' : '2. Currency & Working Days'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'মুদ্রার প্রতীক (Currency Symbol)' : 'Currency Symbol'}
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'মুদ্রা কোড (Currency Code)' : 'Currency Code'}
                </label>
                <input
                  type="text"
                  value={formData.currencyCode}
                  onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'মাসের সাধারণ কার্যদিবস (Default Days)' : 'Default Monthly Days'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.defaultWorkingDays}
                  onChange={(e) => setFormData({ ...formData, defaultWorkingDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Signatures & Accountant Info */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              {isBangla ? '৩. একাউন্টেন্ট ও অনুমোদনকারীর তথ্য' : '3. Accountant & Approver Details'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'হিসাবরক্ষকের নাম (Accountant Name)*' : 'Accountant Name*'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountantName}
                  onChange={(e) => setFormData({ ...formData, accountantName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'হিসাবরক্ষকের পদবী (Accountant Title)' : 'Accountant Title'}
                </label>
                <input
                  type="text"
                  value={formData.accountantTitle}
                  onChange={(e) => setFormData({ ...formData, accountantTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'চূড়ান্ত অনুমোদনকারীর নাম (MD/Director)' : 'Approver Name (MD/Director)'}
                </label>
                <input
                  type="text"
                  value={formData.approverName}
                  onChange={(e) => setFormData({ ...formData, approverName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'অনুমোদনকারীর পদবী (Approver Title)' : 'Approver Title'}
                </label>
                <input
                  type="text"
                  value={formData.approverTitle}
                  onChange={(e) => setFormData({ ...formData, approverTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'PF ও ESI মুক্ত পলিসি সংক্রান্ত ফুটনোট (Payslip Note)' : 'Payslip Note (PF/ESI Statement)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.pfEsiNote}
                  onChange={(e) => setFormData({ ...formData, pfEsiNote: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              {isBangla ? 'সেটিংস সংরক্ষণ করুন (Save Settings)' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Restore Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isBangla ? 'ডাটা ব্যাকআপ ও রিস্টোর (Backup & Reset)' : 'Backup & Data Management'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {isBangla 
            ? 'আপনার কোম্পানির সম্পূর্ণ পে-রোল, এমপ্লয়ি এবং লোন ডাটা ব্যাকআপ সংরক্ষণ বা রিস্টোর করতে পারেন।' 
            : 'Export your entire payroll data as a backup JSON file or restore from a previous save.'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            {isBangla ? 'সম্পূর্ণ ডাটা ব্যাকআপ ডাউনলোড (JSON)' : 'Export Backup (JSON)'}
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>{isBangla ? 'ব্যাকআপ থেকে রিস্টোর (Import JSON)' : 'Restore Backup'}</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm(isBangla ? 'আপনি কি নিশ্চিত যে সকল ডাটা রিসেট করে ডিফল্ট ডেমো ডাটায় ফিরে যেতে চান?' : 'Reset all data to default demo state?')) {
                onResetAllData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            {isBangla ? 'ডিফল্ট ডাটায় রিসেট করুন' : 'Reset to Default'}
          </button>
        </div>
      </div>
    </div>
  );
};
