/**
 * Migration utility to convert existing 'users' data to 'candidates' format
 * Run this once to migrate existing localStorage data
 */
export function migrateUsersToCandidates(): boolean {
  if (typeof window === 'undefined') return false;

  const usersData = localStorage.getItem('users');
  const candidatesData = localStorage.getItem('candidates');

  // Don't migrate if candidates already exist or no users to migrate
  if (candidatesData || !usersData) {
    return false;
  }

  try {
    const users = JSON.parse(usersData);

    // Convert user roles to candidate roles
    const candidates = users.map((user: any) => ({
      ...user,
      role: user.role === 'user' ? 'candidate' : user.role
    }));

    // Save as candidates
    localStorage.setItem('candidates', JSON.stringify(candidates));

    console.log(`Migrated ${candidates.length} users to candidates`);
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

/**
 * Clean up old users data after successful migration
 */
export function cleanupOldUsersData(): void {
  if (typeof window === 'undefined') return;

  const candidatesData = localStorage.getItem('candidates');
  if (candidatesData) {
    localStorage.removeItem('users');
    console.log('Cleaned up old users data');
  }
}
