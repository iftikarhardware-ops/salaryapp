import { Employee, PayrollItem } from '../types/payroll';

/**
 * Calculates accurate payroll items for an employee based on attendance & allowances/deductions
 * NOTE: Strictly NO PF (Provident Fund) and NO ESI as requested.
 */
export function calculatePayrollItem(
  employee: Employee,
  workingDays: number,
  presentDays: number,
  absentDays: number,
  leaveDays: number,
  overtimeHours: number,
  bonusAmount: number = 0,
  advanceDeduction: number = 0,
  loanEmiDeduction: number = 0,
  lateFineDeduction: number = 0,
  taxDeduction: number = 0,
  otherDeduction: number = 0,
  otherDeductionReason: string = '',
  existingItem?: Partial<PayrollItem>
): PayrollItem {
  const basic = Number(employee.basicSalary) || 0;
  const houseRent = Number(employee.houseRentAllowance) || 0;
  const medical = Number(employee.medicalAllowance) || 0;
  const conveyance = Number(employee.conveyanceAllowance) || 0;
  const food = Number(employee.foodAllowance) || 0;
  const special = Number(employee.specialAllowance) || 0;
  
  // Daily rate for absence deduction based on basic salary and working days
  const effectiveWorkingDays = workingDays > 0 ? workingDays : 26;
  const dailyRate = basic / effectiveWorkingDays;
  const calculatedAbsenceDeduction = Math.round(dailyRate * Math.max(0, absentDays));

  // Overtime rate: either employee's custom hourly rate or standard (Basic / workingDays / 8 hrs * 1.5)
  const hourlyRate = employee.overtimeHourlyRate && employee.overtimeHourlyRate > 0
    ? employee.overtimeHourlyRate
    : Math.round((dailyRate / 8) * 1.5);
  const calculatedOvertimeAmount = Math.round(hourlyRate * Math.max(0, overtimeHours));

  // Total Gross Salary
  const totalGross = basic + houseRent + medical + conveyance + food + special + bonusAmount + calculatedOvertimeAmount;

  // Total Deductions (NO PF, NO ESI)
  const totalDeduct = calculatedAbsenceDeduction + advanceDeduction + loanEmiDeduction + lateFineDeduction + taxDeduction + otherDeduction;

  // Net Payable
  const netPay = Math.max(0, totalGross - totalDeduct);

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    employeeBanglaName: employee.banglaName || employee.name,
    designation: employee.designation,
    department: employee.department,
    paymentMethod: employee.paymentMethod,
    bankName: employee.bankName || 'N/A',
    accountNumber: employee.accountNumber || employee.mfsNumber || 'N/A',
    workingDays: effectiveWorkingDays,
    presentDays: Math.min(effectiveWorkingDays, presentDays),
    absentDays: Math.max(0, absentDays),
    leaveDays: Math.max(0, leaveDays),
    overtimeHours: Math.max(0, overtimeHours),

    basicSalary: basic,
    houseRentAllowance: houseRent,
    medicalAllowance: medical,
    conveyanceAllowance: conveyance,
    foodAllowance: food,
    specialAllowance: special,
    bonusAmount: bonusAmount,
    overtimeAmount: calculatedOvertimeAmount,
    totalGrossSalary: totalGross,

    absenceDeduction: calculatedAbsenceDeduction,
    advanceSalaryDeduction: advanceDeduction,
    loanEmiDeduction: loanEmiDeduction,
    lateFineDeduction: lateFineDeduction,
    taxDeduction: taxDeduction,
    otherDeduction: otherDeduction,
    otherDeductionReason: otherDeductionReason,
    totalDeductions: totalDeduct,

    netPayable: netPay,
    isPaid: existingItem?.isPaid || false,
    paymentDate: existingItem?.paymentDate,
    transactionRef: existingItem?.transactionRef || '',
    remarks: existingItem?.remarks || ''
  };
}

export function calculateCycleTotals(items: PayrollItem[]) {
  return items.reduce((acc, item) => {
    acc.totalEmployees += 1;
    acc.totalBasic += item.basicSalary;
    acc.totalAllowances += (item.houseRentAllowance + item.medicalAllowance + item.conveyanceAllowance + item.foodAllowance + item.specialAllowance);
    acc.totalBonus += item.bonusAmount;
    acc.totalOvertime += item.overtimeAmount;
    acc.totalGross += item.totalGrossSalary;
    acc.totalDeductions += item.totalDeductions;
    acc.totalNetPayable += item.netPayable;
    acc.paidCount += item.isPaid ? 1 : 0;
    acc.unpaidCount += !item.isPaid ? 1 : 0;
    
    if (item.paymentMethod === 'Bank Transfer') {
      acc.bankTotal += item.netPayable;
    } else if (item.paymentMethod === 'Cash') {
      acc.cashTotal += item.netPayable;
    } else {
      acc.mfsTotal += item.netPayable;
    }

    return acc;
  }, {
    totalEmployees: 0,
    totalBasic: 0,
    totalAllowances: 0,
    totalBonus: 0,
    totalOvertime: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNetPayable: 0,
    paidCount: 0,
    unpaidCount: 0,
    bankTotal: 0,
    cashTotal: 0,
    mfsTotal: 0
  });
}
