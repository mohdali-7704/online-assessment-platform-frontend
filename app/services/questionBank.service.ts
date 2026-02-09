import apiClient from '../api';
import { Question, QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion } from '@/lib/types/question';

// Backend API response types (snake_case from backend)
interface BackendQuestionResponse {
  id: string;
  question_type: string;
  difficulty: string;
  topic: string;
  domain: string;
  question_text: string;
  points: number;
  question_data: any;
  created_at: string;
}

// Backend API request types (snake_case for backend)
interface BackendQuestionCreate {
  question_type: string;
  difficulty: string;
  topic: string;
  domain: string;
  question_text: string;
  points: number;
  question_data: any;
}

/**
 * Transform frontend Question format to backend API format
 */
function transformToBackendFormat(question: Question): BackendQuestionCreate {
  let questionData: any = {};

  switch (question.type) {
    case QuestionType.MCQ:
      const mcq = question as MCQQuestion;
      questionData = {
        type: 'mcq',
        options: mcq.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          is_correct: mcq.correctAnswers.includes(opt.id),
        })),
        multiple_answers: mcq.multipleAnswers,
      };
      break;

    case QuestionType.TRUE_FALSE:
      const tf = question as TrueFalseQuestion;
      questionData = {
        type: 'true_false',
        correct_answer: tf.correctAnswer,
      };
      break;

    case QuestionType.DESCRIPTIVE:
      const desc = question as DescriptiveQuestion;
      questionData = {
        type: 'descriptive',
        max_length: desc.maxLength || null,
        expected_keywords: null,
        reference_answer: null,
      };
      break;

    case QuestionType.CODING:
      const coding = question as CodingQuestion;
      questionData = {
        type: 'coding',
        problem_statement: coding.problemStatement,
        starter_code: coding.starterCode,
        test_cases: coding.testCases.map((tc) => ({
          id: tc.id,
          input: tc.input,
          expected_output: tc.expectedOutput,
          is_hidden: tc.isHidden,
        })),
        allowed_languages: coding.allowedLanguages,
      };
      break;
  }

  return {
    question_type: question.type,
    difficulty: question.metadata?.difficulty || QuestionDifficulty.MEDIUM,
    topic: question.metadata?.topic || '',
    domain: question.metadata?.domain || '',
    question_text: question.text,
    points: question.points,
    question_data: questionData,
  };
}

/**
 * Transform backend API response to frontend Question format
 */
function transformToFrontendFormat(backendQuestion: BackendQuestionResponse): Question {
  const baseQuestion = {
    id: backendQuestion.id,
    text: backendQuestion.question_text,
    points: backendQuestion.points,
    metadata: {
      topic: backendQuestion.topic || undefined,
      domain: backendQuestion.domain || undefined,
      difficulty: backendQuestion.difficulty as QuestionDifficulty,
      createdAt: backendQuestion.created_at,
    },
  };

  const questionData = backendQuestion.question_data;

  switch (backendQuestion.question_type) {
    case 'mcq':
      return {
        ...baseQuestion,
        type: QuestionType.MCQ,
        options: questionData.options,
        correctAnswers: questionData.correctAnswers,
        multipleAnswers: questionData.multipleAnswers,
      } as MCQQuestion;

    case 'true_false':
      return {
        ...baseQuestion,
        type: QuestionType.TRUE_FALSE,
        correctAnswer: questionData.correctAnswer,
      } as TrueFalseQuestion;

    case 'descriptive':
      return {
        ...baseQuestion,
        type: QuestionType.DESCRIPTIVE,
        maxLength: questionData.maxLength,
      } as DescriptiveQuestion;

    case 'coding':
      return {
        ...baseQuestion,
        type: QuestionType.CODING,
        problemStatement: questionData.problemStatement,
        starterCode: questionData.starterCode,
        testCases: questionData.testCases,
        allowedLanguages: questionData.allowedLanguages,
      } as CodingQuestion;

    default:
      throw new Error(`Unknown question type: ${backendQuestion.question_type}`);
  }
}

/**
 * Question Bank Service - Backend API Integration
 */
class QuestionBankAPIService {
  private readonly baseUrl = '/api/questions';

  /**
   * Get all questions from the backend
   */
  async getAllQuestions(): Promise<Question[]> {
    try {
      const response = await apiClient.get<BackendQuestionResponse[]>(this.baseUrl);
      return response.data.map(transformToFrontendFormat);
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Get a single question by ID
   */
  async getQuestionById(id: string): Promise<Question | null> {
    try {
      const response = await apiClient.get<BackendQuestionResponse>(`${this.baseUrl}/${id}`);
      return transformToFrontendFormat(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching question:', error);
      throw error;
    }
  }

  /**
   * Create a new question
   */
  async addQuestion(question: Question): Promise<Question> {
    try {
      const backendFormat = transformToBackendFormat(question);
      const response = await apiClient.post<BackendQuestionResponse>(this.baseUrl, backendFormat);
      return transformToFrontendFormat(response.data);
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Update an existing question
   */
  async updateQuestion(id: string, question: Question): Promise<Question> {
    try {
      const backendFormat = transformToBackendFormat(question);
      const response = await apiClient.put<BackendQuestionResponse>(`${this.baseUrl}/${id}`, backendFormat);
      return transformToFrontendFormat(response.data);
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Delete a question
   */
  async deleteQuestion(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const questionBankService = new QuestionBankAPIService();

// Export predefined categories (these could also be fetched from the backend if needed)
export const PREDEFINED_TOPICS = [
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Databases',
  'System Design',
  'Object-Oriented Programming',
  'Functional Programming',
  'Testing',
  'Security',
  'Networking',
];

export const PREDEFINED_DOMAINS = [
  'Computer Science',
  'Software Engineering',
  'DevOps',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'Cloud Computing',
  'Machine Learning',
  'Data Science',
];
