import { questionBankService } from '@/lib/services/questionBankService';
import { allSampleQuestions } from '@/lib/data/sampleQuestions';

/**
 * Seeds the question bank with sample questions
 */
export async function seedQuestionBank(): Promise<void> {
  try {
    const existingQuestions = await questionBankService.getAllQuestions();

    console.log(`Current question count: ${existingQuestions.length}`);
    console.log('Adding sample questions...');

    for (const question of allSampleQuestions) {
      try {
        await questionBankService.addQuestion(question);
        console.log(`Added question: ${question.text.substring(0, 50)}...`);
      } catch (error: any) {
        console.error(`Failed to add question: ${error.message}`);
      }
    }

    console.log(`Successfully attempted to seed ${allSampleQuestions.length} questions!`);
    console.log('Breakdown:');
    console.log('- 10 MCQ questions');
    console.log('- 10 True/False questions');
    console.log('- 10 Descriptive questions');
    console.log('- 10 Coding questions');
  } catch (error: any) {
    console.error('Error seeding questions:', error);
    throw error;
  }
}

/**
 * Seeds sample questions without duplicates (checks existing IDs)
 */
export async function seedWithoutDuplicates(): Promise<number> {
  try {
    const existingQuestions = await questionBankService.getAllQuestions();
    const existingIds = new Set(existingQuestions.map(q => q.id));

    let addedCount = 0;
    for (const question of allSampleQuestions) {
      if (!existingIds.has(question.id)) {
        try {
          await questionBankService.addQuestion(question);
          addedCount++;
        } catch (error: any) {
          console.error(`Failed to add question ${question.id}:`, error.message);
        }
      }
    }

    console.log(`Added ${addedCount} new questions (skipped ${allSampleQuestions.length - addedCount} duplicates)`);
    return addedCount;
  } catch (error: any) {
    console.error('Error seeding without duplicates:', error);
    throw error;
  }
}

/**
 * Force seeds the question bank (adds all sample questions)
 */
export async function forceSeedQuestionBank(): Promise<void> {
  try {
    console.log('Force seeding question bank...');

    for (const question of allSampleQuestions) {
      try {
        await questionBankService.addQuestion(question);
      } catch (error: any) {
        console.error(`Failed to add question: ${error.message}`);
      }
    }

    console.log(`Force seeded ${allSampleQuestions.length} questions!`);
  } catch (error: any) {
    console.error('Error force seeding:', error);
    throw error;
  }
}
