import { Question, Answer } from './question';

// Assessment interface
export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number; // Duration in minutes
  totalPoints: number;
  questions: Question[];
  createdAt: string;
}

// User answer for a specific question
export interface UserAnswer {
  questionId: string;
  answer: Answer;
  isAnswered: boolean;
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
