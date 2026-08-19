import { AuthUser } from '../types/auth';

const USERS_KEY = 'eliteedge_inr_auth_users_v1';
const CURRENT_USER_KEY = 'eliteedge_inr_auth_current_user_v1';

export const defaultUsers: AuthUser[] = [
  {
    id: 'USR-01',
    name: 'Vikramaditya Iyer, CA',
    banglaName: 'Vikramaditya Iyer',
    email: 'accountant@eliteedge.in',
    role: 'accountant',
    designation: 'Chief Financial Accountant & Corporate Controller',
    password: 'password123'
  },
  {
    id: 'USR-02',
    name: 'Rajesh Mehra',
    banglaName: 'Rajesh Mehra',
    email: 'director@eliteedge.in',
    role: 'approver',
    designation: 'Managing Director & CEO',
    password: 'password123'
  },
  {
    id: 'USR-03',
    name: 'Rahul Sharma',
    banglaName: 'Rahul Sharma',
    email: 'rahul.sharma@eliteedge.in',
    role: 'employee',
    employeeId: 'EMP-101',
    designation: 'Principal Software Architect',
    password: 'password123'
  },
  {
    id: 'USR-04',
    name: 'Priya Nair',
    banglaName: 'Priya Nair',
    email: 'priya.nair@eliteedge.in',
    role: 'employee',
    employeeId: 'EMP-102',
    designation: 'Head of Brand & Growth Marketing',
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
