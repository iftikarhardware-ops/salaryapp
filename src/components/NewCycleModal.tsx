import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { Employee, PayrollCycle, AdvanceLoanRecord } from '../types/payroll';
import { calculatePayrollItem } from '../utils/calculations';

interface NewCycleModalProps {
  employees: Employee[];
  advances: AdvanceLoanRecord[];
  onClose: () => void;
  onCreateCycle: (newCycle: PayrollCycle) => void;
  isBangla: boolean;
  defaultDays: number;
}

const MONTHS = [
  { en: 'January', bn: 'জানুয়ারি' },
  { en: 'February', bn: 'ফেব্রুয়ারি' },
  { en: 'March', bn: 'মার্চ' },
  { en: 'April', bn: 'এপ্রিল' },
  { en: 'May', bn: 'মে' },
  { en: 'June', bn: 'জুন' },
  { en: 'July', bn: 'জুলাই' },
  { en: 'August', bn: 'আগস্ট' },
  { en: 'September', bn: 'সেপ্টেম্বর' },
  { en: 'October', bn: 'অক্টোবর' },
  { en: 'November', bn: 'নভেম্বর' },
  { en: 'December', bn: 'ডিসেম্বর' }
];

export const NewCycleModal: React.FC<NewCycleModalProps> = ({
  employees,
  advances,
  onClose,
  onCreateCycle,
  isBangla,
  defaultDays
}) => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const nextMonthIndex = (currentMonthIndex + 1) % 12;

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[nextMonthIndex].en);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [workingDays, setWorkingDays] = useState(defaultDays || 26);
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const monthObj = MONTHS.find(m => m.en === selectedMonth) || MONTHS[0];
    const cycleId = `${selectedYear}-${String(MONTHS.findIndex(m => m.en === selectedMonth) + 1).padStart(2, '0')}`;

    // Filter only active employees
    const activeEmployees = employees.filter(e => e.status !== 'Terminated');

    const items = activeEmployees.map(emp => {
      // Check if employee has active advance deduction
      const empAdvance = advances.find(a => a.employeeId === emp.id && a.status === 'Active' && a.remainingBalance > 0);
      const advanceDed = empAdvance ? Math.min(empAdvance.monthlyDeduction, empAdvance.remainingBalance) : 0;

      return calculatePayrollItem(
        emp,
        workingDays,
        workingDays, // default 100% attendance
        0, // absent
        0, // leave
        0, // overtime hours
        0, // bonus
        advanceDed,
        0, // loan
        0, // late fine
        0, // tax
        0, // other
        '',
        { isPaid: false }
      );
    });

    const newCycle: PayrollCycle = {
      id: cycleId,
      month: selectedMonth,
      banglaMonth: monthObj.bn,
      year: selectedYear,
      status: 'Draft',
      workingDays,
      createdAt: new Date().toISOString().split('T')[0],
      items,
      notes: notes || `${monthObj.bn} ${selectedYear} স্যালারি সাইকেল (PF & ESI বাদ দিয়ে)`
    };

    onCreateCycle(newCycle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isBangla ? 'নতুন মাসের স্যালারি সাইকেল তৈরি' : 'Create New Payroll Cycle'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBangla ? 'স্বয়ংক্রিয়ভাবে সক্রিয় এমপ্লয়িদের ডাটা লোড হবে' : 'Auto-populates active employees'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBangla ? 'মাস নির্বাচন করুন*' : 'Select Month*'}
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {MONTHS.map(m => (
                <option key={m.en} value={m.en}>
                  {m.en} ({m.bn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBangla ? 'বছর (Year)*' : 'Year*'}
            </label>
            <input
              type="number"
              min="2020"
              max="2040"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBangla ? 'মাসের মোট কার্যদিবস (Working Days)*' : 'Total Working Days*'}
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={workingDays}
              onChange={(e) => setWorkingDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBangla ? 'সাইকেল সংক্রান্ত নোট / বিবরণ' : 'Cycle Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Regular monthly payroll (No PF/ESI)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] text-indigo-900">
            {isBangla 
              ? `মোট ${employees.filter(e => e.status !== 'Terminated').length} জন সক্রিয় এমপ্লয়ির বর্তমান স্যালারি স্ট্রাকচার অনুযায়ী খসড়া পে-রোল তৈরি হবে।` 
              : `Draft payroll will be generated for ${employees.filter(e => e.status !== 'Terminated').length} active employees.`}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              {isBangla ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-200"
            >
              {isBangla ? 'সাইকেল শুরু করুন' : 'Start Payroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
