import { useState } from 'react';
import { QuestionType } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, TestCase, MCQOption } from '@/lib/types/question';

export function useQuestionForms() {
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

  // MCQ Operations
  const addMcqOption = () => {
    const newId = String.fromCharCode(97 + mcqOptions.length);
    setMcqOptions([...mcqOptions, { id: newId, text: '' }]);
  };

  const removeMcqOption = (id: string) => {
    setMcqOptions(mcqOptions.filter(opt => opt.id !== id));
    setMcqCorrectAnswers(mcqCorrectAnswers.filter(ans => ans !== id));
  };

  const updateMcqOption = (id: string, text: string) => {
    setMcqOptions(mcqOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const toggleMcqCorrectAnswer = (id: string) => {
    if (mcqMultipleAnswers) {
      if (mcqCorrectAnswers.includes(id)) {
        setMcqCorrectAnswers(mcqCorrectAnswers.filter(ans => ans !== id));
      } else {
        setMcqCorrectAnswers([...mcqCorrectAnswers, id]);
      }
    } else {
      setMcqCorrectAnswers([id]);
    }
  };

  // Coding Operations
  const addTestCase = () => {
    const newId = `t${codingTestCases.length + 1}`;
    setCodingTestCases([...codingTestCases, { id: newId, input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (id: string) => {
    setCodingTestCases(codingTestCases.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setCodingTestCases(codingTestCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  const toggleLanguage = (lang: string) => {
    if (codingAllowedLanguages.includes(lang)) {
      setCodingAllowedLanguages(codingAllowedLanguages.filter(l => l !== lang));
    } else {
      setCodingAllowedLanguages([...codingAllowedLanguages, lang]);
    }
  };

  const handlePrimaryLanguageChange = (lang: string) => {
    setCodingPrimaryLanguage(lang);
    if (!codingAllowedLanguages.includes(lang)) {
      setCodingAllowedLanguages([lang, ...codingAllowedLanguages]);
    }
  };

  const handlePrimaryCodeChange = (code: string) => {
    setCodingStarterCode(prev => ({
      ...prev,
      [codingPrimaryLanguage]: code
    }));
  };

  const resetForm = () => {
    setMcqText('');
    setMcqPoints(10);
    setMcqOptions([{ id: 'a', text: '' }, { id: 'b', text: '' }]);
    setMcqCorrectAnswers([]);
    setMcqMultipleAnswers(false);

    setTfText('');
    setTfPoints(10);
    setTfCorrectAnswer(true);

    setDescText('');
    setDescPoints(10);
    setDescMaxLength(undefined);

    setCodingText('');
    setCodingProblemStatement('');
    setCodingPoints(25);
    setCodingPrimaryLanguage('javascript');
    setCodingStarterCode({ javascript: '', python: '', cpp: '', java: '' });
    setCodingTestCases([{ id: 't1', input: '', expectedOutput: '', isHidden: false }]);
    setCodingAllowedLanguages(['javascript', 'python']);
    setShowAdvancedLanguages(false);
  };

  const buildQuestion = (questionType: QuestionType): Question | null => {
    const questionId = `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (questionType) {
      case QuestionType.MCQ:
        if (!mcqText.trim() || mcqOptions.some(opt => !opt.text.trim()) || mcqCorrectAnswers.length === 0) {
          alert('Please fill in all required fields and select at least one correct answer.');
          return null;
        }
        return {
          id: questionId,
          type: QuestionType.MCQ,
          text: mcqText,
          points: mcqPoints,
          options: mcqOptions,
          correctAnswers: mcqCorrectAnswers,
          multipleAnswers: mcqMultipleAnswers
        } as MCQQuestion;

      case QuestionType.TRUE_FALSE:
        if (!tfText.trim()) {
          alert('Please fill in the question text.');
          return null;
        }
        return {
          id: questionId,
          type: QuestionType.TRUE_FALSE,
          text: tfText,
          points: tfPoints,
          correctAnswer: tfCorrectAnswer
        } as TrueFalseQuestion;

      case QuestionType.DESCRIPTIVE:
        if (!descText.trim()) {
          alert('Please fill in the question text.');
          return null;
        }
        return {
          id: questionId,
          type: QuestionType.DESCRIPTIVE,
          text: descText,
          points: descPoints,
          maxLength: descMaxLength
        } as DescriptiveQuestion;

      case QuestionType.CODING:
        if (!codingText.trim() || !codingProblemStatement.trim()) {
          alert('Please fill in the question title and problem statement.');
          return null;
        }
        return {
          id: questionId,
          type: QuestionType.CODING,
          text: codingText,
          problemStatement: codingProblemStatement,
          points: codingPoints,
          starterCode: codingStarterCode,
          testCases: codingTestCases,
          allowedLanguages: codingAllowedLanguages
        } as CodingQuestion;

      default:
        return null;
    }
  };

  return {
    // MCQ
    mcqText, setMcqText,
    mcqPoints, setMcqPoints,
    mcqOptions, setMcqOptions,
    mcqCorrectAnswers, setMcqCorrectAnswers,
    mcqMultipleAnswers, setMcqMultipleAnswers,
    addMcqOption,
    removeMcqOption,
    updateMcqOption,
    toggleMcqCorrectAnswer,

    // True/False
    tfText, setTfText,
    tfPoints, setTfPoints,
    tfCorrectAnswer, setTfCorrectAnswer,

    // Descriptive
    descText, setDescText,
    descPoints, setDescPoints,
    descMaxLength, setDescMaxLength,

    // Coding
    codingText, setCodingText,
    codingProblemStatement, setCodingProblemStatement,
    codingPoints, setCodingPoints,
    codingPrimaryLanguage, setCodingPrimaryLanguage,
    codingStarterCode, setCodingStarterCode,
    codingTestCases, setCodingTestCases,
    codingAllowedLanguages, setCodingAllowedLanguages,
    showAdvancedLanguages, setShowAdvancedLanguages,
    addTestCase,
    removeTestCase,
    updateTestCase,
    toggleLanguage,
    handlePrimaryLanguageChange,
    handlePrimaryCodeChange,

    // Common
    resetForm,
    buildQuestion
  };
}
