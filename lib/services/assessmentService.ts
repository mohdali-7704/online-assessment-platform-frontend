import apiClient from '@/app/api';
import { sectionsService } from './sectionsService';

// Backend API response types (snake_case from backend)
interface BackendAssessmentResponse {
  id: string;
  title: string;
  description: string | null;
  total_duration: number;
  total_points: number;
  status: string;
  created_at: string;
}

// Frontend types
export interface Assessment {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  totalPoints: number;
  status: string;
  createdAt?: string;
  sections?: any[];
  questions?: any[];
}

export interface SectionData {
  name: string;
  duration: number;
  questionType: string;
  questions: string[];
}

export interface AssessmentCreatePayload {
  title: string;
  description?: string | null;
  sections: SectionData[];
}

function transformToFrontendFormat(backendAssessment: BackendAssessmentResponse): Assessment {
  return {
    id: backendAssessment.id,
    title: backendAssessment.title,
    description: backendAssessment.description,
    duration: backendAssessment.total_duration,
    totalPoints: backendAssessment.total_points,
    status: backendAssessment.status,
    createdAt: backendAssessment.created_at,
  };
}

class AssessmentAPIService {
  private readonly baseUrl = '/api/assessments';

  async getAllAssessments(): Promise<Assessment[]> {
    try {
      const response = await apiClient.get<BackendAssessmentResponse[]>(this.baseUrl);
      return response.data.map(transformToFrontendFormat);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    try {
      const response = await apiClient.get<BackendAssessmentResponse>(`${this.baseUrl}/${id}`);
      return transformToFrontendFormat(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return undefined;
      }
      console.error('Error fetching assessment:', error);
      throw error;
    }
  }

  async getAssessmentFull(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/full`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return undefined;
      }
      console.error('Error fetching full assessment:', error);
      throw error;
    }
  }

  async createAssessment(payload: AssessmentCreatePayload): Promise<Assessment> {
    try {
      const response = await apiClient.post<BackendAssessmentResponse>(this.baseUrl, {
        title: payload.title,
        description: payload.description || null,
        sections: payload.sections
      });

      return transformToFrontendFormat(response.data);
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async updateAssessment(id: string, payload: AssessmentCreatePayload): Promise<Assessment> {
    try {
      const response = await apiClient.put<BackendAssessmentResponse>(`${this.baseUrl}/${id}`, {
        title: payload.title,
        description: payload.description || null,
        sections: payload.sections
      });

      return transformToFrontendFormat(response.data);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  async deleteAssessment(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }
}

export const assessmentService = new AssessmentAPIService();
