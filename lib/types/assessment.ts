import { Question, Answer, QuestionType } from './question';

// Assessment Section interface
export interface AssessmentSection {
  id: string;
  name: string;
  questionType: QuestionType; // Each section has one question type
  duration: number; // Duration in minutes for this section
  questions: Question[];
}

// Assessment interface
export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number; // Total duration (sum of all section durations)
  totalPoints: number;
  sections?: AssessmentSection[]; // New section-based structure
  questions: Question[]; // Legacy flat structure for backward compatibility
  createdAt: string;
}

// User answer for a specific question
export interface UserAnswer {
  questionId: string;
  answer: Answer;
  isAnswered: boolean;
  // Coding-specific fields
  codingScore?: number;  // Score returned from backend
  testResults?: TestCaseResult[];  // Store test results
}

// Track section progress
export interface SectionProgress {
  sectionId: string;
  isCompleted: boolean;
  startTime?: number;
  endTime?: number;
  timeSpent: number; // in seconds
}

// Assessment result
export interface AssessmentResult {
  assessmentId: string;
  userAnswers: UserAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number; // Time taken in seconds
  submittedAt: string;
  sectionProgress?: SectionProgress[]; // Track progress for each section
}

// Code execution result (from Judge0)
export interface CodeExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

// Test case result
export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: string;
  error?: string;
}
