import { AuthUser } from '../types/auth';

const USERS_KEY = 'fintrack_auth_users_v1';
const CURRENT_USER_KEY = 'fintrack_auth_current_user_v1';

export const defaultUsers: AuthUser[] = [
  {
    id: 'USR-01',
    name: 'Rahim Ahmed',
    banglaName: 'রহিম আহমেদ',
    email: 'accountant@fintrack.com',
    role: 'accountant',
    designation: 'Chief Accountant (চীফ একাউন্টেন্ট)',
    password: 'password123'
  },
  {
    id: 'USR-02',
    name: 'Ahsan Habib',
    banglaName: 'আহসান হাবিব',
    email: 'director@fintrack.com',
    role: 'approver',
    designation: 'Managing Director (ব্যবস্থাপনা পরিচালক)',
    password: 'password123'
  },
  {
    id: 'USR-03',
    name: 'Ariful Huq',
    banglaName: 'আরিফুল হক',
    email: 'ariful.h@fintrackcorp.com',
    role: 'employee',
    employeeId: 'EMP-101',
    designation: 'Senior Software Engineer',
    password: 'password123'
  },
  {
    id: 'USR-04',
    name: 'Nadia Sultana',
    banglaName: 'নাদিয়া সুলতানা',
    email: 'nadia.s@fintrackcorp.com',
    role: 'employee',
    employeeId: 'EMP-102',
    designation: 'Marketing Lead',
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
  // Default to Rahim Ahmed (Accountant) logged in so accountant immediately has access or can switch
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
