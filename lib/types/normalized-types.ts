/**
 * Normalized Data Types for PostgreSQL-ready structure
 * This structure allows for question reusability and cleaner data relationships
 */

// ==================== Core Tables ====================

export interface NormalizedAssessment {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  createdAt: string;
  createdBy?: string;
}

export interface QuestionBank {
  id: string;
  type: 'mcq' | 'true_false' | 'descriptive' | 'coding';
  title: string; // Main question text
  points: number;
  createdAt: string;
  createdBy?: string;
}

export interface AssessmentQuestion {
  assessmentId: string;
  questionId: string;
  displayOrder: number;
}

// ==================== Coding Question Tables ====================

export interface CodingProblem {
  questionId: string; // FK to QuestionBank
  problemStatement: string;
  primaryLanguage: string; // The language admin used to create the problem
}

export interface StarterCode {
  id: string;
  codingProblemId: string; // FK to CodingProblem (uses questionId)
  language: string;
  code: string;
}

export interface TestCase {
  id: string;
  codingProblemId: string; // FK to CodingProblem
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  displayOrder: number;
}

export interface AllowedLanguage {
  id: string;
  codingProblemId: string; // FK to CodingProblem
  language: string;
}

// ==================== MCQ Tables ====================

export interface MCQProblem {
  questionId: string; // FK to QuestionBank
  multipleAnswers: boolean;
}

export interface MCQOption {
  id: string;
  mcqProblemId: string; // FK to MCQProblem (uses questionId)
  text: string;
  isCorrect: boolean;
  displayOrder: number;
}

// ==================== True/False Tables ====================

export interface TrueFalseProblem {
  questionId: string; // FK to QuestionBank
  correctAnswer: boolean;
}

// ==================== Descriptive Tables ====================

export interface DescriptiveProblem {
  questionId: string; // FK to QuestionBank
  maxLength?: number;
}

// ==================== Complete Normalized Data Store ====================

export interface NormalizedDataStore {
  assessments: NormalizedAssessment[];
  questions: QuestionBank[];
  assessmentQuestions: AssessmentQuestion[];

  // Coding-specific
  codingProblems: CodingProblem[];
  starterCodes: StarterCode[];
  testCases: TestCase[];
  allowedLanguages: AllowedLanguage[];

  // MCQ-specific
  mcqProblems: MCQProblem[];
  mcqOptions: MCQOption[];

  // True/False-specific
  trueFalseProblems: TrueFalseProblem[];

  // Descriptive-specific
  descriptiveProblems: DescriptiveProblem[];
}

// ==================== Helper Types for Queries ====================

/**
 * Complete question with all related data joined
 */
export interface CompleteQuestion {
  // Base question
  id: string;
  type: 'mcq' | 'true_false' | 'descriptive' | 'coding';
  title: string;
  points: number;
  createdAt: string;
  createdBy?: string;

  // Type-specific data (only one will be populated based on type)
  codingData?: {
    problemStatement: string;
    primaryLanguage: string;
    starterCodes: { language: string; code: string }[];
    testCases: { id: string; input: string; expectedOutput: string; isHidden: boolean; displayOrder: number }[];
    allowedLanguages: string[];
  };

  mcqData?: {
    multipleAnswers: boolean;
    options: { id: string; text: string; isCorrect: boolean; displayOrder: number }[];
  };

  trueFalseData?: {
    correctAnswer: boolean;
  };

  descriptiveData?: {
    maxLength?: number;
  };
}

/**
 * Complete assessment with all questions joined
 */
export interface CompleteAssessment {
  id: string;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  createdBy?: string;
  totalPoints: number; // Computed from questions
  questions: CompleteQuestion[];
}
