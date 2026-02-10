import { backendClient } from '@/lib/api/backend-client';
import { Candidate, CreateCandidateInput, UpdateCandidateInput, CandidateStats, CandidateCredentials } from '@/lib/types/candidate';

class CandidateService {
  private readonly baseUrl = '/candidates';

  // ============= CRUD Operations =============

  /**
   * Get all candidates with optional filters
   */
  async getAllCandidates(filters?: {
    role?: string;
    status?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Omit<Candidate, 'password'>[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await backendClient.get(`${this.baseUrl}?${params.toString()}`);

      // Transform snake_case to camelCase
      return response.data.map((candidate: any) => ({
        id: candidate.id,
        username: candidate.username,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        role: candidate.role,
        status: candidate.status,
        department: candidate.department,
        phone: candidate.phone,
        createdAt: candidate.created_at,
        lastLogin: candidate.last_login
      }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  /**
   * Get candidate by ID
   */
  async getCandidateById(id: string): Promise<Omit<Candidate, 'password'> | null> {
    try {
      const response = await backendClient.get(`${this.baseUrl}/${id}`);
      const candidate = response.data;

      return {
        id: candidate.id,
        username: candidate.username,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        role: candidate.role,
        status: candidate.status,
        department: candidate.department,
        phone: candidate.phone,
        createdAt: candidate.created_at,
        lastLogin: candidate.last_login
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  /**
   * Get candidate by username (for authentication)
   */
  async getCandidateByUsername(username: string): Promise<Candidate | null> {
    try {
      const candidates = await this.getAllCandidates({ search: username });
      return candidates.find(c => c.username === username) as Candidate || null;
    } catch (error) {
      console.error('Error fetching candidate by username:', error);
      return null;
    }
  }

  /**
   * Create new candidate
   */
  async createCandidate(input: CreateCandidateInput): Promise<{
    candidate: Omit<Candidate, 'password'>;
    credentials: CandidateCredentials;
  }> {
    try {
      // Transform camelCase to snake_case for backend
      const payload = {
        username: input.username,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        password: input.password,
        role: input.role,
        status: input.status || 'active',
        department: input.department,
        phone: input.phone
      };

      const response = await backendClient.post(this.baseUrl, payload);
      const candidate = response.data;

      const candidateWithoutPassword = {
        id: candidate.id,
        username: candidate.username,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        role: candidate.role,
        status: candidate.status,
        department: candidate.department,
        phone: candidate.phone,
        createdAt: candidate.created_at,
        lastLogin: candidate.last_login
      };

      const credentials: CandidateCredentials = {
        username: input.username,
        password: input.password,
        generatedAt: new Date().toISOString()
      };

      return { candidate: candidateWithoutPassword, credentials };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      console.error('Error creating candidate:', error);
      throw error;
    }
  }

  /**
   * Bulk create candidates
   */
  async bulkCreateCandidates(candidates: CreateCandidateInput[]): Promise<{
    successCount: number;
    errorCount: number;
    errors: string[];
    createdCandidates: Omit<Candidate, 'password'>[];
  }> {
    try {
      // Transform camelCase to snake_case
      const payload = {
        candidates: candidates.map(c => ({
          username: c.username,
          first_name: c.firstName,
          last_name: c.lastName,
          email: c.email,
          password: c.password,
          role: c.role,
          status: c.status || 'active',
          department: c.department,
          phone: c.phone
        }))
      };

      const response = await backendClient.post(`${this.baseUrl}/bulk`, payload);
      const result = response.data;

      return {
        successCount: result.success_count,
        errorCount: result.error_count,
        errors: result.errors,
        createdCandidates: result.created_candidates.map((c: any) => ({
          id: c.id,
          username: c.username,
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          role: c.role,
          status: c.status,
          department: c.department,
          phone: c.phone,
          createdAt: c.created_at,
          lastLogin: c.last_login
        }))
      };
    } catch (error) {
      console.error('Error bulk creating candidates:', error);
      throw error;
    }
  }

  /**
   * Import candidates from CSV file
   */
  async importFromCSV(file: File): Promise<{
    successCount: number;
    errorCount: number;
    errors: string[];
    createdCandidates: Omit<Candidate, 'password'>[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await backendClient.post(`${this.baseUrl}/import-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;

      return {
        successCount: result.success_count,
        errorCount: result.error_count,
        errors: result.errors,
        createdCandidates: result.created_candidates.map((c: any) => ({
          id: c.id,
          username: c.username,
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          role: c.role,
          status: c.status,
          department: c.department,
          phone: c.phone,
          createdAt: c.created_at,
          lastLogin: c.last_login
        }))
      };
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  }

  /**
   * Update candidate
   */
  async updateCandidate(id: string, input: UpdateCandidateInput): Promise<Omit<Candidate, 'password'> | null> {
    try {
      // Transform camelCase to snake_case
      const payload: any = {};
      if (input.firstName !== undefined) payload.first_name = input.firstName;
      if (input.lastName !== undefined) payload.last_name = input.lastName;
      if (input.email !== undefined) payload.email = input.email;
      if (input.password !== undefined) payload.password = input.password;
      if (input.role !== undefined) payload.role = input.role;
      if (input.status !== undefined) payload.status = input.status;
      if (input.department !== undefined) payload.department = input.department;
      if (input.phone !== undefined) payload.phone = input.phone;

      const response = await backendClient.put(`${this.baseUrl}/${id}`, payload);
      const candidate = response.data;

      return {
        id: candidate.id,
        username: candidate.username,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        role: candidate.role,
        status: candidate.status,
        department: candidate.department,
        phone: candidate.phone,
        createdAt: candidate.created_at,
        lastLogin: candidate.last_login
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      console.error('Error updating candidate:', error);
      throw error;
    }
  }

  /**
   * Delete candidate
   */
  async deleteCandidate(id: string): Promise<boolean> {
    try {
      await backendClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }

  /**
   * Update candidate status
   */
  async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Omit<Candidate, 'password'> | null> {
    return this.updateCandidate(id, { status });
  }

  /**
   * Update candidate role
   */
  async updateCandidateRole(id: string, role: Candidate['role']): Promise<Omit<Candidate, 'password'> | null> {
    return this.updateCandidate(id, { role });
  }

  /**
   * Get candidate statistics
   */
  async getStats(): Promise<CandidateStats> {
    try {
      const candidates = await this.getAllCandidates();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      return {
        totalCandidates: candidates.length,
        activeCandidates: candidates.filter(c => c.status === 'active').length,
        adminUsers: candidates.filter(c => c.role === 'admin').length,
        newThisWeek: candidates.filter(c => new Date(c.createdAt) > oneWeekAgo).length
      };
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      throw error;
    }
  }

  /**
   * Reset password and return new credentials
   */
  async resetPassword(id: string): Promise<CandidateCredentials | null> {
    try {
      const newPassword = this.generatePassword();
      const candidate = await this.updateCandidate(id, { password: newPassword });

      if (!candidate) return null;

      return {
        username: candidate.username,
        password: newPassword,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Generate random password
   */
  generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // ============= Assessment-Candidate Relationships =============

  /**
   * Add candidates to an assessment
   */
  async addCandidatesToAssessment(
    assessmentId: string,
    candidateEmails?: string[],
    candidateIds?: string[]
  ): Promise<{ message: string; results: any[] }> {
    try {
      const payload: any = {};
      if (candidateEmails) payload.candidate_emails = candidateEmails;
      if (candidateIds) payload.candidate_ids = candidateIds;

      const response = await backendClient.post(
        `${this.baseUrl}/assessments/${assessmentId}/add`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error('Error adding candidates to assessment:', error);
      throw error;
    }
  }

  /**
   * Get candidates for an assessment
   */
  async getAssessmentCandidates(assessmentId: string): Promise<any[]> {
    try {
      const response = await backendClient.get(`${this.baseUrl}/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment candidates:', error);
      throw error;
    }
  }

  /**
   * Remove candidate from assessment
   */
  async removeCandidateFromAssessment(assessmentId: string, candidateId: string): Promise<boolean> {
    try {
      await backendClient.delete(`${this.baseUrl}/assessments/${assessmentId}/${candidateId}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error removing candidate from assessment:', error);
      throw error;
    }
  }
}

export const candidateService = new CandidateService();
