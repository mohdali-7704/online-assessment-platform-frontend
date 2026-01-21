'use client';

import { useState } from 'react';
import { CodingQuestion as CodingQuestionType, CodingAnswer } from '@/lib/types/question';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LANGUAGE_NAMES } from '@/lib/utils/constants';
import MonacoEditor from '@/components/code-editor/MonacoEditor';
import CodeOutputPanel from '@/components/code-editor/CodeOutputPanel';
import { Play } from 'lucide-react';
import { runTestCases } from '@/lib/api/judge0';
import { scoreCodingQuestion } from '@/lib/api/scoring';

interface CodingQuestionProps {
  question: CodingQuestionType;
  answer: CodingAnswer;
  onChange: (answer: CodingAnswer) => void;
  assessmentId: string;
}

export default function CodingQuestion({ question, answer, onChange, assessmentId }: CodingQuestionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();

  const handleLanguageChange = (language: string) => {
    onChange({
      code: question.starterCode[language] || '',
      language
    });
  };

  const handleCodeChange = (code: string | undefined) => {
    onChange({
      ...answer,
      code: code || ''
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(undefined);
    setTestResults([]);

    try {
      // Get ALL test cases (including hidden ones) for execution and scoring
      const allTestCases = question.testCases;

      // Extract function name from the code
      const functionNameMatch = answer.code.match(/function\s+(\w+)\s*\(|def\s+(\w+)\s*\(|int\s+(\w+)\s*\(|public\s+static\s+\w+\s+(\w+)\s*\(/);
      const functionName = functionNameMatch ? (functionNameMatch[1] || functionNameMatch[2] || functionNameMatch[3] || functionNameMatch[4]) : undefined;

      // Run ALL tests via Judge0 (including hidden ones)
      const results = await runTestCases(
        answer.code,
        answer.language,
        allTestCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        })),
        functionName
      );

      // Map results with test case IDs
      const allResultsWithIds = results.map((result, index) => ({
        ...result,
        testCaseId: allTestCases[index].id
      }));

      // Only show visible test case results in UI
      const visibleResults = allResultsWithIds.filter((_, index) => !allTestCases[index].isHidden);
      setTestResults(visibleResults);

      // Submit to backend for scoring with ALL test results
      try {
        const scoreResponse = await scoreCodingQuestion({
          questionId: question.id,
          assessmentId,
          code: answer.code,
          language: answer.language,
          testResults: allResultsWithIds,  // Send all results including hidden
          totalTestCases: question.testCases.length,
          questionPoints: question.points
        });

        console.log('Coding Score:', scoreResponse);

        // Update answer with score (via onChange callback)
        onChange({
          ...answer,
          // Store score in a way parent component can access
          _score: scoreResponse.score,
          _testResults: allResultsWithIds  // Store all results
        } as any);
      } catch (scoreError) {
        console.error('Failed to get score from backend:', scoreError);
        // Continue even if scoring fails - user can still see test results
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const getEditorLanguage = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      javascript: 'javascript',
      python: 'python',
      cpp: 'cpp',
      java: 'java'
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap">{question.problemStatement}</div>
          </div>

          <div className="bg-muted p-4 rounded-md space-y-2">
            <h4 className="font-semibold text-sm">Test Cases:</h4>
            {question.testCases.filter(tc => !tc.isHidden).map((tc, index) => (
              <div key={tc.id} className="text-sm space-y-1">
                <div className="font-medium">Test Case {index + 1}:</div>
                <div className="pl-4 space-y-1">
                  <div>
                    <span className="font-medium">Input:</span>{' '}
                    <code className="bg-background px-1 py-0.5 rounded">{tc.input}</code>
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span>{' '}
                    <code className="bg-background px-1 py-0.5 rounded">{tc.expectedOutput}</code>
                  </div>
                </div>
              </div>
            ))}
            {question.testCases.some(tc => tc.isHidden) && (
              <p className="text-xs text-muted-foreground italic">
                + {question.testCases.filter(tc => tc.isHidden).length} hidden test case(s)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Solution</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={answer.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {question.allowedLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {LANGUAGE_NAMES[lang] || lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleRunCode} disabled={isRunning || !answer.code.trim()} className="gap-2">
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MonacoEditor
            language={getEditorLanguage(answer.language)}
            value={answer.code}
            onChange={handleCodeChange}
            height="400px"
          />
        </CardContent>
      </Card>

      <CodeOutputPanel
        results={testResults}
        isLoading={isRunning}
        error={error}
      />
    </div>
  );
}
