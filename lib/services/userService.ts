import { User, CreateUserInput, UpdateUserInput, UserStats } from '@/lib/types/user';

const USERS_STORAGE_KEY = 'users';

// Initial mock users for seeding
const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'john',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    lastLogin: new Date('2025-02-05').toISOString(),
    department: 'Engineering',
    phone: '+1234567890'
  },
  {
    id: '2',
    username: 'jane',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-20').toISOString(),
    lastLogin: new Date('2025-02-04').toISOString(),
    department: 'Marketing',
    phone: '+1234567891'
  },
  {
    id: '3',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    lastLogin: new Date('2025-02-06').toISOString(),
    department: 'Administration'
  }
];

class UserService {
  private getUsers(): User[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      // Initialize with default users
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    return JSON.parse(stored);
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  // Get all users (without passwords)
  getAllUsers(): Omit<User, 'password'>[] {
    return this.getUsers().map(({ password, ...user }) => user);
  }

  // Get user by ID
  getUserById(id: string): Omit<User, 'password'> | null {
    const user = this.getUsers().find(u => u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user by username (for authentication)
  getUserByUsername(username: string): User | null {
    return this.getUsers().find(u => u.username === username) || null;
  }

  // Create new user
  createUser(input: CreateUserInput): Omit<User, 'password'> {
    const users = this.getUsers();

    // Check if username already exists
    if (users.some(u => u.username === input.username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    if (users.some(u => u.email === input.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      role: input.role,
      status: input.status || 'active',
      createdAt: new Date().toISOString(),
      department: input.department,
      phone: input.phone
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Update user
  updateUser(id: string, input: UpdateUserInput): Omit<User, 'password'> | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return null;
    }

    // Check if email is being changed and already exists
    if (input.email && input.email !== users[index].email) {
      if (users.some(u => u.email === input.email && u.id !== id)) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser: User = {
      ...users[index],
      ...input,
      id: users[index].id, // Preserve ID
      username: users[index].username, // Preserve username
      createdAt: users[index].createdAt // Preserve creation date
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Delete user
  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== id);

    if (filteredUsers.length === users.length) {
      return false; // User not found
    }

    this.saveUsers(filteredUsers);
    return true;
  }

  // Update user status
  updateUserStatus(id: string, status: User['status']): Omit<User, 'password'> | null {
    return this.updateUser(id, { status });
  }

  // Update user role
  updateUserRole(id: string, role: User['role']): Omit<User, 'password'> | null {
    return this.updateUser(id, { role });
  }

  // Update last login
  updateLastLogin(id: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
      users[index].lastLogin = new Date().toISOString();
      this.saveUsers(users);
    }
  }

  // Get user statistics
  getStats(): UserStats {
    const users = this.getUsers();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      newThisWeek: users.filter(u => new Date(u.createdAt) > oneWeekAgo).length
    };
  }

  // Generate random password
  generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Reset users to initial state (for testing)
  resetToDefaults(): void {
    this.saveUsers(INITIAL_USERS);
  }
}

export const userService = new UserService();
