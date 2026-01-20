'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface TestCaseResultDisplay {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface CodeOutputPanelProps {
  results: TestCaseResultDisplay[];
  isLoading?: boolean;
  executionTime?: string;
  error?: string;
}

export default function CodeOutputPanel({
  results,
  isLoading = false,
  executionTime,
  error
}: CodeOutputPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Running test cases...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Execution Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-destructive/10 p-4 rounded-md overflow-x-auto">
            {error}
          </pre>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground py-8">
          Click "Run Code" to test your solution
        </CardContent>
      </Card>
    );
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Test Results
            <Badge variant={passedCount === totalCount ? 'default' : 'destructive'}>
              {passedCount}/{totalCount} Passed
            </Badge>
          </CardTitle>
          {executionTime && (
            <span className="text-sm text-muted-foreground">
              Execution Time: {executionTime}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result, index) => (
          <div key={result.testCaseId} className="space-y-2">
            <div className="flex items-center gap-2">
              {result.passed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <span className="font-semibold">Test Case {index + 1}</span>
              <Badge variant={result.passed ? 'default' : 'destructive'}>
                {result.passed ? 'Passed' : 'Failed'}
              </Badge>
            </div>

            <div className="ml-7 space-y-2 text-sm">
              <div>
                <span className="font-medium">Input:</span>
                <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                  {result.input}
                </pre>
              </div>

              <div>
                <span className="font-medium">Expected Output:</span>
                <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                  {result.expectedOutput}
                </pre>
              </div>

              <div>
                <span className="font-medium">Your Output:</span>
                <pre
                  className={`p-2 rounded mt-1 overflow-x-auto ${
                    result.passed ? 'bg-green-50' : 'bg-destructive/10'
                  }`}
                >
                  {result.actualOutput || '(no output)'}
                </pre>
              </div>

              {result.error && (
                <div>
                  <span className="font-medium text-destructive">Error:</span>
                  <pre className="bg-destructive/10 p-2 rounded mt-1 overflow-x-auto text-destructive">
                    {result.error}
                  </pre>
                </div>
              )}
            </div>

            {index < results.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
