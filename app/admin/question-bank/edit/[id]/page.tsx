'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, MCQOption, TestCase } from '@/lib/types/question';
import { questionBankService, PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/app/services/questionBank.service';
import {
  QuestionFormHeader,
  QuestionFormActions,
  QuestionMetadataForm,
  QuestionTypeSelector,
  MCQQuestionForm,
  TrueFalseQuestionForm,
  DescriptiveQuestionForm,
  CodingQuestionForm
} from '@/components/admin/question-forms';

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [loading, setLoading] = useState(true);

  // Metadata State
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(QuestionDifficulty.MEDIUM);

  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>(QuestionType.MCQ);

  // MCQ State
  const [mcqText, setMcqText] = useState('');
  const [mcqPoints, setMcqPoints] = useState(10);
  const [mcqOptions, setMcqOptions] = useState<MCQOption[]>([
    { id: 'a', text: '' },
    { id: 'b', text: '' }
  ]);
  const [mcqCorrectAnswers, setMcqCorrectAnswers] = useState<string[]>([]);
  const [mcqMultipleAnswers, setMcqMultipleAnswers] = useState(false);

  // True/False State
  const [tfText, setTfText] = useState('');
  const [tfPoints, setTfPoints] = useState(10);
  const [tfCorrectAnswer, setTfCorrectAnswer] = useState<boolean>(true);

  // Descriptive State
  const [descText, setDescText] = useState('');
  const [descPoints, setDescPoints] = useState(10);
  const [descMaxLength, setDescMaxLength] = useState<number | undefined>(undefined);

  // Coding State
  const [codingText, setCodingText] = useState('');
  const [codingProblemStatement, setCodingProblemStatement] = useState('');
  const [codingPoints, setCodingPoints] = useState(25);
  const [codingPrimaryLanguage, setCodingPrimaryLanguage] = useState<string>('javascript');
  const [codingStarterCode, setCodingStarterCode] = useState({
    javascript: '',
    python: '',
    cpp: '',
    java: ''
  });
  const [codingTestCases, setCodingTestCases] = useState<TestCase[]>([
    { id: 't1', input: '', expectedOutput: '', isHidden: false }
  ]);
  const [codingAllowedLanguages, setCodingAllowedLanguages] = useState<string[]>(['javascript', 'python']);
  const [showAdvancedLanguages, setShowAdvancedLanguages] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const question = await questionBankService.getQuestionById(questionId);
        if (!question) {
          alert('Question not found!');
          router.push('/admin/question-bank');
          return;
        }

        // Load metadata
        if (question.metadata) {
          setDifficulty(question.metadata.difficulty || QuestionDifficulty.MEDIUM);

          if (question.metadata.topic) {
            if (PREDEFINED_TOPICS.includes(question.metadata.topic)) {
              setTopic(question.metadata.topic);
            } else {
              setTopic('custom');
              setCustomTopic(question.metadata.topic);
            }
          }

          if (question.metadata.domain) {
            if (PREDEFINED_DOMAINS.includes(question.metadata.domain)) {
              setDomain(question.metadata.domain);
            } else {
              setDomain('custom');
              setCustomDomain(question.metadata.domain);
            }
          }
        }

        // Load question type and data
        setCurrentQuestionType(question.type);

        switch (question.type) {
          case QuestionType.MCQ:
            const mcq = question as MCQQuestion;
            setMcqText(mcq.text);
            setMcqPoints(mcq.points);
            setMcqOptions(mcq.options);
            setMcqCorrectAnswers(mcq.correctAnswers);
            setMcqMultipleAnswers(mcq.multipleAnswers);
            break;

          case QuestionType.TRUE_FALSE:
            const tf = question as TrueFalseQuestion;
            setTfText(tf.text);
            setTfPoints(tf.points);
            setTfCorrectAnswer(tf.correctAnswer);
            break;

          case QuestionType.DESCRIPTIVE:
            const desc = question as DescriptiveQuestion;
            setDescText(desc.text);
            setDescPoints(desc.points);
            setDescMaxLength(desc.maxLength);
            break;

          case QuestionType.CODING:
            const coding = question as CodingQuestion;
            setCodingText(coding.text);
            setCodingProblemStatement(coding.problemStatement);
            setCodingPoints(coding.points);
            setCodingStarterCode({
              javascript: coding.starterCode.javascript || '',
              python: coding.starterCode.python || '',
              cpp: coding.starterCode.cpp || '',
              java: coding.starterCode.java || ''
            });
            setCodingTestCases(coding.testCases);
            setCodingAllowedLanguages(coding.allowedLanguages);
            break;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading question:', error);
        alert('Failed to load question. Please try again.');
        router.push('/admin/question-bank');
      }
    };

    loadQuestion();
  }, [questionId, router]);


  const updateQuestion = async () => {
    if (saving) return; // Prevent double submission

    setSaving(true);

    try {
      // Get final topic and domain values
      const finalTopic = topic === 'custom' ? customTopic : topic;
      const finalDomain = domain === 'custom' ? customDomain : domain;

      let updatedQuestion: Question;

      switch (currentQuestionType) {
        case QuestionType.MCQ:
          if (!mcqText.trim() || mcqOptions.some(opt => !opt.text.trim()) || mcqCorrectAnswers.length === 0) {
            alert('Please fill in all required fields and select at least one correct answer.');
            setSaving(false);
            return;
          }
          updatedQuestion = {
            id: questionId,
            type: QuestionType.MCQ,
            text: mcqText,
            points: mcqPoints,
            options: mcqOptions,
            correctAnswers: mcqCorrectAnswers,
            multipleAnswers: mcqMultipleAnswers,
            metadata: {
              topic: finalTopic || undefined,
              domain: finalDomain || undefined,
              difficulty
            }
          } as MCQQuestion;
          break;

        case QuestionType.TRUE_FALSE:
          if (!tfText.trim()) {
            alert('Please fill in the question text.');
            setSaving(false);
            return;
          }
          updatedQuestion = {
            id: questionId,
            type: QuestionType.TRUE_FALSE,
            text: tfText,
            points: tfPoints,
            correctAnswer: tfCorrectAnswer,
            metadata: {
              topic: finalTopic || undefined,
              domain: finalDomain || undefined,
              difficulty
            }
          } as TrueFalseQuestion;
          break;

        case QuestionType.DESCRIPTIVE:
          if (!descText.trim()) {
            alert('Please fill in the question text.');
            setSaving(false);
            return;
          }
          updatedQuestion = {
            id: questionId,
            type: QuestionType.DESCRIPTIVE,
            text: descText,
            points: descPoints,
            maxLength: descMaxLength,
            metadata: {
              topic: finalTopic || undefined,
              domain: finalDomain || undefined,
              difficulty
            }
          } as DescriptiveQuestion;
          break;

        case QuestionType.CODING:
          if (!codingText.trim() || !codingProblemStatement.trim()) {
            alert('Please fill in the question title and problem statement.');
            setSaving(false);
            return;
          }
          updatedQuestion = {
            id: questionId,
            type: QuestionType.CODING,
            text: codingText,
            problemStatement: codingProblemStatement,
            points: codingPoints,
            starterCode: codingStarterCode,
            testCases: codingTestCases,
            allowedLanguages: codingAllowedLanguages,
            metadata: {
              topic: finalTopic || undefined,
              domain: finalDomain || undefined,
              difficulty
            }
          } as CodingQuestion;
          break;

        default:
          setSaving(false);
          return;
      }

      await questionBankService.updateQuestion(questionId, updatedQuestion);
      alert('Question updated successfully!');
      router.push('/admin/question-bank');
    } catch (error: any) {
      console.error('Error updating question:', error);
      alert(`Failed to update question: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <QuestionFormHeader
            title="Edit Question"
            description="Update question details"
          />

          <QuestionMetadataForm
            topic={topic}
            setTopic={setTopic}
            customTopic={customTopic}
            setCustomTopic={setCustomTopic}
            domain={domain}
            setDomain={setDomain}
            customDomain={customDomain}
            setCustomDomain={setCustomDomain}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />

          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuestionTypeSelector
                currentType={currentQuestionType}
                isEditing
              />

              {currentQuestionType === QuestionType.MCQ && (
                <MCQQuestionForm
                  text={mcqText}
                  setText={setMcqText}
                  points={mcqPoints}
                  setPoints={setMcqPoints}
                  options={mcqOptions}
                  setOptions={setMcqOptions}
                  correctAnswers={mcqCorrectAnswers}
                  setCorrectAnswers={setMcqCorrectAnswers}
                  multipleAnswers={mcqMultipleAnswers}
                  setMultipleAnswers={setMcqMultipleAnswers}
                />
              )}

              {currentQuestionType === QuestionType.TRUE_FALSE && (
                <TrueFalseQuestionForm
                  text={tfText}
                  setText={setTfText}
                  points={tfPoints}
                  setPoints={setTfPoints}
                  correctAnswer={tfCorrectAnswer}
                  setCorrectAnswer={setTfCorrectAnswer}
                />
              )}

              {currentQuestionType === QuestionType.DESCRIPTIVE && (
                <DescriptiveQuestionForm
                  text={descText}
                  setText={setDescText}
                  points={descPoints}
                  setPoints={setDescPoints}
                  maxLength={descMaxLength}
                  setMaxLength={setDescMaxLength}
                />
              )}

              {currentQuestionType === QuestionType.CODING && (
                <CodingQuestionForm
                  text={codingText}
                  setText={setCodingText}
                  problemStatement={codingProblemStatement}
                  setProblemStatement={setCodingProblemStatement}
                  points={codingPoints}
                  setPoints={setCodingPoints}
                  primaryLanguage={codingPrimaryLanguage}
                  setPrimaryLanguage={setCodingPrimaryLanguage}
                  starterCode={codingStarterCode}
                  setStarterCode={setCodingStarterCode}
                  testCases={codingTestCases}
                  setTestCases={setCodingTestCases}
                  allowedLanguages={codingAllowedLanguages}
                  setAllowedLanguages={setCodingAllowedLanguages}
                  showAdvancedLanguages={showAdvancedLanguages}
                  setShowAdvancedLanguages={setShowAdvancedLanguages}
                />
              )}
            </CardContent>
          </Card>

          <QuestionFormActions
            onSave={updateQuestion}
            saveLabel={saving ? 'Updating...' : 'Update Question'}
          />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
