import { Question } from '@/lib/types/question';

const QUESTION_BANK_KEY = 'question_bank';

export interface QuestionBankService {
  getAllQuestions: () => Question[];
  getQuestionById: (id: string) => Question | undefined;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Question) => void;
  deleteQuestion: (id: string) => void;
  removeDuplicates: () => number;
}

// LocalStorage-based implementation (can be replaced with API calls later)
class LocalStorageQuestionBankService implements QuestionBankService {
  getAllQuestions(): Question[] {
    try {
      const data = localStorage.getItem(QUESTION_BANK_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading question bank:', error);
      return [];
    }
  }

  getQuestionById(id: string): Question | undefined {
    const questions = this.getAllQuestions();
    return questions.find(q => q.id === id);
  }

  addQuestion(question: Question): void {
    const questions = this.getAllQuestions();
    const now = new Date().toISOString();

    const newQuestion = {
      ...question,
      metadata: {
        ...question.metadata,
        createdAt: now,
        updatedAt: now,
      },
    };

    questions.push(newQuestion);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(questions));
  }

  updateQuestion(id: string, updatedQuestion: Question): void {
    const questions = this.getAllQuestions();
    const index = questions.findIndex(q => q.id === id);

    if (index !== -1) {
      const now = new Date().toISOString();
      questions[index] = {
        ...updatedQuestion,
        id, // Preserve the original ID
        metadata: {
          ...updatedQuestion.metadata,
          createdAt: questions[index].metadata?.createdAt || now,
          updatedAt: now,
        },
      };
      localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(questions));
    }
  }

  deleteQuestion(id: string): void {
    const questions = this.getAllQuestions();
    const filtered = questions.filter(q => q.id !== id);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(filtered));
  }

  removeDuplicates(): number {
    const questions = this.getAllQuestions();
    const originalCount = questions.length;

    // Use a Map to keep only the first occurrence of each ID
    const uniqueQuestionsMap = new Map<string, Question>();
    questions.forEach(q => {
      if (!uniqueQuestionsMap.has(q.id)) {
        uniqueQuestionsMap.set(q.id, q);
      }
    });

    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(uniqueQuestions));

    const removedCount = originalCount - uniqueQuestions.length;
    return removedCount;
  }
}

// Export singleton instance
export const questionBankService = new LocalStorageQuestionBankService();

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
