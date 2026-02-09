import { useState, useEffect, useMemo } from 'react';
import { Candidate, CandidateFilters, CandidateStats } from '@/lib/types/candidate';
import { candidateService } from '@/lib/services/candidateService';

export function useCandidateManagement() {
  const [candidates, setCandidates] = useState<Omit<Candidate, 'password'>[]>([]);
  const [filters, setFilters] = useState<CandidateFilters>({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState<CandidateStats>({
    totalCandidates: 0,
    activeCandidates: 0,
    adminUsers: 0,
    newThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load candidates
  const loadCandidates = () => {
    setIsLoading(true);
    try {
      const allCandidates = candidateService.getAllCandidates();
      setCandidates(allCandidates);
      const candidateStats = candidateService.getStats();
      setStats(candidateStats);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCandidates();
  }, []);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchLower) ||
          candidate.username.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Role filter
      if (filters.role !== 'all' && candidate.role !== filters.role) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && candidate.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [candidates, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<CandidateFilters>) => {
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

  // Delete candidate
  const deleteCandidate = (id: string): boolean => {
    const success = candidateService.deleteCandidate(id);
    if (success) {
      loadCandidates();
    }
    return success;
  };

  // Update candidate status
  const updateCandidateStatus = (id: string, status: Candidate['status']) => {
    const updated = candidateService.updateCandidateStatus(id, status);
    if (updated) {
      loadCandidates();
    }
    return updated;
  };

  // Update candidate role
  const updateCandidateRole = (id: string, role: Candidate['role']) => {
    const updated = candidateService.updateCandidateRole(id, role);
    if (updated) {
      loadCandidates();
    }
    return updated;
  };

  return {
    candidates: filteredCandidates,
    allCandidates: candidates,
    filters,
    stats,
    isLoading,
    updateFilters,
    clearFilters,
    loadCandidates,
    deleteCandidate,
    updateCandidateStatus,
    updateCandidateRole
  };
}
