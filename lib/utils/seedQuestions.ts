import { questionBankService } from '@/lib/services/questionBankService';
import { allSampleQuestions } from '@/lib/data/sampleQuestions';

/**
 * Seeds the question bank with sample questions if it's empty
 */
export function seedQuestionBank(): void {
  const existingQuestions = questionBankService.getAllQuestions();

  // Only seed if the question bank is empty
  if (existingQuestions.length === 0) {
    console.log('Question bank is empty. Seeding with sample questions...');

    allSampleQuestions.forEach(question => {
      questionBankService.addQuestion(question);
    });

    console.log(`Successfully seeded ${allSampleQuestions.length} questions to the question bank!`);
    console.log('Breakdown:');
    console.log('- 10 MCQ questions');
    console.log('- 10 True/False questions');
    console.log('- 10 Descriptive questions');
    console.log('- 10 Coding questions');
  } else {
    console.log(`Question bank already has ${existingQuestions.length} questions. Skipping seed.`);
  }
}

/**
 * Seeds sample questions without duplicates (checks existing IDs)
 */
export function seedWithoutDuplicates(): number {
  const existingQuestions = questionBankService.getAllQuestions();
  const existingIds = new Set(existingQuestions.map(q => q.id));

  let addedCount = 0;
  allSampleQuestions.forEach(question => {
    if (!existingIds.has(question.id)) {
      questionBankService.addQuestion(question);
      addedCount++;
    }
  });

  console.log(`Added ${addedCount} new questions (skipped ${allSampleQuestions.length - addedCount} duplicates)`);
  return addedCount;
}

/**
 * Force seeds the question bank (replaces all existing questions)
 */
export function forceSeedQuestionBank(): void {
  console.log('Force seeding question bank...');

  // Clear existing questions by setting empty array
  localStorage.setItem('question_bank', JSON.stringify([]));

  // Add all sample questions
  allSampleQuestions.forEach(question => {
    questionBankService.addQuestion(question);
  });

  console.log(`Successfully force seeded ${allSampleQuestions.length} questions to the question bank!`);
}
