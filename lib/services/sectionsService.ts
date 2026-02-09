import apiClient from '@/app/api';

export interface SectionCreate {
  section_order: number;
  section_name: string;
  question_type: string;
  duration: number;
}

export interface Section {
  id: string;
  assessment_id: string;
  section_order: number;
  section_name: string;
  question_type: string;
  duration: number;
  created_at: string;
}

export interface QuestionAssignment {
  question_id: string;
  question_order: number;
}

class SectionsService {
  async createSection(assessmentId: string, section: SectionCreate): Promise<Section> {
    const response = await apiClient.post<Section>(
      `/api/assessments/${assessmentId}/sections`,
      section
    );
    return response.data;
  }

  async getSections(assessmentId: string): Promise<Section[]> {
    const response = await apiClient.get<Section[]>(
      `/api/assessments/${assessmentId}/sections`
    );
    return response.data;
  }

  async assignQuestionsToSection(
    sectionId: string,
    assignments: QuestionAssignment[]
  ): Promise<void> {
    await apiClient.post(
      `/api/sections/${sectionId}/questions/bulk`,
      assignments
    );
  }
}

export const sectionsService = new SectionsService();
