'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { QuestionType } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, TestCase, MCQOption } from '@/lib/types/question';
import type { Assessment } from '@/lib/types/assessment';
import { generateStarterCode, suggestFunctionName, generateAllStarterCode, detectFunctionSignature } from '@/lib/utils/code-templates';

export default function CreateAssessmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
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

  const addMcqOption = () => {
    const newId = String.fromCharCode(97 + mcqOptions.length); // a, b, c, d, ...
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

  const handleAutoGenerateStarterCode = () => {
    // Detect function signature from problem statement or title
    const signature = detectFunctionSignature(codingProblemStatement || codingText);

    if (!signature) {
      alert('Could not detect function signature. Please provide more details in the problem statement.');
      return;
    }

    // Generate starter code for primary language
    const primaryCode = generateStarterCode(
      codingPrimaryLanguage,
      signature.name,
      signature.parameters
    );

    // Generate for all allowed languages
    const allCodes = generateAllStarterCode(
      codingPrimaryLanguage,
      primaryCode,
      codingAllowedLanguages
    );

    setCodingStarterCode({
      javascript: allCodes.javascript || '',
      python: allCodes.python || '',
      cpp: allCodes.cpp || '',
      java: allCodes.java || ''
    });
  };

  const handlePrimaryLanguageChange = (lang: string) => {
    setCodingPrimaryLanguage(lang);

    // Ensure primary language is in allowed languages
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

  const resetQuestionForm = () => {
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

  const addQuestion = () => {
    const questionId = `q${questions.length + 1}`;

    let newQuestion: Question;

    switch (currentQuestionType) {
      case QuestionType.MCQ:
        newQuestion = {
          id: questionId,
          type: QuestionType.MCQ,
          text: mcqText,
          points: mcqPoints,
          options: mcqOptions,
          correctAnswers: mcqCorrectAnswers,
          multipleAnswers: mcqMultipleAnswers
        } as MCQQuestion;
        break;

      case QuestionType.TRUE_FALSE:
        newQuestion = {
          id: questionId,
          type: QuestionType.TRUE_FALSE,
          text: tfText,
          points: tfPoints,
          correctAnswer: tfCorrectAnswer
        } as TrueFalseQuestion;
        break;

      case QuestionType.DESCRIPTIVE:
        newQuestion = {
          id: questionId,
          type: QuestionType.DESCRIPTIVE,
          text: descText,
          points: descPoints,
          maxLength: descMaxLength
        } as DescriptiveQuestion;
        break;

      case QuestionType.CODING:
        newQuestion = {
          id: questionId,
          type: QuestionType.CODING,
          text: codingText,
          problemStatement: codingProblemStatement,
          points: codingPoints,
          starterCode: codingStarterCode,
          testCases: codingTestCases,
          allowedLanguages: codingAllowedLanguages
        } as CodingQuestion;
        break;

      default:
        return;
    }

    setQuestions([...questions, newQuestion]);
    resetQuestionForm();
    setShowQuestionForm(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveAssessment = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const newAssessment: Assessment = {
      id: String(Date.now()),
      title,
      description,
      duration,
      totalPoints,
      questions,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage for now
    const existingAssessments = JSON.parse(localStorage.getItem('custom_assessments') || '[]');
    localStorage.setItem('custom_assessments', JSON.stringify([...existingAssessments, newAssessment]));

    alert('Assessment created successfully!');
    router.push('/admin/assessments');
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

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
              <p className="text-muted-foreground">Create a new assessment with custom questions</p>
            </div>
          </div>

          {/* Assessment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the assessment"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Total Questions:</span> {questions.length}</div>
                  <div><span className="font-medium">Total Points:</span> {totalPoints}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {questions.map((q, index) => (
                  <div key={q.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <div className="font-medium">Q{index + 1}. {q.text}</div>
                      <div className="text-sm text-muted-foreground">
                        Type: {q.type.replace('_', ' ').toUpperCase()} • Points: {q.points}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(q.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add Question Button */}
          {!showQuestionForm && (
            <Button onClick={() => setShowQuestionForm(true)} className="gap-2 w-full">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          )}

          {/* Question Form */}
          {showQuestionForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Type Selector */}
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={currentQuestionType}
                    onValueChange={(value) => setCurrentQuestionType(value as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuestionType.MCQ}>Multiple Choice</SelectItem>
                      <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                      <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
                      <SelectItem value={QuestionType.CODING}>Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* MCQ Form */}
                {currentQuestionType === QuestionType.MCQ && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={mcqText}
                        onChange={(e) => setMcqText(e.target.value)}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={mcqPoints}
                        onChange={(e) => setMcqPoints(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multiple"
                        checked={mcqMultipleAnswers}
                        onCheckedChange={(checked) => {
                          setMcqMultipleAnswers(!!checked);
                          setMcqCorrectAnswers([]);
                        }}
                      />
                      <Label htmlFor="multiple">Allow multiple correct answers</Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button variant="outline" size="sm" onClick={addMcqOption}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>

                      {mcqMultipleAnswers ? (
                        // Multiple answers - use checkboxes
                        mcqOptions.map((option) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={mcqCorrectAnswers.includes(option.id)}
                              onCheckedChange={() => toggleMcqCorrectAnswer(option.id)}
                            />
                            <Input
                              value={option.text}
                              onChange={(e) => updateMcqOption(option.id, e.target.value)}
                              placeholder={`Option ${option.id.toUpperCase()}`}
                              className="flex-1"
                            />
                            {mcqOptions.length > 2 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeMcqOption(option.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        // Single answer - use radio group
                        <RadioGroup
                          value={mcqCorrectAnswers[0] || ''}
                          onValueChange={(value) => setMcqCorrectAnswers([value])}
                        >
                          {mcqOptions.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                              <Input
                                value={option.text}
                                onChange={(e) => updateMcqOption(option.id, e.target.value)}
                                placeholder={`Option ${option.id.toUpperCase()}`}
                                className="flex-1"
                              />
                              {mcqOptions.length > 2 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeMcqOption(option.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                )}

                {/* True/False Form */}
                {currentQuestionType === QuestionType.TRUE_FALSE && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={tfText}
                        onChange={(e) => setTfText(e.target.value)}
                        placeholder="Enter your true/false question"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={tfPoints}
                        onChange={(e) => setTfPoints(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <RadioGroup
                        value={tfCorrectAnswer.toString()}
                        onValueChange={(value) => setTfCorrectAnswer(value === 'true')}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Descriptive Form */}
                {currentQuestionType === QuestionType.DESCRIPTIVE && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={descText}
                        onChange={(e) => setDescText(e.target.value)}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={descPoints}
                        onChange={(e) => setDescPoints(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Length (optional)</Label>
                      <Input
                        type="number"
                        value={descMaxLength || ''}
                        onChange={(e) => setDescMaxLength(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Leave empty for no limit"
                      />
                    </div>
                  </div>
                )}

                {/* Coding Form */}
                {currentQuestionType === QuestionType.CODING && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Title</Label>
                      <Input
                        value={codingText}
                        onChange={(e) => setCodingText(e.target.value)}
                        placeholder="e.g., Array Sum"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Problem Statement</Label>
                      <Textarea
                        value={codingProblemStatement}
                        onChange={(e) => setCodingProblemStatement(e.target.value)}
                        placeholder="Describe the coding problem in detail. Mention the function name and parameters if possible (e.g., 'Write a function arraySum that takes an array...')"
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Include the function name in your description to help auto-generate starter code
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={codingPoints}
                        onChange={(e) => setCodingPoints(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Programming Language</Label>
                      <Select value={codingPrimaryLanguage} onValueChange={handlePrimaryLanguageChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Choose the language you're most comfortable with
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Starter Code ({codingPrimaryLanguage.toUpperCase()})</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAutoGenerateStarterCode}
                          disabled={!codingProblemStatement && !codingText}
                        >
                          Auto-Generate
                        </Button>
                      </div>
                      <Textarea
                        value={codingStarterCode[codingPrimaryLanguage as keyof typeof codingStarterCode]}
                        onChange={(e) => handlePrimaryCodeChange(e.target.value)}
                        placeholder={`Write or auto-generate starter code for ${codingPrimaryLanguage}...`}
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Click "Auto-Generate" to create starter code based on your problem statement
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Additional Languages (Optional)</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvancedLanguages(!showAdvancedLanguages)}
                        >
                          {showAdvancedLanguages ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      {showAdvancedLanguages && (
                        <div className="space-y-3 border rounded-md p-4 bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            Enable additional languages. Starter code will be auto-translated from {codingPrimaryLanguage}.
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {['javascript', 'python', 'cpp', 'java']
                              .filter(lang => lang !== codingPrimaryLanguage)
                              .map((lang) => (
                                <div key={lang} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={lang}
                                    checked={codingAllowedLanguages.includes(lang)}
                                    onCheckedChange={() => toggleLanguage(lang)}
                                  />
                                  <Label htmlFor={lang}>{lang.toUpperCase()}</Label>
                                </div>
                              ))}
                          </div>
                          {codingAllowedLanguages.filter(l => l !== codingPrimaryLanguage).length > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAutoGenerateStarterCode}
                              className="w-full"
                            >
                              Generate Code for All Languages
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Test Cases</Label>
                        <Button variant="outline" size="sm" onClick={addTestCase}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Test Case
                        </Button>
                      </div>

                      {codingTestCases.map((tc, index) => (
                        <div key={tc.id} className="p-4 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Test Case {index + 1}</Label>
                            {codingTestCases.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTestCase(tc.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Input</Label>
                            <Input
                              value={tc.input}
                              onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                              placeholder="e.g., [1, 2, 3]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Expected Output</Label>
                            <Input
                              value={tc.expectedOutput}
                              onChange={(e) => updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                              placeholder="e.g., 6"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`hidden-${tc.id}`}
                              checked={tc.isHidden}
                              onCheckedChange={(checked) => updateTestCase(tc.id, 'isHidden', !!checked)}
                            />
                            <Label htmlFor={`hidden-${tc.id}`}>Hidden test case</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={addQuestion} className="flex-1">
                    Add Question
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQuestionForm(false);
                      resetQuestionForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Assessment */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={saveAssessment}
              disabled={!title || questions.length === 0}
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
