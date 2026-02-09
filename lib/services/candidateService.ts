import { Candidate, CreateCandidateInput, UpdateCandidateInput, CandidateStats, CandidateCredentials } from '@/lib/types/candidate';

const CANDIDATES_STORAGE_KEY = 'candidates';

// Initial mock candidates for seeding
const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    username: 'john',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'candidate',
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
    role: 'candidate',
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

class CandidateService {
  private getCandidates(): Candidate[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (!stored) {
      // Initialize with default candidates
      this.saveCandidates(INITIAL_CANDIDATES);
      return INITIAL_CANDIDATES;
    }
    return JSON.parse(stored);
  }

  private saveCandidates(candidates: Candidate[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidates));
  }

  // Get all candidates (without passwords)
  getAllCandidates(): Omit<Candidate, 'password'>[] {
    return this.getCandidates().map(({ password, ...candidate }) => candidate);
  }

  // Get candidate by ID
  getCandidateById(id: string): Omit<Candidate, 'password'> | null {
    const candidate = this.getCandidates().find(c => c.id === id);
    if (!candidate) return null;
    const { password, ...candidateWithoutPassword } = candidate;
    return candidateWithoutPassword;
  }

  // Get candidate by username (for authentication)
  getCandidateByUsername(username: string): Candidate | null {
    return this.getCandidates().find(c => c.username === username) || null;
  }

  // Create new candidate - returns both candidate and credentials
  createCandidate(input: CreateCandidateInput): {
    candidate: Omit<Candidate, 'password'>;
    credentials: CandidateCredentials;
  } {
    const candidates = this.getCandidates();

    // Check if username already exists
    if (candidates.some(c => c.username === input.username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    if (candidates.some(c => c.email === input.email)) {
      throw new Error('Email already exists');
    }

    const newCandidate: Candidate = {
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

    candidates.push(newCandidate);
    this.saveCandidates(candidates);

    const { password, ...candidateWithoutPassword } = newCandidate;

    const credentials: CandidateCredentials = {
      username: newCandidate.username,
      password: input.password,
      generatedAt: new Date().toISOString()
    };

    return { candidate: candidateWithoutPassword, credentials };
  }

  // Update candidate
  updateCandidate(id: string, input: UpdateCandidateInput): Omit<Candidate, 'password'> | null {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    // Check if email is being changed and already exists
    if (input.email && input.email !== candidates[index].email) {
      if (candidates.some(c => c.email === input.email && c.id !== id)) {
        throw new Error('Email already exists');
      }
    }

    const updatedCandidate: Candidate = {
      ...candidates[index],
      ...input,
      id: candidates[index].id, // Preserve ID
      username: candidates[index].username, // Preserve username
      createdAt: candidates[index].createdAt // Preserve creation date
    };

    candidates[index] = updatedCandidate;
    this.saveCandidates(candidates);

    const { password, ...candidateWithoutPassword } = updatedCandidate;
    return candidateWithoutPassword;
  }

  // Delete candidate
  deleteCandidate(id: string): boolean {
    const candidates = this.getCandidates();
    const filteredCandidates = candidates.filter(c => c.id !== id);

    if (filteredCandidates.length === candidates.length) {
      return false; // Candidate not found
    }

    this.saveCandidates(filteredCandidates);
    return true;
  }

  // Update candidate status
  updateCandidateStatus(id: string, status: Candidate['status']): Omit<Candidate, 'password'> | null {
    return this.updateCandidate(id, { status });
  }

  // Update candidate role
  updateCandidateRole(id: string, role: Candidate['role']): Omit<Candidate, 'password'> | null {
    return this.updateCandidate(id, { role });
  }

  // Update last login
  updateLastLogin(id: string): void {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(c => c.id === id);

    if (index !== -1) {
      candidates[index].lastLogin = new Date().toISOString();
      this.saveCandidates(candidates);
    }
  }

  // Get candidate statistics
  getStats(): CandidateStats {
    const candidates = this.getCandidates();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      totalCandidates: candidates.length,
      activeCandidates: candidates.filter(c => c.status === 'active').length,
      adminUsers: candidates.filter(c => c.role === 'admin').length,
      newThisWeek: candidates.filter(c => new Date(c.createdAt) > oneWeekAgo).length
    };
  }

  // Reset password and return new credentials
  resetPassword(id: string): CandidateCredentials | null {
    const candidates = this.getCandidates();
    const candidate = candidates.find(c => c.id === id);

    if (!candidate) return null;

    const newPassword = this.generatePassword();
    this.updateCandidate(id, { password: newPassword });

    return {
      username: candidate.username,
      password: newPassword,
      generatedAt: new Date().toISOString()
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

  // Reset candidates to initial state (for testing)
  resetToDefaults(): void {
    this.saveCandidates(INITIAL_CANDIDATES);
  }
}

export const candidateService = new CandidateService();
