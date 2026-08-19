import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  PayrollCycle, 
  AdvanceLoanRecord, 
  CompanySettings, 
  PayrollItem 
} from './types/payroll';
import { 
  loadEmployees, 
  saveEmployees, 
  loadPayrollCycles, 
  savePayrollCycles, 
  loadAdvanceLoans, 
  saveAdvanceLoans, 
  loadSettings, 
  saveSettings,
  initialEmployees,
  initialCompanySettings,
  initialAdvanceLoans,
  createInitialPayrollCycle
} from './utils/storage';
import { calculateCycleTotals } from './utils/calculations';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PayrollManager } from './components/PayrollManager';
import { EmployeeManager } from './components/EmployeeManager';
import { MasterSalarySheet } from './components/MasterSalarySheet';
import { AdvanceLoanManager } from './components/AdvanceLoanManager';
import { BankAdviceModal } from './components/BankAdviceModal';
import { PayslipModal } from './components/PayslipModal';
import { SettingsModal } from './components/SettingsModal';
import { NewCycleModal } from './components/NewCycleModal';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees);
  const [cycles, setCycles] = useState<PayrollCycle[]>(loadPayrollCycles);
  const [selectedCycleId, setSelectedCycleId] = useState<string>(() => {
    const loaded = loadPayrollCycles();
    return loaded[0]?.id || '2026-08';
  });
  const [advances, setAdvances] = useState<AdvanceLoanRecord[]>(loadAdvanceLoans);
  const [settings, setSettings] = useState<CompanySettings>(loadSettings);
  
  // UI States
  const [activeTab, setActiveTab] = useState<string>('payroll');
  const [isBangla, setIsBangla] = useState<boolean>(true);
  const [activePayslipItem, setActivePayslipItem] = useState<PayrollItem | null>(null);
  const [isBankAdviceOpen, setIsBankAdviceOpen] = useState<boolean>(false);
  const [isNewCycleModalOpen, setIsNewCycleModalOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    savePayrollCycles(cycles);
  }, [cycles]);

  useEffect(() => {
    saveAdvanceLoans(advances);
  }, [advances]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Current active cycle
  const currentCycle = cycles.find(c => c.id === selectedCycleId) || cycles[0] || createInitialPayrollCycle(employees);

  // Calculate totals for active cycle
  const cycleTotals = calculateCycleTotals(currentCycle?.items || []);

  // Update a cycle
  const handleUpdateCycle = (updatedCycle: PayrollCycle) => {
    const nextCycles = cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c);
    setCycles(nextCycles);
  };

  // Create a new cycle
  const handleCreateCycle = (newCycle: PayrollCycle) => {
    const nextCycles = [newCycle, ...cycles.filter(c => c.id !== newCycle.id)];
    setCycles(nextCycles);
    setSelectedCycleId(newCycle.id);
    setActiveTab('payroll');
  };

  // Save employee
  const handleSaveEmployee = (emp: Employee) => {
    const exists = employees.some(e => e.id === emp.id);
    let nextEmployees: Employee[];
    if (exists) {
      nextEmployees = employees.map(e => e.id === emp.id ? emp : e);
    } else {
      nextEmployees = [...employees, emp];
    }
    setEmployees(nextEmployees);

    // Also update existing cycles for that employee's name/details
    const updatedCycles = cycles.map(cycle => ({
      ...cycle,
      items: cycle.items.map(item => {
        if (item.employeeId === emp.id) {
          return {
            ...item,
            employeeName: emp.name,
            employeeBanglaName: emp.banglaName || emp.name,
            designation: emp.designation,
            department: emp.department,
            paymentMethod: emp.paymentMethod,
            bankName: emp.bankName,
            accountNumber: emp.accountNumber
          };
        }
        return item;
      })
    }));
    setCycles(updatedCycles);
  };

  // Delete employee
  const handleDeleteEmployee = (empId: string) => {
    setEmployees(employees.filter(e => e.id !== empId));
  };

  // Save advance/loan record
  const handleSaveAdvanceRecord = (rec: AdvanceLoanRecord) => {
    const exists = advances.some(a => a.id === rec.id);
    if (exists) {
      setAdvances(advances.map(a => a.id === rec.id ? rec : a));
    } else {
      setAdvances([rec, ...advances]);
    }
  };

  // Delete advance record
  const handleDeleteAdvanceRecord = (id: string) => {
    setAdvances(advances.filter(a => a.id !== id));
  };

  // Reset all data to factory demo
  const handleResetAllData = () => {
    localStorage.clear();
    setEmployees(initialEmployees);
    const initialCycle = createInitialPayrollCycle(initialEmployees);
    setCycles([initialCycle]);
    setSelectedCycleId(initialCycle.id);
    setAdvances(initialAdvanceLoans);
    setSettings(initialCompanySettings);
    setActiveTab('payroll');
  };

  // Import full backup JSON
  const handleImportFullData = (data: { settings: CompanySettings; employees: Employee[]; cycles: PayrollCycle[]; advances: AdvanceLoanRecord[] }) => {
    if (data.settings) setSettings(data.settings);
    if (data.employees) setEmployees(data.employees);
    if (data.cycles) {
      setCycles(data.cycles);
      if (data.cycles[0]) setSelectedCycleId(data.cycles[0].id);
    }
    if (data.advances) setAdvances(data.advances);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        cycles={cycles}
        selectedCycleId={selectedCycleId}
        onSelectCycle={(id) => setSelectedCycleId(id)}
        onOpenNewCycleModal={() => setIsNewCycleModalOpen(true)}
        isBangla={isBangla}
        setIsBangla={setIsBangla}
      />

      {/* Main Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Metric Cards Banner (shown in payroll, employees, and sheet views) */}
        {['payroll', 'employees', 'sheet'].includes(activeTab) && (
          <MetricCards
            totalEmployees={cycleTotals.totalEmployees}
            totalGross={cycleTotals.totalGross}
            totalDeductions={cycleTotals.totalDeductions}
            netPayout={cycleTotals.totalNetPayable}
            currencySymbol={settings.currencySymbol}
            status={currentCycle?.status || 'Draft'}
            isBangla={isBangla}
            bankTotal={cycleTotals.bankTotal}
            cashTotal={cycleTotals.cashTotal}
            mfsTotal={cycleTotals.mfsTotal}
            paidCount={cycleTotals.paidCount}
          />
        )}

        {/* Tab 1: Monthly Payroll Processing */}
        {activeTab === 'payroll' && currentCycle && (
          <PayrollManager
            cycle={currentCycle}
            employees={employees}
            settings={settings}
            isBangla={isBangla}
            onUpdateCycle={handleUpdateCycle}
            onOpenPayslip={(item) => setActivePayslipItem(item)}
            onOpenBankAdvice={() => setIsBankAdviceOpen(true)}
            onOpenMasterSheet={() => setActiveTab('sheet')}
          />
        )}

        {/* Tab 2: Employee Database & Salary Setup */}
        {activeTab === 'employees' && (
          <EmployeeManager
            employees={employees}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            settings={settings}
            isBangla={isBangla}
          />
        )}

        {/* Tab 3: Master Salary Register Sheet */}
        {activeTab === 'sheet' && currentCycle && (
          <MasterSalarySheet
            cycle={currentCycle}
            settings={settings}
            isBangla={isBangla}
            onBackToPayroll={() => setActiveTab('payroll')}
          />
        )}

        {/* Tab 4: Advances & Loans Ledger */}
        {activeTab === 'advances' && (
          <AdvanceLoanManager
            records={advances}
            employees={employees}
            settings={settings}
            isBangla={isBangla}
            onSaveRecord={handleSaveAdvanceRecord}
            onDeleteRecord={handleDeleteAdvanceRecord}
          />
        )}

        {/* Tab 5: Bank Advice Statement */}
        {activeTab === 'bank' && currentCycle && (
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {isBangla ? 'ব্যাংক ট্রান্সফার স্টেটমেন্ট ও অ্যাডভাইস' : 'Bank Transfer Advice Statement'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isBangla ? 'ব্যাংকের মাধ্যমে সরাসরি স্যালারি বিতরণের অফিসিয়াল লেটার ও শিট' : 'Official bank schedule for salary disbursal'}
                </p>
              </div>
              <button
                onClick={() => setIsBankAdviceOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                {isBangla ? 'অফিসিয়াল লেটার ভিউ ও প্রিন্ট' : 'Open Bank Letter'}
              </button>
            </div>
            
            {/* Quick preview of bank advice modal */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
              <span className="font-semibold text-slate-700">
                {isBangla ? `মোট ব্যাংক প্রাপক: ${cycleTotals.totalEmployees} জনের মধ্যে ব্যাংক ট্রান্সফার তালিকা প্রস্তুত` : `Bank schedule ready for disbursement`}
              </span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {settings.currencySymbol} {cycleTotals.bankTotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Tab 6: Company Settings */}
        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onSaveSettings={(newSettings) => setSettings(newSettings)}
            isBangla={isBangla}
            onResetAllData={handleResetAllData}
            employees={employees}
            cycles={cycles}
            advances={advances}
            onImportFullData={handleImportFullData}
          />
        )}
      </main>

      {/* Payslip Modal */}
      {activePayslipItem && currentCycle && (
        <PayslipModal
          item={activePayslipItem}
          cycle={currentCycle}
          settings={settings}
          isBangla={isBangla}
          onClose={() => setActivePayslipItem(null)}
        />
      )}

      {/* Bank Advice Modal */}
      {isBankAdviceOpen && currentCycle && (
        <BankAdviceModal
          cycle={currentCycle}
          settings={settings}
          isBangla={isBangla}
          onClose={() => setIsBankAdviceOpen(false)}
        />
      )}

      {/* New Cycle Modal */}
      {isNewCycleModalOpen && (
        <NewCycleModal
          employees={employees}
          advances={advances}
          onClose={() => setIsNewCycleModalOpen(false)}
          onCreateCycle={handleCreateCycle}
          isBangla={isBangla}
          defaultDays={settings.defaultWorkingDays}
        />
      )}
    </div>
  );
}
