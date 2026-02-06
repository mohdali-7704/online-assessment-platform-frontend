import { useState } from 'react';
import { AssessmentSection, Question } from '@/lib/types/assessment';
import { QuestionType } from '@/lib/types/question';

export function useSectionManagement(initialSections: AssessmentSection[] = []) {
  const [sections, setSections] = useState<AssessmentSection[]>(initialSections);
  const [currentSectionId, setCurrentSectionId] = useState<string>(
    initialSections.length > 0 ? initialSections[0].id : ''
  );

  const addSection = () => {
    const newId = `s${sections.length + 1}`;
    const newSection: AssessmentSection = {
      id: newId,
      name: `Section ${sections.length + 1}`,
      questionType: QuestionType.MCQ,
      duration: 15,
      questions: []
    };
    setSections([...sections, newSection]);
    setCurrentSectionId(newId);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length === 1) {
      alert('You must have at least one section.');
      return;
    }
    const filtered = sections.filter(s => s.id !== sectionId);
    setSections(filtered);
    if (currentSectionId === sectionId) {
      setCurrentSectionId(filtered[0].id);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
  };

  const getCurrentSection = () => sections.find(s => s.id === currentSectionId);

  const addQuestionToSection = (question: Question) => {
    const section = getCurrentSection();
    if (!section) return;

    updateSection(section.id, {
      questions: [...section.questions, question]
    });
  };

  const removeQuestionFromSection = (sectionId: string, questionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      questions: section.questions.filter(q => q.id !== questionId)
    });
  };

  const getTotalDuration = () => sections.reduce((sum, s) => sum + s.duration, 0);
  const getTotalQuestions = () => sections.reduce((sum, s) => sum + s.questions.length, 0);
  const getTotalPoints = () => sections.reduce((sum, s) =>
    sum + s.questions.reduce((qSum, q) => qSum + q.points, 0), 0
  );

  return {
    sections,
    setSections,
    currentSectionId,
    setCurrentSectionId,
    currentSection: getCurrentSection(),
    addSection,
    removeSection,
    updateSection,
    moveSectionUp,
    moveSectionDown,
    addQuestionToSection,
    removeQuestionFromSection,
    getTotalDuration,
    getTotalQuestions,
    getTotalPoints
  };
}
