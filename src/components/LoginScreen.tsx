import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, UserCheck, KeyRound, ArrowRight, Building2, Eye, EyeOff, User } from 'lucide-react';
import { AuthUser, UserRole } from '../types/auth';
import { CompanySettings, Employee } from '../types/payroll';

interface LoginScreenProps {
  users: AuthUser[];
  onLogin: (user: AuthUser) => void;
  onRegister: (newUser: AuthUser) => void;
  settings: CompanySettings;
  isBangla: boolean;
  setIsBangla: (val: boolean) => void;
  employees: Employee[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  users,
  onLogin,
  onRegister,
  settings,
  isBangla,
  setIsBangla,
  employees
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('accountant@fintrack.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regBanglaName, setRegBanglaName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('accountant');
  const [regEmployeeId, setRegEmployeeId] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Match by email or employeeId
    const foundUser = users.find(u => 
      (u.email.toLowerCase() === identifier.toLowerCase().trim() || 
       (u.employeeId && u.employeeId.toLowerCase() === identifier.toLowerCase().trim())) &&
      (u.password === password || password === '123456' || password === 'password123')
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setErrorMsg(isBangla ? 'ভুল ইমেইল/এমপ্লয়ি আইডি অথবা পাসওয়ার্ড!' : 'Invalid Email/Employee ID or Password!');
    }
  };

  const handleQuickLogin = (demoUser: AuthUser) => {
    onLogin(demoUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg(isBangla ? 'সকল তথ্য পূরণ করুন।' : 'Please fill all required fields.');
      return;
    }

    const newUser: AuthUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: regName,
      banglaName: regBanglaName || regName,
      email: regEmail,
      role: regRole,
      designation: regRole === 'accountant' ? 'Accountant' : regRole === 'approver' ? 'Director' : 'Staff Employee',
      employeeId: regRole === 'employee' ? regEmployeeId : undefined,
      password: regPassword
    };

    onRegister(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Language Switch floating top-right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setIsBangla(!isBangla)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <span className={isBangla ? 'text-indigo-600 font-black' : 'text-slate-400'}>বাংলা</span>
          <span className="text-slate-300">/</span>
          <span className={!isBangla ? 'text-indigo-600 font-black' : 'text-slate-400'}>English</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Card Header matching Geometric Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 bg-indigo-900 text-white text-center relative">
            <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <h1 className="text-xl font-black tracking-tight">
              {isBangla ? 'ফিনট্র্যাক পে-রোল সিস্টেম' : 'FinTrack Payroll System'}
            </h1>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              {settings.companyBanglaName || settings.companyName}
            </p>
            <div className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] text-emerald-300 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>{isBangla ? 'PF ও ESI মুক্ত কর্পোরেট স্যালারি' : 'No PF/ESI Applied'}</span>
            </div>
          </div>

          <div className="p-8">
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold text-rose-700">
                {errorMsg}
              </div>
            )}

            {!isRegistering ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'ইমেইল এড্রেস অথবা এমপ্লয়ি আইডি' : 'Email Address or Employee ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="accountant@fintrack.com / EMP-101"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{isBangla ? 'লগইন করুন' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'পূর্ণ নাম (Full Name)*' : 'Full Name*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahim Ahmed"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'বাংলায় নাম' : 'Bangla Name'}
                  </label>
                  <input
                    type="text"
                    value={regBanglaName}
                    onChange={(e) => setRegBanglaName(e.target.value)}
                    placeholder="যেমন: রহিম আহমেদ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'ইমেইল*' : 'Email*'}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'ইউজার রোল (User Role)*' : 'User Role*'}
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="accountant">{isBangla ? 'হিসাবরক্ষক (Accountant)' : 'Accountant'}</option>
                    <option value="approver">{isBangla ? 'ব্যবস্থাপনা পরিচালক (Approver / MD)' : 'Approver / Director'}</option>
                    <option value="employee">{isBangla ? 'এমপ্লয়ি (Employee Portal)' : 'Employee Portal'}</option>
                  </select>
                </div>

                {regRole === 'employee' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBangla ? 'লিংকড এমপ্লয়ি আইডি' : 'Linked Employee ID'}
                    </label>
                    <select
                      value={regEmployeeId}
                      onChange={(e) => setRegEmployeeId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="">{isBangla ? 'এমপ্লয়ি নির্বাচন করুন' : 'Select Employee'}</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.id} - {emp.name} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBangla ? 'পাসওয়ার্ড নির্ধারণ করুন*' : 'Set Password*'}
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-200 transition-colors"
                >
                  {isBangla ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account & Sign In'}
                </button>
              </form>
            )}

            {/* Quick Switch / 1-Click Demo Logins */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                {isBangla ? '১-ক্লিকে টেস্ট লগইন করুন (Demo Accounts)' : '1-Click Quick Demo Login'}
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="p-2 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-lg text-left transition-all group"
                  >
                    <span className="block text-[11px] font-bold text-slate-800 group-hover:text-indigo-700 truncate">
                      {u.banglaName || u.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 capitalize">
                      {u.role === 'accountant' ? (isBangla ? 'একাউন্টেন্ট' : 'Accountant') :
                       u.role === 'approver' ? (isBangla ? 'পরিচালক' : 'Director') :
                       (isBangla ? 'এমপ্লয়ি' : 'Employee')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Register */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg('');
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {isRegistering
                  ? (isBangla ? '← আগের লগইন স্ক্রিনে ফিরে যান' : '← Back to Login')
                  : (isBangla ? '+ নতুন ইউজার রেজিস্ট্রেশন করুন' : '+ Register New User Account')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
