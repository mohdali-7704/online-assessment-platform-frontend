import { UserAnswer, AssessmentResult } from '../types/assessment';
import { Question, QuestionType, MCQQuestion, TrueFalseQuestion, Answer, MCQAnswer, TrueFalseAnswer } from '../types/question';
import { LANGUAGE_IDS } from './constants';

/**
 * Format time from seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case QuestionType.MCQ: {
      const mcqQuestion = question as MCQQuestion;
      const mcqAnswer = answer as MCQAnswer;

      if (mcqQuestion.multipleAnswers) {
        // For multiple choice, check if arrays match (order doesn't matter)
        const correctSet = new Set(mcqQuestion.correctAnswers);
        const answerSet = new Set(mcqAnswer);

        if (correctSet.size !== answerSet.size) return false;

        for (const ans of answerSet) {
          if (!correctSet.has(ans)) return false;
        }
        return true;
      } else {
        // For single choice, check if the single answer matches
        return mcqAnswer.length === 1 && mcqAnswer[0] === mcqQuestion.correctAnswers[0];
      }
    }

    case QuestionType.TRUE_FALSE: {
      const tfQuestion = question as TrueFalseQuestion;
      const tfAnswer = answer as TrueFalseAnswer;
      return tfAnswer === tfQuestion.correctAnswer;
    }

    case QuestionType.DESCRIPTIVE:
      // Descriptive questions need manual grading
      return false;

    case QuestionType.CODING:
      // Coding questions are checked by test cases
      return false;

    default:
      return false;
  }
}

/**
 * Calculate total score for an assessment
 */
export function calculateScore(
  questions: Question[],
  userAnswers: UserAnswer[]
): { score: number; totalPoints: number; percentage: number } {
  let score = 0;
  let totalPoints = 0;

  questions.forEach(question => {
    totalPoints += question.points;

    const userAnswer = userAnswers.find(ua => ua.questionId === question.id);

    if (userAnswer && userAnswer.isAnswered) {
      if (checkAnswer(question, userAnswer.answer)) {
        score += question.points;
      }
    }
  });

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return { score, totalPoints, percentage };
}

/**
 * Get language ID for Judge0 API
 */
export function getLanguageId(language: string): number {
  return LANGUAGE_IDS[language.toLowerCase()] || 63; // Default to JavaScript
}

/**
 * Convert a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate time remaining in seconds
 */
export function calculateTimeRemaining(startTime: number, durationMinutes: number): number {
  const currentTime = Date.now();
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  const totalSeconds = durationMinutes * 60;
  return Math.max(0, totalSeconds - elapsedSeconds);
}

/**
 * Check if an answer is provided
 */
export function isAnswerProvided(answer: Answer | undefined): boolean {
  if (!answer) return false;

  if (Array.isArray(answer)) {
    return answer.length > 0;
  }

  if (typeof answer === 'object' && 'code' in answer) {
    return answer.code.trim().length > 0;
  }

  if (typeof answer === 'string') {
    return answer.trim().length > 0;
  }

  if (typeof answer === 'boolean') {
    return true;
  }

  return false;
}

/**
 * Get question status badge variant
 */
export function getQuestionStatusVariant(isAnswered: boolean, isCurrent: boolean): 'default' | 'secondary' | 'outline' {
  if (isCurrent) return 'default';
  if (isAnswered) return 'secondary';
  return 'outline';
}

/**
 * Save answers to local storage
 */
export function saveAnswersToLocalStorage(assessmentId: string, answers: UserAnswer[]): void {
  try {
    localStorage.setItem(`assessment_answers_${assessmentId}`, JSON.stringify(answers));
  } catch (error) {
    console.error('Failed to save answers to local storage:', error);
  }
}

/**
 * Load answers from local storage
 */
export function loadAnswersFromLocalStorage(assessmentId: string): UserAnswer[] | null {
  try {
    const data = localStorage.getItem(`assessment_answers_${assessmentId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load answers from local storage:', error);
    return null;
  }
}

/**
 * Clear answers from local storage
 */
export function clearAnswersFromLocalStorage(assessmentId: string): void {
  try {
    localStorage.removeItem(`assessment_answers_${assessmentId}`);
    localStorage.removeItem(`assessment_start_time_${assessmentId}`);
  } catch (error) {
    console.error('Failed to clear answers from local storage:', error);
  }
}
