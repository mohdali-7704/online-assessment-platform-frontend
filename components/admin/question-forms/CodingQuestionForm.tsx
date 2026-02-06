import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import type { TestCase } from '@/lib/types/question';
import { generateStarterCode, generateAllStarterCode, detectFunctionSignature } from '@/lib/utils/code-templates';

interface CodingQuestionFormProps {
  text: string;
  setText: (value: string) => void;
  problemStatement: string;
  setProblemStatement: (value: string) => void;
  points: number;
  setPoints: (value: number) => void;
  primaryLanguage: string;
  setPrimaryLanguage: (value: string) => void;
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  setStarterCode: (value: any) => void;
  testCases: TestCase[];
  setTestCases: (value: TestCase[]) => void;
  allowedLanguages: string[];
  setAllowedLanguages: (value: string[]) => void;
  showAdvancedLanguages: boolean;
  setShowAdvancedLanguages: (value: boolean) => void;
}

export default function CodingQuestionForm({
  text,
  setText,
  problemStatement,
  setProblemStatement,
  points,
  setPoints,
  primaryLanguage,
  setPrimaryLanguage,
  starterCode,
  setStarterCode,
  testCases,
  setTestCases,
  allowedLanguages,
  setAllowedLanguages,
  showAdvancedLanguages,
  setShowAdvancedLanguages
}: CodingQuestionFormProps) {
  const addTestCase = () => {
    const newId = `t${testCases.length + 1}`;
    setTestCases([...testCases, { id: newId, input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  const toggleLanguage = (lang: string) => {
    if (allowedLanguages.includes(lang)) {
      setAllowedLanguages(allowedLanguages.filter(l => l !== lang));
    } else {
      setAllowedLanguages([...allowedLanguages, lang]);
    }
  };

  const handleAutoGenerateStarterCode = () => {
    const signature = detectFunctionSignature(problemStatement || text);

    if (!signature) {
      alert('Could not detect function signature. Please provide more details in the problem statement.');
      return;
    }

    const primaryCode = generateStarterCode(
      primaryLanguage,
      signature.name,
      signature.parameters
    );

    const allCodes = generateAllStarterCode(
      primaryLanguage,
      primaryCode,
      allowedLanguages
    );

    setStarterCode({
      javascript: allCodes.javascript || '',
      python: allCodes.python || '',
      cpp: allCodes.cpp || '',
      java: allCodes.java || ''
    });
  };

  const handlePrimaryLanguageChange = (lang: string) => {
    setPrimaryLanguage(lang);

    if (!allowedLanguages.includes(lang)) {
      setAllowedLanguages([lang, ...allowedLanguages]);
    }
  };

  const handlePrimaryCodeChange = (code: string) => {
    setStarterCode((prev: any) => ({
      ...prev,
      [primaryLanguage]: code
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Title *</Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Array Sum"
        />
      </div>

      <div className="space-y-2">
        <Label>Problem Statement *</Label>
        <Textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Describe the coding problem in detail..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Points *</Label>
        <Input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Primary Programming Language</Label>
        <Select value={primaryLanguage} onValueChange={handlePrimaryLanguageChange}>
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
          <Label>Starter Code ({primaryLanguage.toUpperCase()})</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoGenerateStarterCode}
            disabled={!problemStatement && !text}
          >
            Auto-Generate
          </Button>
        </div>
        <Textarea
          value={starterCode[primaryLanguage as keyof typeof starterCode]}
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
                .filter(lang => lang !== primaryLanguage)
                .map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={allowedLanguages.includes(lang)}
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

        {testCases.map((tc, index) => (
          <div key={tc.id} className="p-4 border rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <Label>Test Case {index + 1}</Label>
              {testCases.length > 1 && (
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
  );
}
