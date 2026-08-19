export type UserRole = 'accountant' | 'approver' | 'employee';

export interface AuthUser {
  id: string;
  name: string;
  banglaName: string;
  email: string;
  role: UserRole;
  designation: string;
  employeeId?: string; // Links to Employee if role is 'employee'
  avatarUrl?: string;
  password?: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
}
