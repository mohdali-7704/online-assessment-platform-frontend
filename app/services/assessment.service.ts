import apiClient from '../api';
import { sectionsService } from './sections.service';

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

// Backend API request types (snake_case for backend)
interface BackendAssessmentCreate {
  title: string;
  description?: string | null;
  sections: any[];
}

// Frontend types
export interface Assessment {
  id: string;
  title: string;
  description?: string | null;
  totalDuration: number;
  totalPoints: number;
  status: string;
  createdAt: string;
}

export interface SectionData {
  name: string;
  duration: number;
  questionType: string;
  questions: string[]; // Array of question IDs
}

export interface AssessmentCreatePayload {
  title: string;
  description?: string | null;
  sections: SectionData[];
}

/**
 * Transform frontend Assessment format to backend API format
 */
function transformToBackendFormat(payload: AssessmentCreatePayload): BackendAssessmentCreate {
  return {
    title: payload.title,
    description: payload.description || null,
    sections: payload.sections,
  };
}

/**
 * Transform backend API response to frontend Assessment format
 */
function transformToFrontendFormat(backendAssessment: BackendAssessmentResponse): Assessment {
  return {
    id: backendAssessment.id,
    title: backendAssessment.title,
    description: backendAssessment.description,
    totalDuration: backendAssessment.total_duration,
    totalPoints: backendAssessment.total_points,
    status: backendAssessment.status,
    createdAt: backendAssessment.created_at,
  };
}

/**
 * Assessment Service - Backend API Integration
 */
class AssessmentAPIService {
  private readonly baseUrl = '/api/assessments';

  /**
   * Get all assessments from the backend
   */
  async getAllAssessments(): Promise<Assessment[]> {
    try {
      const response = await apiClient.get<BackendAssessmentResponse[]>(this.baseUrl);
      return response.data.map(transformToFrontendFormat);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  /**
   * Get a single assessment by ID
   */
  async getAssessmentById(id: string): Promise<Assessment | null> {
    try {
      const response = await apiClient.get<BackendAssessmentResponse>(`${this.baseUrl}/${id}`);
      return transformToFrontendFormat(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching assessment:', error);
      throw error;
    }
  }

  /**
   * Create a new assessment with sections and questions
   */
  async createAssessment(payload: AssessmentCreatePayload): Promise<Assessment> {
    try {
      // 1. Create the assessment (without sections for now)
      const totalDuration = payload.sections.reduce((sum, s) => sum + s.duration, 0);
      const response = await apiClient.post<BackendAssessmentResponse>(this.baseUrl, {
        title: payload.title,
        description: payload.description || null,
        sections: [] // Backend expects sections array but we'll create them separately
      });

      const assessment = response.data;

      // 2. Create sections for this assessment
      for (let i = 0; i < payload.sections.length; i++) {
        const sectionData = payload.sections[i];

        const section = await sectionsService.createSection(assessment.id, {
          section_order: i,
          section_name: sectionData.name,
          question_type: sectionData.questionType,
          duration: sectionData.duration
        });

        // 3. Assign questions to this section
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

  /**
   * Delete an assessment
   */
  async deleteAssessment(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const assessmentService = new AssessmentAPIService();