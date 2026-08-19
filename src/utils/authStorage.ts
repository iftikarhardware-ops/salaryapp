import { AuthUser } from '../types/auth';

const USERS_KEY = 'fintrack_auth_users_v2';
const CURRENT_USER_KEY = 'fintrack_auth_current_user_v2';

export const defaultUsers: AuthUser[] = [
  {
    id: 'USR-01',
    name: 'Rahim Ahmed, FCMA',
    banglaName: 'Rahim Ahmed',
    email: 'accountant@fintrack.com',
    role: 'accountant',
    designation: 'Chief Financial Accountant & Payroll Controller',
    password: 'password123'
  },
  {
    id: 'USR-02',
    name: 'Ahsan Habib',
    banglaName: 'Ahsan Habib',
    email: 'director@fintrack.com',
    role: 'approver',
    designation: 'Managing Director & CEO',
    password: 'password123'
  },
  {
    id: 'USR-03',
    name: 'Ariful Huq',
    banglaName: 'Ariful Huq',
    email: 'ariful.h@fintrackcorp.com',
    role: 'employee',
    employeeId: 'EMP-101',
    designation: 'Lead Software Architect',
    password: 'password123'
  },
  {
    id: 'USR-04',
    name: 'Nadia Sultana',
    banglaName: 'Nadia Sultana',
    email: 'nadia.s@fintrackcorp.com',
    role: 'employee',
    employeeId: 'EMP-102',
    designation: 'Head of Global Marketing',
    password: 'password123'
  }
];

export function loadUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users', e);
  }
  saveUsers(defaultUsers);
  return defaultUsers;
}

export function saveUsers(users: AuthUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function loadCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  return defaultUsers[0];
}

export function saveCurrentUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}
