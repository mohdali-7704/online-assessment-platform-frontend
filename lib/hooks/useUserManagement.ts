import { useState, useEffect, useMemo } from 'react';
import { User, UserFilters, UserStats } from '@/lib/types/user';
import { userService } from '@/lib/services/userService';

export function useUserManagement() {
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load users
  const loadUsers = () => {
    setIsLoading(true);
    try {
      const allUsers = userService.getAllUsers();
      setUsers(allUsers);
      const userStats = userService.getStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Role filter
      if (filters.role !== 'all' && user.role !== filters.role) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && user.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all'
    });
  };

  // Delete user
  const deleteUser = (id: string): boolean => {
    const success = userService.deleteUser(id);
    if (success) {
      loadUsers();
    }
    return success;
  };

  // Update user status
  const updateUserStatus = (id: string, status: User['status']) => {
    const updated = userService.updateUserStatus(id, status);
    if (updated) {
      loadUsers();
    }
    return updated;
  };

  // Update user role
  const updateUserRole = (id: string, role: User['role']) => {
    const updated = userService.updateUserRole(id, role);
    if (updated) {
      loadUsers();
    }
    return updated;
  };

  return {
    users: filteredUsers,
    allUsers: users,
    filters,
    stats,
    isLoading,
    updateFilters,
    clearFilters,
    loadUsers,
    deleteUser,
    updateUserStatus,
    updateUserRole
  };
}
