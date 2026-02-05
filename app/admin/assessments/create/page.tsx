'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, Plus, Trash2, Save, Database, Search, GripVertical, MoveUp, MoveDown } from 'lucide-react';
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { Question, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion, TestCase, MCQOption } from '@/lib/types/question';
import type { Assessment, AssessmentSection } from '@/lib/types/assessment';
import { generateStarterCode, generateAllStarterCode, detectFunctionSignature } from '@/lib/utils/code-templates';
import { questionBankService, PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/lib/services/questionBankService';
import { Badge } from '@/components/ui/badge';

export default function CreateAssessmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Sections State
  const [sections, setSections] = useState<AssessmentSection[]>([
    {
      id: 's1',
      name: 'Section 1',
      questionType: QuestionType.MCQ,
      duration: 15,
      questions: []
    }
  ]);
  const [currentSectionId, setCurrentSectionId] = useState<string>('s1');

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  // Question Bank State
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [filteredBankQuestions, setFilteredBankQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

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

  // Section Management Functions
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

  // Question Form Functions
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
    const section = getCurrentSection();
    if (!section) return;

    const questionId = `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let newQuestion: Question;

    switch (section.questionType) {
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
          multipleAnswers: mcqMultipleAnswers
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
          correctAnswer: tfCorrectAnswer
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
          maxLength: descMaxLength
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
          allowedLanguages: codingAllowedLanguages
        } as CodingQuestion;
        break;

      default:
        return;
    }

    addQuestionToSection(newQuestion);
    resetQuestionForm();
    setShowQuestionForm(false);
  };

  // Question Bank Functions
  const loadQuestionBank = () => {
    const section = getCurrentSection();
    if (!section) return;

    const allQuestions = questionBankService.getAllQuestions();
    // Filter by section's question type
    const filteredByType = allQuestions.filter(q => q.type === section.questionType);
    setBankQuestions(filteredByType);
    setFilteredBankQuestions(filteredByType);
  };

  const applyBankFilters = () => {
    let filtered = [...bankQuestions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => q.text.toLowerCase().includes(query));
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.difficulty === difficultyFilter);
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.topic === topicFilter);
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.domain === domainFilter);
    }

    setFilteredBankQuestions(filtered);
  };

  const toggleQuestionSelection = (questionId: string) => {
    const newSelection = new Set(selectedQuestionIds);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestionIds(newSelection);
  };

  const addSelectedQuestions = () => {
    const section = getCurrentSection();
    if (!section) return;

    const selectedQuestions = bankQuestions.filter(q => selectedQuestionIds.has(q.id));

    // Add questions with new IDs to avoid conflicts
    const questionsWithNewIds = selectedQuestions.map(q => ({
      ...q,
      id: `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    updateSection(section.id, {
      questions: [...section.questions, ...questionsWithNewIds]
    });

    setSelectedQuestionIds(new Set());
    setShowQuestionBank(false);
    setSearchQuery('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setDomainFilter('all');
  };

  const openQuestionBank = () => {
    loadQuestionBank();
    setShowQuestionBank(true);
    setShowQuestionForm(false);
  };

  const closeQuestionBank = () => {
    setShowQuestionBank(false);
    setSelectedQuestionIds(new Set());
    setSearchQuery('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setDomainFilter('all');
  };

  // Apply filters whenever they change
  useEffect(() => {
    if (showQuestionBank) {
      applyBankFilters();
    }
  }, [searchQuery, difficultyFilter, topicFilter, domainFilter, bankQuestions, showQuestionBank]);

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ:
        return 'MCQ';
      case QuestionType.TRUE_FALSE:
        return 'True/False';
      case QuestionType.DESCRIPTIVE:
        return 'Descriptive';
      case QuestionType.CODING:
        return 'Coding';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty?: QuestionDifficulty) => {
    switch (difficulty) {
      case QuestionDifficulty.EASY:
        return 'bg-green-100 text-green-800';
      case QuestionDifficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case QuestionDifficulty.HARD:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique topics and domains
  const availableTopics = Array.from(new Set([
    ...PREDEFINED_TOPICS,
    ...bankQuestions.map(q => q.metadata?.topic).filter(Boolean) as string[]
  ])).sort();

  const availableDomains = Array.from(new Set([
    ...PREDEFINED_DOMAINS,
    ...bankQuestions.map(q => q.metadata?.domain).filter(Boolean) as string[]
  ])).sort();

  const saveAssessment = () => {
    if (!title.trim()) {
      alert('Please enter an assessment title.');
      return;
    }

    if (sections.length === 0) {
      alert('Please add at least one section.');
      return;
    }

    if (sections.some(s => s.questions.length === 0)) {
      alert('All sections must have at least one question.');
      return;
    }

    // Calculate totals
    const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
    const totalPoints = sections.reduce((sum, s) =>
      sum + s.questions.reduce((qSum, q) => qSum + q.points, 0), 0
    );

    // Flatten questions for backward compatibility
    const allQuestions = sections.flatMap(s => s.questions);

    const newAssessment: Assessment = {
      id: String(Date.now()),
      title,
      description,
      duration: totalDuration,
      totalPoints,
      sections,
      questions: allQuestions,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingAssessments = JSON.parse(localStorage.getItem('custom_assessments') || '[]');
    localStorage.setItem('custom_assessments', JSON.stringify([...existingAssessments, newAssessment]));

    alert('Assessment created successfully!');
    router.push('/admin/assessments');
  };

  const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const totalPoints = sections.reduce((sum, s) =>
    sum + s.questions.reduce((qSum, q) => qSum + q.points, 0), 0
  );

  const currentSection = getCurrentSection();

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

          {/* Assessment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Full Stack Developer Assessment"
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

              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Total Sections:</span> {sections.length}</div>
                  <div><span className="font-medium">Total Questions:</span> {totalQuestions}</div>
                  <div><span className="font-medium">Total Duration:</span> {totalDuration} minutes</div>
                  <div><span className="font-medium">Total Points:</span> {totalPoints}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sections ({sections.length})</CardTitle>
                <Button onClick={addSection} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    currentSectionId === section.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle & Move Buttons */}
                    <div className="flex flex-col gap-1 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Section Details */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Section Name</Label>
                          <Input
                            value={section.name}
                            onChange={(e) => updateSection(section.id, { name: e.target.value })}
                            placeholder="Section name"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Question Type</Label>
                          <Select
                            value={section.questionType}
                            onValueChange={(value) => updateSection(section.id, {
                              questionType: value as QuestionType,
                              questions: [] // Clear questions when type changes
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={QuestionType.MCQ}>MCQ</SelectItem>
                              <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                              <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
                              <SelectItem value={QuestionType.CODING}>Coding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={section.duration}
                            onChange={(e) => updateSection(section.id, { duration: Number(e.target.value) })}
                            min={1}
                          />
                        </div>
                      </div>

                      {/* Section Questions */}
                      <div>
                        <div className="text-sm font-medium mb-2">
                          Questions ({section.questions.length}) • {section.questions.reduce((sum, q) => sum + q.points, 0)} points
                        </div>
                        {section.questions.length > 0 && (
                          <div className="space-y-2">
                            {section.questions.map((q, qIndex) => (
                              <div key={q.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm">
                                <div className="flex-1">
                                  <div className="font-medium">Q{qIndex + 1}. {q.text}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {getQuestionTypeLabel(q.type)} • {q.points} points
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeQuestionFromSection(section.id, q.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section Actions */}
                      {currentSectionId === section.id && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSectionId(section.id);
                              setShowQuestionForm(true);
                              setShowQuestionBank(false);
                            }}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add New Question
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSectionId(section.id);
                              openQuestionBank();
                            }}
                            className="gap-2"
                          >
                            <Database className="w-4 h-4" />
                            Select from Bank
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Section Actions */}
                    <div className="flex flex-col gap-2">
                      {currentSectionId !== section.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentSectionId(section.id)}
                        >
                          Select
                        </Button>
                      )}
                      {sections.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Question Form */}
          {showQuestionForm && currentSection && (
            <Card>
              <CardHeader>
                <CardTitle>Add {getQuestionTypeLabel(currentSection.questionType)} Question to {currentSection.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* MCQ Form */}
                {currentSection.questionType === QuestionType.MCQ && (
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
                {currentSection.questionType === QuestionType.TRUE_FALSE && (
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
                {currentSection.questionType === QuestionType.DESCRIPTIVE && (
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

                {/* Coding Form */}
                {currentSection.questionType === QuestionType.CODING && (
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

          {/* Question Bank Selection */}
          {showQuestionBank && currentSection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Select {getQuestionTypeLabel(currentSection.questionType)} Questions for {currentSection.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="bank-search">Search by Question Title</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="bank-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                        <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic Filter */}
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {availableTopics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Domain Filter */}
                  <div className="space-y-2">
                    <Label>Domain</Label>
                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {availableDomains.map(domain => (
                          <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                  Showing {filteredBankQuestions.length} of {bankQuestions.length} {getQuestionTypeLabel(currentSection.questionType)} questions • {selectedQuestionIds.size} selected
                </div>

                {/* Questions List */}
                <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                  {filteredBankQuestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {bankQuestions.length === 0
                        ? `No ${getQuestionTypeLabel(currentSection.questionType)} questions in the bank yet.`
                        : 'No questions match your filters.'}
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filteredBankQuestions.map((question) => (
                        <div
                          key={question.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedQuestionIds.has(question.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleQuestionSelection(question.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedQuestionIds.has(question.id)}
                              onCheckedChange={() => toggleQuestionSelection(question.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1 space-y-2">
                              {/* Question Text */}
                              <div className="font-medium">
                                {question.text}
                              </div>

                              {/* Metadata Badges */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                  {question.points} points
                                </Badge>
                                {question.metadata?.difficulty && (
                                  <Badge className={getDifficultyColor(question.metadata.difficulty)}>
                                    {question.metadata.difficulty}
                                  </Badge>
                                )}
                                {question.metadata?.topic && (
                                  <Badge variant="secondary">
                                    {question.metadata.topic}
                                  </Badge>
                                )}
                                {question.metadata?.domain && (
                                  <Badge variant="secondary">
                                    {question.metadata.domain}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={addSelectedQuestions}
                    disabled={selectedQuestionIds.size === 0}
                    className="flex-1"
                  >
                    Add Selected ({selectedQuestionIds.size})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={closeQuestionBank}
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
              disabled={!title || totalQuestions === 0}
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
