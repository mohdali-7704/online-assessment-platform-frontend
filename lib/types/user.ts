export type UserRole = 'admin' | 'user';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // Only used internally, never exposed to frontend
  createdAt: string;
  lastLogin?: string;
  department?: string;
  phone?: string;
}

// For display purposes (derived from User)
export interface UserDisplay extends Omit<User, 'password'> {
  fullName: string;
}

// For user creation
export interface CreateUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  department?: string;
  phone?: string;
}

// For user updates
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  department?: string;
  phone?: string;
}

// User statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newThisWeek: number;
}

// User filters
export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
}
