'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, MCQOption, TestCase } from '@/lib/types/question';
import { questionBankService } from '@/lib/services/questionBankService';
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

export default function AddQuestionPage() {
  const router = useRouter();

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


  const saveQuestion = () => {
    const questionId = `q${Date.now()}`;

    // Get final topic and domain values
    const finalTopic = topic === 'custom' ? customTopic : topic;
    const finalDomain = domain === 'custom' ? customDomain : domain;

    let newQuestion: Question;

    switch (currentQuestionType) {
      case QuestionType.MCQ:
        if (!mcqText.trim() || mcqOptions.some(opt => !opt.text.trim()) || mcqCorrectAnswers.length === 0) {
          alert('Please fill in all required fields and select at least one correct answer.');
          return;
        }
        newQuestion = {
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
          return;
        }
        newQuestion = {
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
          return;
        }
        newQuestion = {
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
          return;
        }
        newQuestion = {
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
        return;
    }

    questionBankService.addQuestion(newQuestion);
    alert('Question added successfully!');
    router.push('/admin/question-bank');
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <QuestionFormHeader
            title="Add Question"
            description="Add a new question to the question bank"
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
                setCurrentType={setCurrentQuestionType}
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

          <QuestionFormActions onSave={saveQuestion} />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
