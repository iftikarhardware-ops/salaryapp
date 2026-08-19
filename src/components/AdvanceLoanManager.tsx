import React, { useState } from 'react';
import { Plus, HandCoins, CheckCircle2, Clock, Trash2, Search, DollarSign } from 'lucide-react';
import { AdvanceLoanRecord, Employee, CompanySettings } from '../types/payroll';
import { formatCurrency, toBanglaNumber } from '../utils/numberToWords';

interface AdvanceLoanManagerProps {
  records: AdvanceLoanRecord[];
  employees: Employee[];
  settings: CompanySettings;
  isBangla: boolean;
  onSaveRecord: (record: AdvanceLoanRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const AdvanceLoanManager: React.FC<AdvanceLoanManagerProps> = ({
  records,
  employees,
  settings,
  isBangla,
  onSaveRecord,
  onDeleteRecord
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<AdvanceLoanRecord>>({
    id: '',
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.name || '',
    amount: 5000,
    disbursedDate: new Date().toISOString().split('T')[0],
    monthlyDeduction: 1000,
    totalDeducted: 0,
    remainingBalance: 5000,
    reason: '',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    const defaultEmp = employees[0];
    setFormData({
      id: `ADV-${Date.now().toString().slice(-4)}`,
      employeeId: defaultEmp?.id || '',
      employeeName: defaultEmp ? `${defaultEmp.name} (${defaultEmp.banglaName})` : '',
      amount: 5000,
      disbursedDate: new Date().toISOString().split('T')[0],
      monthlyDeduction: 1000,
      totalDeducted: 0,
      remainingBalance: 5000,
      reason: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEmployeeSelect = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeId: emp.id,
        employeeName: `${emp.name} (${emp.banglaName})`
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(formData.amount) || 0;
    const monthly = Number(formData.monthlyDeduction) || 0;
    const deducted = Number(formData.totalDeducted) || 0;
    const remaining = Math.max(0, amount - deducted);

    const record: AdvanceLoanRecord = {
      id: formData.id || `ADV-${Date.now()}`,
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      amount,
      disbursedDate: formData.disbursedDate || new Date().toISOString().split('T')[0],
      monthlyDeduction: monthly,
      totalDeducted: deducted,
      remainingBalance: remaining,
      reason: formData.reason || 'Personal advance',
      status: remaining <= 0 ? 'Completed' : 'Active'
    };

    onSaveRecord(record);
    setIsModalOpen(false);
  };

  const filteredRecords = records.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAdvanceDisbursed = records.reduce((sum, r) => sum + r.amount, 0);
  const totalRecovered = records.reduce((sum, r) => sum + r.totalDeducted, 0);
  const totalOutstanding = records.reduce((sum, r) => sum + r.remainingBalance, 0);

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards for Advances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isBangla ? 'মোট প্রদত্ত অগ্রিম / লোন' : 'Total Advance Disbursed'}
          </p>
          <p className="text-2xl font-bold text-slate-800 font-mono">
            {formatCurrency(totalAdvanceDisbursed, settings.currencySymbol, isBangla)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isBangla ? `${toBanglaNumber(records.length)} টি এন্ট্রি` : `${records.length} total entries`}
          </p>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isBangla ? 'স্যালারি থেকে মোট কর্তনকৃত (আদায়)' : 'Total Recovered via Salary'}
          </p>
          <p className="text-2xl font-bold text-emerald-600 font-mono">
            {formatCurrency(totalRecovered, settings.currencySymbol, isBangla)}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            {isBangla ? 'মাসিক পে-রোল থেকে সমন্বিত' : 'Adjusted via monthly payroll'}
          </p>
        </div>

        <div className="bg-white p-5 border border-amber-200 bg-amber-50/20 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            {isBangla ? 'বর্তমান অবশিষ্ট বকেয়া (Outstanding)' : 'Current Outstanding Balance'}
          </p>
          <p className="text-2xl font-bold text-amber-700 font-mono">
            {formatCurrency(totalOutstanding, settings.currencySymbol, isBangla)}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {isBangla ? 'ভবিষ্যৎ স্যালারি থেকে কর্তনযোগ্য' : 'To be deducted in upcoming cycles'}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isBangla ? 'নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by name or ID...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {isBangla ? '+ নতুন অগ্রিম / লোন এন্ট্রি' : '+ Add Advance / Loan'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{isBangla ? 'আইডি ও এমপ্লয়ি' : 'Employee'}</th>
                <th className="px-4 py-3">{isBangla ? 'প্রদানের তারিখ' : 'Disbursed Date'}</th>
                <th className="px-4 py-3">{isBangla ? 'কারণ / বিবরণ' : 'Reason / Note'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মোট লোন পরিমাণ' : 'Total Amount'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মাসিক কর্তন' : 'Monthly EMI'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'মোট কর্তিত' : 'Deducted'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'অবশিষ্ট ব্যালেন্স' : 'Balance'}</th>
                <th className="px-4 py-3 text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="px-4 py-3 text-right">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    {isBangla ? 'কোনো অগ্রিম বেতনের রেকর্ড নেই।' : 'No advance records found.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div>{rec.employeeName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.employeeId} • {rec.id}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{rec.disbursedDate}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{rec.reason}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(rec.amount, settings.currencySymbol, isBangla)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600 font-semibold">
                      -{formatCurrency(rec.monthlyDeduction, settings.currencySymbol, isBangla)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">
                      {formatCurrency(rec.totalDeducted, settings.currencySymbol, isBangla)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-700">
                      {formatCurrency(rec.remainingBalance, settings.currencySymbol, isBangla)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.status === 'Completed' ? (isBangla ? 'পরিশোধিত' : 'Completed') : (isBangla ? 'চলমান' : 'Active')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(isBangla ? 'এই লোন রেকর্ড মুছে ফেলতে চান?' : 'Delete this record?')) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {isBangla ? 'নতুন অগ্রিম বেতন / লোন অনুমোদন' : 'New Salary Advance / Loan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'এমপ্লয়ি নির্বাচন করুন*' : 'Select Employee*'}
                </label>
                <select
                  required
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.id} - {e.banglaName || e.name} ({e.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'লোন / অগ্রিম পরিমাণ*' : 'Total Advance Amount*'} ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'মাসিক কিস্তি কর্তন (Monthly EMI)*' : 'Monthly EMI Deduction*'} ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.monthlyDeduction}
                  onChange={(e) => setFormData({ ...formData, monthlyDeduction: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'প্রদানের তারিখ' : 'Disbursed Date'}
                </label>
                <input
                  type="date"
                  value={formData.disbursedDate}
                  onChange={(e) => setFormData({ ...formData, disbursedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBangla ? 'লোনের কারণ / নোট' : 'Reason / Notes'}
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="যেমন: জরুরি পারিবারিক চিকিৎসা"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isBangla ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  {isBangla ? 'অনুমোদন করুন' : 'Approve & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
