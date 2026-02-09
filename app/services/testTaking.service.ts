import apiClient from '../api';

// Types for test taking
export interface StartTestRequest {
  assessment_id: string;
  user_id: string;
}

export interface Submission {
  id: string;
  assessment_id: string;
  user_id: string;
  started_at: string;
  submitted_at: string | null;
  total_score: number;
  max_score: number;
  percentage: number;
  status: string;
}

export interface TestQuestion {
  id: string;
  question_type: string;
  difficulty: string;
  question_text: string;
  points: number;
  question_data: any;
}

export interface SectionTest {
  section_id: string;
  section_name: string;
  section_order: number;
  duration: number;
  questions: TestQuestion[];
}

export interface AnswerSubmit {
  question_id: string;
  answer_data: any;
}

export interface SectionSubmit {
  section_id: string;
  answers: AnswerSubmit[];
}

export interface GradingResult {
  submission_id: string;
  total_score: number;
  max_score: number;
  percentage: number;
  answers: Array<{
    question_id: string;
    is_correct: string;
    points_earned: number;
    max_points: number;
    question_text: string;
    question_type: string;
    options?: Array<{ id: string; text: string; is_correct: boolean }>;
    user_answer: any;
    correct_answer: any;
  }>;
}

class TestTakingService {
  private readonly baseUrl = '/api/test';

  async startAssessment(assessmentId: string, userId: string): Promise<Submission> {
    const response = await apiClient.post<Submission>(`${this.baseUrl}/start`, {
      assessment_id: assessmentId,
      user_id: userId,
    });
    return response.data;
  }

  async getSectionQuestions(submissionId: string, sectionOrder: number): Promise<SectionTest> {
    const response = await apiClient.get<SectionTest>(
      `${this.baseUrl}/${submissionId}/section/${sectionOrder}`
    );
    return response.data;
  }

  async submitAssessment(submissionId: string, answers: SectionSubmit[]): Promise<GradingResult> {
    const response = await apiClient.post<GradingResult>(
      `${this.baseUrl}/${submissionId}/submit`,
      answers
    );
    return response.data;
  }

  async getSubmission(submissionId: string): Promise<Submission> {
    const response = await apiClient.get<Submission>(`${this.baseUrl}/submission/${submissionId}`);
    return response.data;
  }
}

export const testTakingService = new TestTakingService();
