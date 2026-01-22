/**
 * Data Transformation Utilities
 * Converts between normalized (PostgreSQL-ready) and legacy (current) data structures
 */

import type {
  NormalizedDataStore,
  CompleteAssessment,
  CompleteQuestion,
} from '@/lib/types/normalized-types';
import type {
  Assessment,
  Question,
  MCQQuestion,
  TrueFalseQuestion,
  DescriptiveQuestion,
  CodingQuestion,
  QuestionType,
} from '@/lib/types/question';

import { normalizedMockData } from '@/data/normalized-mock-data';

/**
 * Converts a complete normalized question to legacy format
 */
export function normalizedQuestionToLegacy(question: CompleteQuestion): Question {
  const base = {
    id: question.id,
    text: question.title,
    points: question.points,
  };

  switch (question.type) {
    case 'mcq':
      if (!question.mcqData) throw new Error(`MCQ data missing for question ${question.id}`);
      return {
        ...base,
        type: 'mcq' as QuestionType,
        options: question.mcqData.options
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(opt => ({ id: opt.id, text: opt.text })),
        correctAnswers: question.mcqData.options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.id),
        multipleAnswers: question.mcqData.multipleAnswers,
      } as MCQQuestion;

    case 'true_false':
      if (!question.trueFalseData) throw new Error(`True/False data missing for question ${question.id}`);
      return {
        ...base,
        type: 'true_false' as QuestionType,
        correctAnswer: question.trueFalseData.correctAnswer,
      } as TrueFalseQuestion;

    case 'descriptive':
      if (!question.descriptiveData) throw new Error(`Descriptive data missing for question ${question.id}`);
      return {
        ...base,
        type: 'descriptive' as QuestionType,
        maxLength: question.descriptiveData.maxLength,
      } as DescriptiveQuestion;

    case 'coding':
      if (!question.codingData) throw new Error(`Coding data missing for question ${question.id}`);

      // Build starterCode object
      const starterCode: { [language: string]: string } = {};
      question.codingData.starterCodes.forEach(sc => {
        starterCode[sc.language] = sc.code;
      });

      return {
        ...base,
        type: 'coding' as QuestionType,
        problemStatement: question.codingData.problemStatement,
        starterCode,
        testCases: question.codingData.testCases
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(tc => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
          })),
        allowedLanguages: question.codingData.allowedLanguages,
      } as CodingQuestion;

    default:
      throw new Error(`Unknown question type: ${question.type}`);
  }
}

/**
 * Converts a complete normalized assessment to legacy format
 */
export function normalizedAssessmentToLegacy(assessment: CompleteAssessment): Assessment {
  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    duration: assessment.duration,
    totalPoints: assessment.totalPoints,
    createdAt: assessment.createdAt,
    questions: assessment.questions.map(normalizedQuestionToLegacy),
  };
}

/**
 * Gets a complete assessment with all joined questions from normalized data
 */
export function getCompleteAssessment(
  assessmentId: string,
  dataStore: NormalizedDataStore = normalizedMockData
): CompleteAssessment | null {
  const assessment = dataStore.assessments.find(a => a.id === assessmentId);
  if (!assessment) return null;

  // Get question IDs for this assessment
  const questionIds = dataStore.assessmentQuestions
    .filter(aq => aq.assessmentId === assessmentId)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(aq => aq.questionId);

  // Get complete questions
  const questions = questionIds
    .map(qid => getCompleteQuestion(qid, dataStore))
    .filter((q): q is CompleteQuestion => q !== null);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return {
    ...assessment,
    totalPoints,
    questions,
  };
}

/**
 * Gets a complete question with all type-specific data
 */
export function getCompleteQuestion(
  questionId: string,
  dataStore: NormalizedDataStore = normalizedMockData
): CompleteQuestion | null {
  const question = dataStore.questions.find(q => q.id === questionId);
  if (!question) return null;

  const base: CompleteQuestion = {
    id: question.id,
    type: question.type,
    title: question.title,
    points: question.points,
    createdAt: question.createdAt,
    createdBy: question.createdBy,
  };

  switch (question.type) {
    case 'mcq':
      const mcqProblem = dataStore.mcqProblems.find(m => m.questionId === questionId);
      if (!mcqProblem) break;

      const options = dataStore.mcqOptions
        .filter(o => o.mcqProblemId === questionId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      base.mcqData = {
        multipleAnswers: mcqProblem.multipleAnswers,
        options,
      };
      break;

    case 'true_false':
      const tfProblem = dataStore.trueFalseProblems.find(t => t.questionId === questionId);
      if (!tfProblem) break;

      base.trueFalseData = {
        correctAnswer: tfProblem.correctAnswer,
      };
      break;

    case 'descriptive':
      const descProblem = dataStore.descriptiveProblems.find(d => d.questionId === questionId);
      if (!descProblem) break;

      base.descriptiveData = {
        maxLength: descProblem.maxLength,
      };
      break;

    case 'coding':
      const codingProblem = dataStore.codingProblems.find(c => c.questionId === questionId);
      if (!codingProblem) break;

      const starterCodes = dataStore.starterCodes
        .filter(sc => sc.codingProblemId === questionId)
        .map(sc => ({ language: sc.language, code: sc.code }));

      const testCases = dataStore.testCases
        .filter(tc => tc.codingProblemId === questionId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const allowedLanguages = dataStore.allowedLanguages
        .filter(al => al.codingProblemId === questionId)
        .map(al => al.language);

      base.codingData = {
        problemStatement: codingProblem.problemStatement,
        primaryLanguage: codingProblem.primaryLanguage,
        starterCodes,
        testCases,
        allowedLanguages,
      };
      break;
  }

  return base;
}

/**
 * Gets all assessments in legacy format
 */
export function getAllLegacyAssessments(
  dataStore: NormalizedDataStore = normalizedMockData
): Assessment[] {
  return dataStore.assessments
    .map(a => getCompleteAssessment(a.id, dataStore))
    .filter((a): a is CompleteAssessment => a !== null)
    .map(normalizedAssessmentToLegacy);
}

/**
 * Gets a single assessment in legacy format by ID
 */
export function getLegacyAssessmentById(
  assessmentId: string,
  dataStore: NormalizedDataStore = normalizedMockData
): Assessment | null {
  const complete = getCompleteAssessment(assessmentId, dataStore);
  if (!complete) return null;
  return normalizedAssessmentToLegacy(complete);
}

/**
 * Gets all questions of a specific type from the question bank
 */
export function getQuestionsByType(
  type: 'mcq' | 'true_false' | 'descriptive' | 'coding',
  dataStore: NormalizedDataStore = normalizedMockData
): CompleteQuestion[] {
  return dataStore.questions
    .filter(q => q.type === type)
    .map(q => getCompleteQuestion(q.id, dataStore))
    .filter((q): q is CompleteQuestion => q !== null);
}

/**
 * Converts a legacy assessment to normalized format (for saving new assessments)
 */
export function legacyAssessmentToNormalized(
  assessment: Assessment
): {
  assessment: CompleteAssessment;
  dataStore: Partial<NormalizedDataStore>;
} {
  const questions: CompleteQuestion[] = [];
  const dataStore: Partial<NormalizedDataStore> = {
    questions: [],
    assessmentQuestions: [],
    codingProblems: [],
    starterCodes: [],
    testCases: [],
    allowedLanguages: [],
    mcqProblems: [],
    mcqOptions: [],
    trueFalseProblems: [],
    descriptiveProblems: [],
  };

  assessment.questions.forEach((q, index) => {
    const baseQuestion = {
      id: q.id,
      type: q.type,
      title: q.text,
      points: q.points,
      createdAt: new Date().toISOString(),
    };

    dataStore.questions!.push(baseQuestion);
    dataStore.assessmentQuestions!.push({
      assessmentId: assessment.id,
      questionId: q.id,
      displayOrder: index + 1,
    });

    const completeQuestion: CompleteQuestion = {
      ...baseQuestion,
    };

    switch (q.type) {
      case 'mcq':
        const mcqQ = q as MCQQuestion;
        dataStore.mcqProblems!.push({
          questionId: q.id,
          multipleAnswers: mcqQ.multipleAnswers,
        });

        mcqQ.options.forEach((opt, optIndex) => {
          dataStore.mcqOptions!.push({
            id: opt.id,
            mcqProblemId: q.id,
            text: opt.text,
            isCorrect: mcqQ.correctAnswers.includes(opt.id),
            displayOrder: optIndex + 1,
          });
        });

        completeQuestion.mcqData = {
          multipleAnswers: mcqQ.multipleAnswers,
          options: mcqQ.options.map((opt, optIndex) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: mcqQ.correctAnswers.includes(opt.id),
            displayOrder: optIndex + 1,
          })),
        };
        break;

      case 'true_false':
        const tfQ = q as TrueFalseQuestion;
        dataStore.trueFalseProblems!.push({
          questionId: q.id,
          correctAnswer: tfQ.correctAnswer,
        });

        completeQuestion.trueFalseData = {
          correctAnswer: tfQ.correctAnswer,
        };
        break;

      case 'descriptive':
        const descQ = q as DescriptiveQuestion;
        dataStore.descriptiveProblems!.push({
          questionId: q.id,
          maxLength: descQ.maxLength,
        });

        completeQuestion.descriptiveData = {
          maxLength: descQ.maxLength,
        };
        break;

      case 'coding':
        const codingQ = q as CodingQuestion;

        // Determine primary language (first allowed language)
        const primaryLanguage = codingQ.allowedLanguages[0] || 'javascript';

        dataStore.codingProblems!.push({
          questionId: q.id,
          problemStatement: codingQ.problemStatement,
          primaryLanguage,
        });

        // Add starter codes
        Object.entries(codingQ.starterCode).forEach(([lang, code]) => {
          dataStore.starterCodes!.push({
            id: `sc_${q.id}_${lang}`,
            codingProblemId: q.id,
            language: lang,
            code,
          });
        });

        // Add test cases
        codingQ.testCases.forEach((tc, tcIndex) => {
          dataStore.testCases!.push({
            id: tc.id,
            codingProblemId: q.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            displayOrder: tcIndex + 1,
          });
        });

        // Add allowed languages
        codingQ.allowedLanguages.forEach((lang) => {
          dataStore.allowedLanguages!.push({
            id: `al_${q.id}_${lang}`,
            codingProblemId: q.id,
            language: lang,
          });
        });

        completeQuestion.codingData = {
          problemStatement: codingQ.problemStatement,
          primaryLanguage,
          starterCodes: Object.entries(codingQ.starterCode).map(([lang, code]) => ({
            language: lang,
            code,
          })),
          testCases: codingQ.testCases.map((tc, tcIndex) => ({
            ...tc,
            displayOrder: tcIndex + 1,
          })),
          allowedLanguages: codingQ.allowedLanguages,
        };
        break;
    }

    questions.push(completeQuestion);
  });

  return {
    assessment: {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      duration: assessment.duration,
      createdAt: assessment.createdAt,
      totalPoints: assessment.totalPoints,
      questions,
    },
    dataStore,
  };
}
