import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { QuestionType } from '@/lib/types/question';
import type { MCQOption, TestCase } from '@/lib/types/question';
import { generateStarterCode, generateAllStarterCode, detectFunctionSignature } from '@/lib/utils/code-templates';
import { Dispatch, SetStateAction } from 'react';

interface QuestionFormProps {
  questionType: QuestionType;
  sectionName: string;

  // MCQ Props
  mcqText: string;
  setMcqText: Dispatch<SetStateAction<string>>;
  mcqPoints: number;
  setMcqPoints: Dispatch<SetStateAction<number>>;
  mcqOptions: MCQOption[];
  mcqCorrectAnswers: string[];
  setMcqCorrectAnswers: Dispatch<SetStateAction<string[]>>;
  mcqMultipleAnswers: boolean;
  setMcqMultipleAnswers: Dispatch<SetStateAction<boolean>>;
  addMcqOption: () => void;
  removeMcqOption: (id: string) => void;
  updateMcqOption: (id: string, text: string) => void;
  toggleMcqCorrectAnswer: (id: string) => void;

  // True/False Props
  tfText: string;
  setTfText: Dispatch<SetStateAction<string>>;
  tfPoints: number;
  setTfPoints: Dispatch<SetStateAction<number>>;
  tfCorrectAnswer: boolean;
  setTfCorrectAnswer: Dispatch<SetStateAction<boolean>>;

  // Descriptive Props
  descText: string;
  setDescText: Dispatch<SetStateAction<string>>;
  descPoints: number;
  setDescPoints: Dispatch<SetStateAction<number>>;
  descMaxLength?: number;
  setDescMaxLength: Dispatch<SetStateAction<number | undefined>>;

  // Coding Props
  codingText: string;
  setCodingText: Dispatch<SetStateAction<string>>;
  codingProblemStatement: string;
  setCodingProblemStatement: Dispatch<SetStateAction<string>>;
  codingPoints: number;
  setCodingPoints: Dispatch<SetStateAction<number>>;
  codingPrimaryLanguage: string;
  codingStarterCode: { javascript: string; python: string; cpp: string; java: string };
  setCodingStarterCode: Dispatch<SetStateAction<{ javascript: string; python: string; cpp: string; java: string }>>;
  codingTestCases: TestCase[];
  codingAllowedLanguages: string[];
  showAdvancedLanguages: boolean;
  setShowAdvancedLanguages: Dispatch<SetStateAction<boolean>>;
  addTestCase: () => void;
  removeTestCase: (id: string) => void;
  updateTestCase: (id: string, field: keyof TestCase, value: any) => void;
  toggleLanguage: (lang: string) => void;
  handlePrimaryLanguageChange: (lang: string) => void;
  handlePrimaryCodeChange: (code: string) => void;

  // Actions
  onSubmit: () => void;
  onCancel: () => void;
}

export default function QuestionForm(props: QuestionFormProps) {
  const getQuestionTypeLabel = () => {
    switch (props.questionType) {
      case QuestionType.MCQ: return 'MCQ';
      case QuestionType.TRUE_FALSE: return 'True/False';
      case QuestionType.DESCRIPTIVE: return 'Descriptive';
      case QuestionType.CODING: return 'Coding';
      default: return props.questionType;
    }
  };

  const handleAutoGenerateStarterCode = () => {
    const signature = detectFunctionSignature(props.codingProblemStatement || props.codingText);
    if (!signature) {
      alert('Could not detect function signature. Please provide more details in the problem statement.');
      return;
    }

    const primaryCode = generateStarterCode(
      props.codingPrimaryLanguage,
      signature.name,
      signature.parameters
    );

    const allCodes = generateAllStarterCode(
      props.codingPrimaryLanguage,
      primaryCode,
      props.codingAllowedLanguages
    );

    props.setCodingStarterCode({
      javascript: allCodes.javascript || '',
      python: allCodes.python || '',
      cpp: allCodes.cpp || '',
      java: allCodes.java || ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add {getQuestionTypeLabel()} Question to {props.sectionName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MCQ Form */}
        {props.questionType === QuestionType.MCQ && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <Textarea
                value={props.mcqText}
                onChange={(e) => props.setMcqText(e.target.value)}
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-2">
              <Label>Points *</Label>
              <Input
                type="number"
                value={props.mcqPoints}
                onChange={(e) => props.setMcqPoints(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiple"
                checked={props.mcqMultipleAnswers}
                onCheckedChange={(checked) => {
                  props.setMcqMultipleAnswers(!!checked);
                  props.setMcqCorrectAnswers([]);
                }}
              />
              <Label htmlFor="multiple">Allow multiple correct answers</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options *</Label>
                <Button variant="outline" size="sm" onClick={props.addMcqOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              {props.mcqMultipleAnswers ? (
                props.mcqOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={props.mcqCorrectAnswers.includes(option.id)}
                      onCheckedChange={() => props.toggleMcqCorrectAnswer(option.id)}
                    />
                    <Input
                      value={option.text}
                      onChange={(e) => props.updateMcqOption(option.id, e.target.value)}
                      placeholder={`Option ${option.id.toUpperCase()}`}
                      className="flex-1"
                    />
                    {props.mcqOptions.length > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.removeMcqOption(option.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <RadioGroup
                  value={props.mcqCorrectAnswers[0] || ''}
                  onValueChange={(value) => props.setMcqCorrectAnswers([value])}
                >
                  {props.mcqOptions.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Input
                        value={option.text}
                        onChange={(e) => props.updateMcqOption(option.id, e.target.value)}
                        placeholder={`Option ${option.id.toUpperCase()}`}
                        className="flex-1"
                      />
                      {props.mcqOptions.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => props.removeMcqOption(option.id)}
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
        {props.questionType === QuestionType.TRUE_FALSE && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <Textarea
                value={props.tfText}
                onChange={(e) => props.setTfText(e.target.value)}
                placeholder="Enter your true/false question"
              />
            </div>

            <div className="space-y-2">
              <Label>Points *</Label>
              <Input
                type="number"
                value={props.tfPoints}
                onChange={(e) => props.setTfPoints(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Correct Answer *</Label>
              <RadioGroup
                value={props.tfCorrectAnswer.toString()}
                onValueChange={(value) => props.setTfCorrectAnswer(value === 'true')}
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
        {props.questionType === QuestionType.DESCRIPTIVE && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <Textarea
                value={props.descText}
                onChange={(e) => props.setDescText(e.target.value)}
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-2">
              <Label>Points *</Label>
              <Input
                type="number"
                value={props.descPoints}
                onChange={(e) => props.setDescPoints(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Length (optional)</Label>
              <Input
                type="number"
                value={props.descMaxLength || ''}
                onChange={(e) => props.setDescMaxLength(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Leave empty for no limit"
              />
            </div>
          </div>
        )}

        {/* Coding Form */}
        {props.questionType === QuestionType.CODING && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question Title *</Label>
              <Input
                value={props.codingText}
                onChange={(e) => props.setCodingText(e.target.value)}
                placeholder="e.g., Array Sum"
              />
            </div>

            <div className="space-y-2">
              <Label>Problem Statement *</Label>
              <Textarea
                value={props.codingProblemStatement}
                onChange={(e) => props.setCodingProblemStatement(e.target.value)}
                placeholder="Describe the coding problem in detail..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Points *</Label>
              <Input
                type="number"
                value={props.codingPoints}
                onChange={(e) => props.setCodingPoints(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Programming Language</Label>
              <Select value={props.codingPrimaryLanguage} onValueChange={props.handlePrimaryLanguageChange}>
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
                <Label>Starter Code ({props.codingPrimaryLanguage.toUpperCase()})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoGenerateStarterCode}
                  disabled={!props.codingProblemStatement && !props.codingText}
                >
                  Auto-Generate
                </Button>
              </div>
              <Textarea
                value={props.codingStarterCode[props.codingPrimaryLanguage]}
                onChange={(e) => props.handlePrimaryCodeChange(e.target.value)}
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
                  onClick={() => props.setShowAdvancedLanguages(!props.showAdvancedLanguages)}
                >
                  {props.showAdvancedLanguages ? 'Hide' : 'Show'}
                </Button>
              </div>
              {props.showAdvancedLanguages && (
                <div className="space-y-3 border rounded-md p-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-2">
                    {['javascript', 'python', 'cpp', 'java']
                      .filter(lang => lang !== props.codingPrimaryLanguage)
                      .map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={lang}
                            checked={props.codingAllowedLanguages.includes(lang)}
                            onCheckedChange={() => props.toggleLanguage(lang)}
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
                <Button variant="outline" size="sm" onClick={props.addTestCase}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Test Case
                </Button>
              </div>

              {props.codingTestCases.map((tc, index) => (
                <div key={tc.id} className="p-4 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Test Case {index + 1}</Label>
                    {props.codingTestCases.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.removeTestCase(tc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Input</Label>
                    <Input
                      value={tc.input}
                      onChange={(e) => props.updateTestCase(tc.id, 'input', e.target.value)}
                      placeholder="e.g., [1, 2, 3]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Expected Output</Label>
                    <Input
                      value={tc.expectedOutput}
                      onChange={(e) => props.updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                      placeholder="e.g., 6"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`hidden-${tc.id}`}
                      checked={tc.isHidden}
                      onCheckedChange={(checked) => props.updateTestCase(tc.id, 'isHidden', !!checked)}
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
          <Button onClick={props.onSubmit} className="flex-1">
            Add Question
          </Button>
          <Button
            variant="outline"
            onClick={props.onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
