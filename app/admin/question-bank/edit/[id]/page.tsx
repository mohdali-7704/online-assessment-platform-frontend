'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, TestCase, MCQOption } from '@/lib/types/question';
import { generateStarterCode, generateAllStarterCode, detectFunctionSignature } from '@/lib/utils/code-templates';
import { questionBankService, PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/lib/services/questionBankService';

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

  // Load question data
  useEffect(() => {
    const question = questionBankService.getQuestionById(questionId);
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
        setCodingStarterCode(coding.starterCode);
        setCodingTestCases(coding.testCases);
        setCodingAllowedLanguages(coding.allowedLanguages);
        break;
    }

    setLoading(false);
  }, [questionId, router]);

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
    const signature = detectFunctionSignature(codingProblemStatement || codingText);

    if (!signature) {
      alert('Could not detect function signature. Please provide more details in the problem statement.');
      return;
    }

    const primaryCode = generateStarterCode(
      codingPrimaryLanguage,
      signature.name,
      signature.parameters
    );

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

  const updateQuestion = () => {
    // Get final topic and domain values
    const finalTopic = topic === 'custom' ? customTopic : topic;
    const finalDomain = domain === 'custom' ? customDomain : domain;

    let updatedQuestion: Question;

    switch (currentQuestionType) {
      case QuestionType.MCQ:
        if (!mcqText.trim() || mcqOptions.some(opt => !opt.text.trim()) || mcqCorrectAnswers.length === 0) {
          alert('Please fill in all required fields and select at least one correct answer.');
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
        return;
    }

    questionBankService.updateQuestion(questionId, updatedQuestion);
    alert('Question updated successfully!');
    router.push('/admin/question-bank');
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

  // Extended topics and domains with "custom" option
  const topicsWithCustom = [...PREDEFINED_TOPICS, 'Custom'];
  const domainsWithCustom = [...PREDEFINED_DOMAINS, 'Custom'];

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
              <h2 className="text-3xl font-bold">Edit Question</h2>
              <p className="text-muted-foreground">Update question details</p>
            </div>
          </div>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Question Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Difficulty */}
                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuestionDifficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                      <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topicsWithCustom.map(t => (
                        <SelectItem key={t} value={t === 'Custom' ? 'custom' : t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {topic === 'custom' && (
                    <Input
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter custom topic"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Domain */}
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domainsWithCustom.map(d => (
                        <SelectItem key={d} value={d === 'Custom' ? 'custom' : d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {domain === 'custom' && (
                    <Input
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="Enter custom domain"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Form - Same as Add Question but cannot change type */}
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Type Display (Non-editable) */}
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Input
                  value={currentQuestionType.replace('_', ' ').toUpperCase()}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Question type cannot be changed after creation
                </p>
              </div>

              {/* MCQ Form */}
              {currentQuestionType === QuestionType.MCQ && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Textarea
                      value={mcqText}
                      onChange={(e) => setMcqText(e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Points *</Label>
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
                      <Label>Options *</Label>
                      <Button variant="outline" size="sm" onClick={addMcqOption}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    {mcqMultipleAnswers ? (
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
                    <Label>Question Text *</Label>
                    <Textarea
                      value={tfText}
                      onChange={(e) => setTfText(e.target.value)}
                      placeholder="Enter your true/false question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Points *</Label>
                    <Input
                      type="number"
                      value={tfPoints}
                      onChange={(e) => setTfPoints(Number(e.target.value))}
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
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
                    <Label>Question Text *</Label>
                    <Textarea
                      value={descText}
                      onChange={(e) => setDescText(e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Points *</Label>
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

              {/* Coding Form - Abbreviated for brevity, same as add page */}
              {currentQuestionType === QuestionType.CODING && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Title *</Label>
                    <Input
                      value={codingText}
                      onChange={(e) => setCodingText(e.target.value)}
                      placeholder="e.g., Array Sum"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Problem Statement *</Label>
                    <Textarea
                      value={codingProblemStatement}
                      onChange={(e) => setCodingProblemStatement(e.target.value)}
                      placeholder="Describe the coding problem in detail..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Points *</Label>
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
                      placeholder={`Write or auto-generate starter code...`}
                      rows={6}
                      className="font-mono text-sm"
                    />
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
            </CardContent>
          </Card>

          {/* Update Button */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={updateQuestion}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Update Question
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
