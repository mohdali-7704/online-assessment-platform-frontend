// Judge0 API Configuration
export const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
export const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || '';

// Language IDs for Judge0 API
export const LANGUAGE_IDS: { [key: string]: number } = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  cpp: 54,        // C++ (GCC 9.2.0)
  java: 62        // Java (OpenJDK 13.0.1)
};

// Language display names
export const LANGUAGE_NAMES: { [key: string]: string } = {
  javascript: 'JavaScript',
  python: 'Python',
  cpp: 'C++',
  java: 'Java'
};

// Timer warning thresholds
export const TIMER_WARNING_THRESHOLD = 5 * 60; // 5 minutes in seconds
export const TIMER_CRITICAL_THRESHOLD = 1 * 60; // 1 minute in seconds

// Score calculation rules
export const PASSING_PERCENTAGE = 60; // Minimum percentage to pass

// Question status colors
export const QUESTION_STATUS = {
  ANSWERED: 'answered',
  UNANSWERED: 'unanswered',
  CURRENT: 'current'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ASSESSMENT_ANSWERS: 'assessment_answers_',
  ASSESSMENT_START_TIME: 'assessment_start_time_'
} as const;
