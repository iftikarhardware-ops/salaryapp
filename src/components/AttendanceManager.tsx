import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Coffee, 
  Download, 
  Upload, 
  Printer, 
  Search, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { Employee, PayrollCycle, DailyAttendanceRecord, AttendanceStatus, CompanySettings } from '../types/payroll';
import { calculatePayrollItem } from '../utils/calculations';

interface AttendanceManagerProps {
  employees: Employee[];
  cycle: PayrollCycle;
  attendanceMap: Record<string, Record<string, DailyAttendanceRecord>>;
  onUpdateAttendance: (newMap: Record<string, Record<string, DailyAttendanceRecord>>) => void;
  onUpdateCycle: (updatedCycle: PayrollCycle) => void;
  settings: CompanySettings;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; fullLabel: string; bg: string; text: string; border: string }> = {
  P: { label: 'P', fullLabel: 'Present', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  A: { label: 'A', fullLabel: 'Absent (Unpaid)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  HD: { label: 'HD', fullLabel: 'Half Day (0.5d)', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  L: { label: 'L', fullLabel: 'Paid Leave', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  WO: { label: 'WO', fullLabel: 'Weekly Off', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  H: { label: 'H', fullLabel: 'Public Holiday', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300' }
};

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  employees,
  cycle,
  attendanceMap,
  onUpdateAttendance,
  onUpdateCycle,
  settings
}) => {
  const [yearStr, monthStr] = cycle.id.split('-');
  const year = parseInt(yearStr) || 2026;
  const monthIndex = (parseInt(monthStr) || 8) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return `${yearStr}-${monthStr}-01`;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const departments = Array.from(new Set(employees.map(e => e.department)));

  // Helper to get or default record
  const getRecord = (empId: string, date: string): DailyAttendanceRecord => {
    return attendanceMap[empId]?.[date] || {
      date,
      status: 'P',
      checkIn: '09:30',
      checkOut: '18:30',
      lateMinutes: 0
    };
  };

  // Change single employee daily status
  const handleStatusChange = (empId: string, date: string, status: AttendanceStatus) => {
    const current = getRecord(empId, date);
    const updatedRecord: DailyAttendanceRecord = {
      ...current,
      status,
      checkIn: status === 'P' || status === 'HD' ? (current.checkIn || '09:30') : undefined,
      checkOut: status === 'P' || status === 'HD' ? (current.checkOut || '18:30') : undefined
    };

    const nextMap = {
      ...attendanceMap,
      [empId]: {
        ...(attendanceMap[empId] || {}),
        [date]: updatedRecord
      }
    };

    onUpdateAttendance(nextMap);
  };

  // Bulk mark all employees on selected date
  const handleBulkMarkDate = (status: AttendanceStatus) => {
    const nextMap = { ...attendanceMap };
    employees.forEach(emp => {
      if (emp.status !== 'Terminated') {
        const current = getRecord(emp.id, selectedDate);
        nextMap[emp.id] = {
          ...(nextMap[emp.id] || {}),
          [selectedDate]: {
            ...current,
            status,
            checkIn: status === 'P' || status === 'HD' ? '09:30' : undefined,
            checkOut: status === 'P' || status === 'HD' ? '18:30' : undefined
          }
        };
      }
    });
    onUpdateAttendance(nextMap);
  };

  // Mark all Sundays in the month as Weekly Off
  const handleAutoMarkSundays = () => {
    const nextMap = { ...attendanceMap };
    employees.forEach(emp => {
      if (!nextMap[emp.id]) nextMap[emp.id] = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const dObj = new Date(year, monthIndex, d);
        if (dObj.getDay() === 0) { // Sunday
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          nextMap[emp.id][dateStr] = {
            date: dateStr,
            status: 'WO'
          };
        }
      }
    });
    onUpdateAttendance(nextMap);
  };

  // Sync attendance to monthly payroll cycle items
  const handleSyncToPayroll = () => {
    const updatedItems = cycle.items.map(item => {
      const emp = employees.find(e => e.id === item.employeeId);
      if (!emp) return item;

      const empRecords = attendanceMap[emp.id] || {};
      let presentCount = 0;
      let absentCount = 0;
      let leaveCount = 0;
      let totalLateMinutes = 0;

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const rec = empRecords[dateStr];
        if (rec) {
          if (rec.status === 'P') {
            presentCount += 1;
            if (rec.lateMinutes && rec.lateMinutes > 15) {
              totalLateMinutes += rec.lateMinutes;
            }
          } else if (rec.status === 'HD') {
            presentCount += 0.5;
            absentCount += 0.5;
          } else if (rec.status === 'A') {
            absentCount += 1;
          } else if (rec.status === 'L') {
            leaveCount += 1;
            presentCount += 1; // Paid Leave counts towards full salary
          }
        } else {
          // Default weekday present
          const dObj = new Date(year, monthIndex, d);
          if (dObj.getDay() !== 0) {
            presentCount += 1;
          }
        }
      }

      // Calculate fine for late minutes (> 3 occurrences or > 60 total minutes = ₹ 500 fine)
      const lateFine = totalLateMinutes > 60 ? 500 : item.lateFineDeduction;

      return calculatePayrollItem(
        emp,
        cycle.workingDays,
        Math.min(cycle.workingDays, presentCount),
        absentCount,
        leaveCount,
        item.overtimeHours,
        item.bonusAmount,
        item.advanceSalaryDeduction,
        item.loanDeduction,
        lateFine,
        item.taxDeduction,
        item.otherDeduction,
        item.remarks,
        { isPaid: item.isPaid }
      );
    });

    onUpdateCycle({
      ...cycle,
      items: updatedItems
    });

    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const dateHeaders = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    const headers = ['Employee ID', 'Employee Name', 'Department', ...dateHeaders, 'Total Present', 'Total Absent', 'Total Leaves', 'Weekly Offs'];

    const rows = employees.map(emp => {
      const empRecords = attendanceMap[emp.id] || {};
      let p = 0, a = 0, l = 0, wo = 0;

      const dayStatuses = Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1;
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const st = empRecords[dateStr]?.status || 'P';
        if (st === 'P') p++;
        else if (st === 'HD') { p += 0.5; a += 0.5; }
        else if (st === 'A') a++;
        else if (st === 'L') l++;
        else if (st === 'WO') wo++;
        return st;
      });

      return [
        emp.id,
        `"${emp.name}"`,
        `"${emp.department}"`,
        ...dayStatuses,
        p,
        a,
        l,
        wo
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monthly_Attendance_Register_${cycle.month}_${cycle.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

  // Calculate daily summary for selectedDate
  let dayPresentCount = 0;
  let dayAbsentCount = 0;
  let dayLeaveCount = 0;
  employees.forEach(emp => {
    const st = getRecord(emp.id, selectedDate).status;
    if (st === 'P' || st === 'HD') dayPresentCount++;
    if (st === 'A') dayAbsentCount++;
    if (st === 'L') dayLeaveCount++;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Attendance Register & Biometric Tracker
              </h2>
              <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {cycle.month} {cycle.year} ({daysInMonth} Days)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mark daily attendance, overtime, track late arrivals, and sync seamlessly with monthly payroll calculations.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'daily' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Marking View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'monthly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Matrix Grid
            </button>
          </div>

          <button
            onClick={handleAutoMarkSundays}
            title="Auto mark all Sundays as Weekly Off (WO)"
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 text-xs font-semibold transition-colors"
          >
            Auto Sundays (WO)
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSyncToPayroll}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sync to {cycle.month} Payroll</span>
          </button>
        </div>
      </div>

      {syncSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attendance successfully synchronized! Payroll present days, unpaid deductions & late fines updated.</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700">✓ Up-to-Date</span>
        </div>
      )}

      {/* DAILY VIEW MODE */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Date Picker & Quick Status Bar */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                min={`${yearStr}-${monthStr}-01`}
                max={`${yearStr}-${monthStr}-${String(daysInMonth).padStart(2, '0')}`}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Quick Bulk Marking for Selected Day */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Bulk Set Today:</span>
              <button
                onClick={() => handleBulkMarkDate('P')}
                className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded transition-colors"
              >
                All Present (P)
              </button>
              <button
                onClick={() => handleBulkMarkDate('WO')}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 rounded transition-colors"
              >
                Weekly Off (WO)
              </button>
              <button
                onClick={() => handleBulkMarkDate('H')}
                className="px-2.5 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300 hover:bg-purple-100 rounded transition-colors"
              >
                Holiday (H)
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee by name, ID or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Filter by department"
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Daily Marking Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Employee Profile</th>
                    <th className="px-4 py-3.5">Attendance Status</th>
                    <th className="px-4 py-3.5 text-center">Check-In Time</th>
                    <th className="px-4 py-3.5 text-center">Check-Out Time</th>
                    <th className="px-4 py-3.5 text-center">Late Minutes</th>
                    <th className="px-4 py-3.5">Status Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map(emp => {
                    const rec = getRecord(emp.id, selectedDate);
                    const isPresentLike = rec.status === 'P' || rec.status === 'HD';

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{emp.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.id} • {emp.designation} ({emp.department})
                          </div>
                        </td>

                        {/* Status Pills */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(['P', 'A', 'HD', 'L', 'WO', 'H'] as AttendanceStatus[]).map(st => {
                              const conf = STATUS_CONFIG[st];
                              const isSelected = rec.status === st;

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(emp.id, selectedDate, st)}
                                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all border ${
                                    isSelected 
                                      ? `${conf.bg} ${conf.text} ${conf.border} shadow-xs scale-105`
                                      : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                                  }`}
                                >
                                  {conf.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Check-In */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="time"
                            disabled={!isPresentLike}
                            value={rec.checkIn || '09:30'}
                            onChange={(e) => {
                              const checkInVal = e.target.value;
                              const [h, m] = checkInVal.split(':').map(Number);
                              const standardMinutes = 9 * 60 + 30; // 09:30 AM
                              const actualMinutes = h * 60 + m;
                              const late = Math.max(0, actualMinutes - standardMinutes);

                              const updated = {
                                ...rec,
                                checkIn: checkInVal,
                                lateMinutes: late
                              };
                              onUpdateAttendance({
                                ...attendanceMap,
                                [emp.id]: { ...(attendanceMap[emp.id] || {}), [selectedDate]: updated }
                              });
                            }}
                            className={`px-2 py-1 border border-slate-200 rounded font-mono text-center text-xs ${
                              !isPresentLike ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-800'
                            }`}
                          />
                        </td>

                        {/* Check-Out */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="time"
                            disabled={!isPresentLike}
                            value={rec.checkOut || '18:30'}
                            onChange={(e) => {
                              const updated = {
                                ...rec,
                                checkOut: e.target.value
                              };
                              onUpdateAttendance({
                                ...attendanceMap,
                                [emp.id]: { ...(attendanceMap[emp.id] || {}), [selectedDate]: updated }
                              });
                            }}
                            className={`px-2 py-1 border border-slate-200 rounded font-mono text-center text-xs ${
                              !isPresentLike ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-800'
                            }`}
                          />
                        </td>

                        {/* Late Minutes */}
                        <td className="px-4 py-3 text-center font-mono">
                          {rec.lateMinutes && rec.lateMinutes > 0 ? (
                            <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs font-bold">
                              +{rec.lateMinutes}m Late
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">On-Time</span>
                          )}
                        </td>

                        {/* Status Summary */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${STATUS_CONFIG[rec.status].bg} ${STATUS_CONFIG[rec.status].text}`}>
                            {STATUS_CONFIG[rec.status].fullLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY REGISTER MATRIX VIEW */}
      {viewMode === 'monthly' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-6 overflow-hidden space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Full Month Attendance Register — {cycle.month} {cycle.year}
              </h3>
              <p className="text-xs text-slate-500">
                Matrix sheet across all {daysInMonth} calendar days with total present, absent & leave counters.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 text-[11px] font-bold flex-wrap">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">P = Present</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded">A = Absent</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">HD = Half Day</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">L = Leave</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded">WO = Off</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse border border-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="border border-slate-200 p-2 sticky left-0 bg-slate-50 z-10 w-48">Employee Profile</th>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const d = i + 1;
                    const dObj = new Date(year, monthIndex, d);
                    const isSun = dObj.getDay() === 0;

                    return (
                      <th 
                        key={d} 
                        className={`border border-slate-200 p-1 text-center font-mono w-7 ${
                          isSun ? 'bg-slate-200 text-slate-700 font-black' : ''
                        }`}
                      >
                        {d}
                      </th>
                    );
                  })}
                  <th className="border border-slate-200 p-2 text-center bg-emerald-50 text-emerald-800 font-bold">P</th>
                  <th className="border border-slate-200 p-2 text-center bg-rose-50 text-rose-800 font-bold">A</th>
                  <th className="border border-slate-200 p-2 text-center bg-blue-50 text-blue-800 font-bold">L</th>
                  <th className="border border-slate-200 p-2 text-center bg-slate-100 text-slate-700 font-bold">WO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.map(emp => {
                  const empRecords = attendanceMap[emp.id] || {};
                  let p = 0, a = 0, l = 0, wo = 0;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 sticky left-0 bg-white z-10 font-semibold text-slate-900 whitespace-nowrap shadow-xs">
                        <div>{emp.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.id} • {emp.designation}</span>
                      </td>

                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const d = i + 1;
                        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const rec = empRecords[dateStr] || { date: dateStr, status: (new Date(year, monthIndex, d).getDay() === 0 ? 'WO' : 'P') };
                        const st = rec.status;

                        if (st === 'P') p++;
                        else if (st === 'HD') { p += 0.5; a += 0.5; }
                        else if (st === 'A') a++;
                        else if (st === 'L') l++;
                        else if (st === 'WO') wo++;

                        const conf = STATUS_CONFIG[st];

                        return (
                          <td 
                            key={d} 
                            onClick={() => {
                              // Cycle next status on click for quick editing
                              const nextOrder: AttendanceStatus[] = ['P', 'A', 'HD', 'L', 'WO', 'H'];
                              const nextIdx = (nextOrder.indexOf(st) + 1) % nextOrder.length;
                              handleStatusChange(emp.id, dateStr, nextOrder[nextIdx]);
                            }}
                            title={`Click to toggle status for ${emp.name} on ${dateStr}`}
                            className={`border border-slate-200 p-0.5 text-center font-mono font-bold cursor-pointer select-none transition-colors hover:ring-1 hover:ring-indigo-500 ${conf.bg} ${conf.text}`}
                          >
                            {st}
                          </td>
                        );
                      })}

                      <td className="border border-slate-200 p-2 text-center font-mono font-bold text-emerald-800 bg-emerald-50/50">{p}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono font-bold text-rose-800 bg-rose-50/50">{a}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono font-bold text-blue-800 bg-blue-50/50">{l}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/50">{wo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
