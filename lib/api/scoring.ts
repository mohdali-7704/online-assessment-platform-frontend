import { backendClient } from './backend-client';
import { TestCaseResult } from '../types/question';

export interface CodingScoreRequest {
  questionId: string;
  assessmentId: string;
  code: string;
  language: string;
  testResults: TestCaseResult[];
  totalTestCases: number;
  questionPoints: number;
}

export interface CodingScoreResponse {
  questionId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passedTestCases: number;
  totalTestCases: number;
  message: string;
}

export async function scoreCodingQuestion(
  submission: CodingScoreRequest
): Promise<CodingScoreResponse> {
  try {
    const response = await backendClient.post<CodingScoreResponse>(
      '/api/coding/score',
      submission
    );
    return response.data;
  } catch (error) {
    console.error('Failed to score coding question:', error);
    throw error;
  }
}
