export type CandidateRole = 'admin' | 'candidate';

export type CandidateStatus = 'active' | 'inactive' | 'suspended';

export interface Candidate {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: CandidateRole;
  status: CandidateStatus;
  password?: string; // Only used internally, never exposed to frontend
  createdAt: string;
  lastLogin?: string;
  department?: string;
  phone?: string;
}

// For display purposes (derived from Candidate)
export interface CandidateDisplay extends Omit<Candidate, 'password'> {
  fullName: string;
}

// For candidate creation
export interface CreateCandidateInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: CandidateRole;
  status?: CandidateStatus;
  department?: string;
  phone?: string;
}

// For candidate updates
export interface UpdateCandidateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: CandidateRole;
  status?: CandidateStatus;
  department?: string;
  phone?: string;
}

// Candidate statistics
export interface CandidateStats {
  totalCandidates: number;
  activeCandidates: number;
  adminUsers: number;
  newThisWeek: number;
}

// Candidate filters
export interface CandidateFilters {
  search: string;
  role: CandidateRole | 'all';
  status: CandidateStatus | 'all';
}

// Credential management
export interface CandidateCredentials {
  username: string;
  password: string;
  generatedAt: string;
}

export interface CandidateWithCredentials extends Omit<Candidate, 'password'> {
  credentials?: CandidateCredentials;
}
