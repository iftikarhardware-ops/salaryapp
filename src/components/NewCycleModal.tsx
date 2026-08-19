import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { Employee, PayrollCycle, AdvanceLoanRecord } from '../types/payroll';
import { calculatePayrollItem } from '../utils/calculations';

interface NewCycleModalProps {
  employees: Employee[];
  advances: AdvanceLoanRecord[];
  onClose: () => void;
  onCreateCycle: (newCycle: PayrollCycle) => void;
  isBangla?: boolean;
  defaultDays: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const NewCycleModal: React.FC<NewCycleModalProps> = ({
  employees,
  advances,
  onClose,
  onCreateCycle,
  defaultDays
}) => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const nextMonthIndex = (currentMonthIndex + 1) % 12;

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[nextMonthIndex]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [workingDays, setWorkingDays] = useState(defaultDays || 26);
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cycleId = `${selectedYear}-${String(MONTHS.indexOf(selectedMonth) + 1).padStart(2, '0')}`;
    const activeEmployees = employees.filter(e => e.status !== 'Terminated');

    const items = activeEmployees.map(emp => {
      const empAdvance = advances.find(a => a.employeeId === emp.id && a.status === 'Active' && a.remainingBalance > 0);
      const advanceDed = empAdvance ? Math.min(empAdvance.monthlyDeduction, empAdvance.remainingBalance) : 0;

      return calculatePayrollItem(
        emp,
        workingDays,
        workingDays,
        0,
        0,
        0,
        0,
        advanceDed,
        0,
        0,
        0,
        0,
        '',
        { isPaid: false }
      );
    });

    const newCycle: PayrollCycle = {
      id: cycleId,
      month: selectedMonth,
      banglaMonth: selectedMonth,
      year: selectedYear,
      status: 'Draft',
      workingDays,
      createdAt: new Date().toISOString().split('T')[0],
      items,
      notes: notes || `${selectedMonth} ${selectedYear} Corporate Payroll Cycle (Non-Contributory No PF/ESI)`
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
                Initiate New Payroll Cycle
              </h3>
              <p className="text-xs text-slate-500">
                Auto-generates draft items for all active employees
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
              Select Month*
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Fiscal Year*
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
              Scheduled Working Days*
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
              Payroll Memo / Notes
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
            A draft payroll register will be created for {employees.filter(e => e.status !== 'Terminated').length} active employees with automatic advance salary EMI adjustments.
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
            >
              Initiate Payroll Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
