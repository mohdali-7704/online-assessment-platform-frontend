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

  async createAssessment(payload: AssessmentCreatePayload): Promise<Assessment> {
    try {
      const response = await apiClient.post<BackendAssessmentResponse>(this.baseUrl, {
        title: payload.title,
        description: payload.description || null,
        sections: []
      });

      const assessment = response.data;

      for (let i = 0; i < payload.sections.length; i++) {
        const sectionData = payload.sections[i];

        const section = await sectionsService.createSection(assessment.id, {
          section_order: i,
          section_name: sectionData.name,
          question_type: sectionData.questionType,
          duration: sectionData.duration
        });

        if (sectionData.questions.length > 0) {
          const assignments = sectionData.questions.map((questionId, index) => ({
            question_id: questionId,
            question_order: index
          }));

          await sectionsService.assignQuestionsToSection(section.id, assignments);
        }
      }

      return transformToFrontendFormat(assessment);
    } catch (error) {
      console.error('Error creating assessment:', error);
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
