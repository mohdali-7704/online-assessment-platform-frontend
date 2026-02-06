'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { QuestionType } from '@/lib/types/question';
import type { Assessment } from '@/lib/types/assessment';

// Import reusable components
import {
  AssessmentDetailsForm,
  SectionManager,
  QuestionForm,
  QuestionBankSelector
} from '@/components/admin/assessment-forms';

// Import custom hooks
import { useSectionManagement } from '@/lib/hooks/useSectionManagement';
import { useQuestionForms } from '@/lib/hooks/useQuestionForms';
import { useQuestionBank } from '@/lib/hooks/useQuestionBank';

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  // Use custom hooks
  const sectionManager = useSectionManagement([{
    id: 's1',
    name: 'Section 1',
    questionType: QuestionType.MCQ,
    duration: 15,
    questions: []
  }]);

  const questionForms = useQuestionForms();
  const questionBank = useQuestionBank();

  const handleAddQuestion = () => {
    if (!sectionManager.currentSection) return;

    const question = questionForms.buildQuestion(sectionManager.currentSection.questionType);
    if (question) {
      sectionManager.addQuestionToSection(question);
      questionForms.resetForm();
      setShowQuestionForm(false);
    }
  };

  const handleAddFromBank = () => {
    const questions = questionBank.getSelectedQuestions();
    questions.forEach(q => sectionManager.addQuestionToSection(q));
    questionBank.resetFilters();
    setShowQuestionBank(false);
  };

  const handleOpenQuestionBank = (sectionId: string) => {
    sectionManager.setCurrentSectionId(sectionId);
    const section = sectionManager.sections.find(s => s.id === sectionId);
    if (section) {
      questionBank.loadQuestions(section.questionType);
      setShowQuestionBank(true);
      setShowQuestionForm(false);
    }
  };

  const saveAssessment = () => {
    if (!title.trim()) {
      alert('Please enter an assessment title.');
      return;
    }

    if (sectionManager.sections.length === 0) {
      alert('Please add at least one section.');
      return;
    }

    if (sectionManager.sections.some(s => s.questions.length === 0)) {
      alert('All sections must have at least one question.');
      return;
    }

    // Calculate totals
    const totalDuration = sectionManager.getTotalDuration();
    const totalPoints = sectionManager.getTotalPoints();

    // Flatten questions for backward compatibility
    const allQuestions = sectionManager.sections.flatMap(s => s.questions);

    const newAssessment: Assessment = {
      id: String(Date.now()),
      title,
      description,
      duration: totalDuration,
      totalPoints,
      sections: sectionManager.sections,
      questions: allQuestions,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingAssessments = JSON.parse(localStorage.getItem('custom_assessments') || '[]');
    localStorage.setItem('custom_assessments', JSON.stringify([...existingAssessments, newAssessment]));

    alert('Assessment created successfully!');
    router.push('/admin/assessments');
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Create Assessment</h2>
              <p className="text-muted-foreground">Create a new section-based assessment</p>
            </div>
          </div>

          {/* Assessment Details Form */}
          <AssessmentDetailsForm
            title={title}
            description={description}
            totalSections={sectionManager.sections.length}
            totalQuestions={sectionManager.getTotalQuestions()}
            totalDuration={sectionManager.getTotalDuration()}
            totalPoints={sectionManager.getTotalPoints()}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />

          {/* Section Manager */}
          <SectionManager
            sections={sectionManager.sections}
            currentSectionId={sectionManager.currentSectionId}
            onSectionAdd={sectionManager.addSection}
            onSectionRemove={sectionManager.removeSection}
            onSectionUpdate={sectionManager.updateSection}
            onSectionSelect={sectionManager.setCurrentSectionId}
            onSectionMoveUp={sectionManager.moveSectionUp}
            onSectionMoveDown={sectionManager.moveSectionDown}
            onQuestionRemove={sectionManager.removeQuestionFromSection}
            onAddNewQuestion={(sectionId) => {
              sectionManager.setCurrentSectionId(sectionId);
              setShowQuestionForm(true);
              setShowQuestionBank(false);
            }}
            onSelectFromBank={handleOpenQuestionBank}
          />

          {/* Question Form */}
          {showQuestionForm && sectionManager.currentSection && (
            <QuestionForm
              questionType={sectionManager.currentSection.questionType}
              sectionName={sectionManager.currentSection.name}
              {...questionForms}
              onSubmit={handleAddQuestion}
              onCancel={() => {
                setShowQuestionForm(false);
                questionForms.resetForm();
              }}
            />
          )}

          {/* Question Bank Selector */}
          {showQuestionBank && sectionManager.currentSection && (
            <QuestionBankSelector
              questionType={sectionManager.currentSection.questionType}
              sectionName={sectionManager.currentSection.name}
              bankQuestions={questionBank.bankQuestions}
              filteredQuestions={questionBank.filteredBankQuestions}
              selectedQuestionIds={questionBank.selectedQuestionIds}
              searchQuery={questionBank.searchQuery}
              difficultyFilter={questionBank.difficultyFilter}
              topicFilter={questionBank.topicFilter}
              domainFilter={questionBank.domainFilter}
              onSearchChange={questionBank.setSearchQuery}
              onDifficultyFilterChange={questionBank.setDifficultyFilter}
              onTopicFilterChange={questionBank.setTopicFilter}
              onDomainFilterChange={questionBank.setDomainFilter}
              onQuestionToggle={questionBank.toggleQuestionSelection}
              onAddSelected={handleAddFromBank}
              onCancel={() => {
                setShowQuestionBank(false);
                questionBank.resetFilters();
              }}
            />
          )}

          {/* Save Assessment */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={saveAssessment}
              disabled={!title || sectionManager.getTotalQuestions() === 0}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save Assessment
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
