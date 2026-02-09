import { Question, QuestionDifficulty } from '@/lib/types/question';
import type { MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion } from '@/lib/types/question';
import apiClient from '@/app/api';

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

export interface QuestionBankService {
  getAllQuestions: () => Promise<Question[]>;
  getQuestionById: (id: string) => Promise<Question | undefined>;
  addQuestion: (question: Question) => Promise<Question>;
  createQuestion: (question: Question) => Promise<Question>;
  updateQuestion: (id: string, question: Question) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<void>;
  removeDuplicates: () => Promise<number>;
}

/**
 * Transform frontend Question format to backend API format
 */
function transformToBackendFormat(question: Question): BackendQuestionCreate {
  let questionData: any = {};

  switch (question.type) {
    case 'mcq':
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

    case 'true_false':
      const tf = question as TrueFalseQuestion;
      questionData = {
        type: 'true_false',
        correct_answer: tf.correctAnswer,
      };
      break;

    case 'descriptive':
      const desc = question as DescriptiveQuestion;
      questionData = {
        type: 'descriptive',
        max_length: desc.maxLength || null,
        expected_keywords: null,
        reference_answer: null,
      };
      break;

    case 'coding':
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
        type: 'mcq',
        options: questionData.options,
        correctAnswers: questionData.correctAnswers,
        multipleAnswers: questionData.multipleAnswers,
      } as MCQQuestion;

    case 'true_false':
      return {
        ...baseQuestion,
        type: 'true_false',
        correctAnswer: questionData.correctAnswer,
      } as TrueFalseQuestion;

    case 'descriptive':
      return {
        ...baseQuestion,
        type: 'descriptive',
        maxLength: questionData.maxLength,
      } as DescriptiveQuestion;

    case 'coding':
      return {
        ...baseQuestion,
        type: 'coding',
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
 * Backend API-based Question Bank Service
 */
class BackendQuestionBankService implements QuestionBankService {
  private readonly baseUrl = '/api/questions';

  async getAllQuestions(): Promise<Question[]> {
    try {
      const response = await apiClient.get<BackendQuestionResponse[]>(this.baseUrl);
      return response.data.map(transformToFrontendFormat);
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    try {
      const response = await apiClient.get<BackendQuestionResponse>(`${this.baseUrl}/${id}`);
      return transformToFrontendFormat(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return undefined;
      }
      console.error('Error fetching question:', error);
      throw error;
    }
  }

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

  async deleteQuestion(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async removeDuplicates(): Promise<number> {
    // This doesn't apply to backend - database ensures uniqueness
    console.warn('removeDuplicates is not applicable for backend API');
    return 0;
  }

  // Alias for addQuestion to match naming convention used elsewhere
  async createQuestion(question: Question): Promise<Question> {
    return this.addQuestion(question);
  }
}

// Export singleton instance
export const questionBankService = new BackendQuestionBankService();

// Predefined categories
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
