// Question types enum
export enum QuestionType {
  MCQ = 'mcq',
  TRUE_FALSE = 'true_false',
  DESCRIPTIVE = 'descriptive',
  CODING = 'coding'
}

// Question difficulty levels
export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Question metadata for question bank
export interface QuestionMetadata {
  topic?: string;
  domain?: string;
  difficulty?: QuestionDifficulty;
  createdAt?: string;
  updatedAt?: string;
}

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  metadata?: QuestionMetadata;
}

// MCQ Question
export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: QuestionType.MCQ;
  options: MCQOption[];
  correctAnswers: string[]; // IDs of correct options
  multipleAnswers: boolean; // true for multiple choice, false for single choice
}

// True/False Question
export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionType.TRUE_FALSE;
  correctAnswer: boolean;
}

// Descriptive Question
export interface DescriptiveQuestion extends BaseQuestion {
  type: QuestionType.DESCRIPTIVE;
  maxLength?: number; // Optional character limit
}

// Data Structure Types for LeetCode-style questions
export type DataStructureType =
  | 'array'
  | 'linkedlist'
  | 'tree'
  | 'string'
  | 'number'
  | 'boolean'
  | 'linkedlist-pair'  // For questions with 2 linked lists
  | 'matrix'           // 2D arrays
  | 'graph';           // Graph data structure

// Coding Question
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean; // Some test cases might be hidden from students

  // NEW: Add type metadata for LeetCode-style data structures
  inputType?: DataStructureType;
  outputType?: DataStructureType;
}

export interface CodingQuestion extends BaseQuestion {
  type: QuestionType.CODING;
  problemStatement: string;
  starterCode: { [language: string]: string }; // Default code for each language
  testCases: TestCase[];
  allowedLanguages: string[]; // e.g., ['javascript', 'python', 'cpp', 'java']
  functionName?: string; // Name of the function students should implement
}

// Union type for all question types
export type Question = MCQQuestion | TrueFalseQuestion | DescriptiveQuestion | CodingQuestion;

// User answer types
export type MCQAnswer = string[]; // Array of selected option IDs
export type TrueFalseAnswer = boolean;
export type DescriptiveAnswer = string;

export interface CodingAnswer {
  code: string;
  language: string;
}

export type Answer = MCQAnswer | TrueFalseAnswer | DescriptiveAnswer | CodingAnswer;
