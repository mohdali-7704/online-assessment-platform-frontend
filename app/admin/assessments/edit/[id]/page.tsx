'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { QuestionType } from '@/lib/types/question';
import { assessmentService } from '@/lib/services/assessmentService';
import type { AssessmentCreatePayload } from '@/lib/services/assessmentService';
import { questionBankService } from '@/lib/services/questionBankService';

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

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('published'); // Default to published
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  // Use custom hooks
  const sectionManager = useSectionManagement([]);
  const questionForms = useQuestionForms();
  const questionBank = useQuestionBank();

  // Load assessment
  useEffect(() => {
    if (!assessmentId) return;

    const loadAssessment = async () => {
      try {
        const loadedAssessment = await assessmentService.getAssessmentFull(assessmentId);

        if (!loadedAssessment) {
          alert('Assessment not found');
          router.push('/admin/assessments');
          return;
        }

        setTitle(loadedAssessment.title);
        setDescription(loadedAssessment.description || '');
        setStatus(loadedAssessment.status || 'published');

        // Load sections
        if (loadedAssessment.sections && loadedAssessment.sections.length > 0) {
          sectionManager.setSections(loadedAssessment.sections);
          sectionManager.setCurrentSectionId(loadedAssessment.sections[0].id);
        } else {
          // No sections - create default
          sectionManager.setSections([{
            id: 's1',
            name: 'Section 1',
            questionType: QuestionType.MCQ,
            duration: 15,
            questions: []
          }]);
          sectionManager.setCurrentSectionId('s1');
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error loading assessment:', error);
        alert(`Failed to load assessment: ${error.response?.data?.detail || error.message}`);
        router.push('/admin/assessments');
      }
    };

    loadAssessment();
  }, [assessmentId, router]);

  const handleAddQuestion = async () => {
    if (!sectionManager.currentSection) return;

    const question = questionForms.buildQuestion(sectionManager.currentSection.questionType);
    if (!question) return;

    try {
      console.log('[EditAssessment] Question built with temp ID:', question.id);

      // Save question to backend first
      const savedQuestion = await questionBankService.createQuestion(question);

      console.log('[EditAssessment] Question saved with backend ID:', savedQuestion.id);
      console.log('[EditAssessment] Saved question data:', savedQuestion);

      // Add the saved question (with real ID) to the section
      sectionManager.addQuestionToSection(savedQuestion);
      questionForms.resetForm();
      setShowQuestionForm(false);
    } catch (error: any) {
      console.error('Error saving question:', error);
      alert(`Failed to save question: ${error.response?.data?.detail || error.message}`);
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

  const saveAssessment = async () => {
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

    try {
      const payload: AssessmentCreatePayload = {
        title,
        description,
        status,
        sections: sectionManager.sections.map(section => ({
          name: section.name,
          duration: section.duration,
          questionType: section.questionType,
          questions: section.questions.map(q => q.id) // Send question IDs
        }))
      };

      console.log('[EditAssessment] Updating assessment with payload:', payload);
      console.log('[EditAssessment] Section question IDs:', payload.sections.map(s => ({ section: s.name, questionIds: s.questions })));

      await assessmentService.updateAssessment(assessmentId, payload);
      alert(`Assessment updated successfully! Status: ${status}`);
      router.push('/admin/assessments');
    } catch (error: any) {
      console.error('Error updating assessment:', error);
      alert(`Failed to update assessment: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

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
              <h2 className="text-3xl font-bold">Edit Assessment</h2>
              <p className="text-muted-foreground">Update section-based assessment</p>
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

          {/* Status Toggle */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Assessment Status</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="status-switch" className="text-base">
                  {status === 'published' ? 'Published' : 'Draft'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {status === 'published'
                    ? 'Assessment will be available to candidates immediately'
                    : 'Assessment will be saved as draft (not visible to candidates)'}
                </p>
              </div>
              <Switch
                id="status-switch"
                checked={status === 'published'}
                onCheckedChange={(checked: boolean) => setStatus(checked ? 'published' : 'draft')}
              />
            </div>
          </div>

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
              Update Assessment
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
