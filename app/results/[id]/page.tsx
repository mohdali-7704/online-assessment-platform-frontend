'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { getAssessmentById } from '@/data/mock-assessments';
import { UserAnswer } from '@/lib/types/assessment';
import { calculateScore, formatTime, checkAnswer } from '@/lib/utils/helpers';
import { QuestionType, MCQQuestion, TrueFalseQuestion, CodingQuestion, MCQAnswer, TrueFalseAnswer, CodingAnswer } from '@/lib/types/question';
import { CheckCircle2, XCircle, Award, Clock, FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const assessment = getAssessmentById(id);

  const [result, setResult] = useState<{
    userAnswers: UserAnswer[];
    timeTaken: number;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load result from sessionStorage
    const resultData = sessionStorage.getItem(`assessment_result_${id}`);
    if (resultData) {
      setResult(JSON.parse(resultData));
    }
  }, [id, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (!assessment || !result) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Results not found</h1>
        <p className="text-muted-foreground mt-2">Please complete the assessment first</p>
        <Button onClick={() => router.push('/assessments')} className="mt-4">
          Back to Assessments
        </Button>
      </div>
    );
  }

  const { score, totalPoints, percentage } = calculateScore(assessment.questions, result.userAnswers);
  const isPassed = percentage >= 60;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link href="/assessments">
            <Button variant="ghost" className="gap-2 -ml-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Assessments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground">Assessment Results</p>
        </div>

        {/* Score Overview */}
        <Card className={isPassed ? 'border-green-500' : 'border-yellow-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              Your Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold">
                {score} / {totalPoints}
              </div>
              <div className="text-2xl text-muted-foreground">
                {percentage}%
              </div>
              <Badge variant={isPassed ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                {isPassed ? 'Passed' : 'Not Passed'}
              </Badge>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Taken</span>
                </div>
                <div className="text-xl font-semibold">{formatTime(result.timeTaken)}</div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Questions</span>
                </div>
                <div className="text-xl font-semibold">
                  {result.userAnswers.filter(ua => ua.isAnswered).length} / {assessment.questions.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Question Review</h2>

          {assessment.questions.map((question, index) => {
            const userAnswer = result.userAnswers.find(ua => ua.questionId === question.id);
            const isCorrect = userAnswer ? checkAnswer(question, userAnswer.answer) : false;
            const wasAnswered = userAnswer?.isAnswered || false;

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Question {index + 1}</span>
                        <Badge variant="outline">
                          {question.type === 'mcq' ? 'MCQ' :
                           question.type === 'true_false' ? 'True/False' :
                           question.type === 'descriptive' ? 'Descriptive' :
                           'Coding'}
                        </Badge>
                        <Badge variant="secondary">{question.points} points</Badge>
                      </div>
                      <CardTitle className="text-lg">{question.text}</CardTitle>
                    </div>
                    {(question.type === QuestionType.MCQ || question.type === QuestionType.TRUE_FALSE) && (
                      <Badge variant={isCorrect ? 'default' : 'destructive'} className="gap-1">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            {wasAnswered ? 'Incorrect' : 'Not Answered'}
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* MCQ Question */}
                  {question.type === QuestionType.MCQ && (
                    <div className="space-y-2">
                      {(question as MCQQuestion).options.map((option) => {
                        const userSelection = (userAnswer?.answer as MCQAnswer) || [];
                        const isCorrectOption = (question as MCQQuestion).correctAnswers.includes(option.id);
                        const isUserSelection = userSelection.includes(option.id);

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-md border ${
                              isCorrectOption
                                ? 'bg-green-50 border-green-500'
                                : isUserSelection
                                ? 'bg-red-50 border-red-500'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isCorrectOption && (
                                <Badge variant="default">Correct Answer</Badge>
                              )}
                              {isUserSelection && !isCorrectOption && (
                                <Badge variant="destructive">Your Answer</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False Question */}
                  {question.type === QuestionType.TRUE_FALSE && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        {[true, false].map((value) => {
                          const isCorrectOption = (question as TrueFalseQuestion).correctAnswer === value;
                          const isUserSelection = (userAnswer?.answer as TrueFalseAnswer) === value;

                          return (
                            <div
                              key={value.toString()}
                              className={`p-3 rounded-md border text-center ${
                                isCorrectOption
                                  ? 'bg-green-50 border-green-500'
                                  : isUserSelection
                                  ? 'bg-red-50 border-red-500'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="font-semibold">{value ? 'True' : 'False'}</div>
                              {isCorrectOption && (
                                <Badge variant="default" className="mt-2">Correct Answer</Badge>
                              )}
                              {isUserSelection && !isCorrectOption && (
                                <Badge variant="destructive" className="mt-2">Your Answer</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Descriptive Question */}
                  {question.type === QuestionType.DESCRIPTIVE && userAnswer && (
                    <div className="space-y-2">
                      <div className="font-semibold">Your Answer:</div>
                      <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                        {(userAnswer.answer as string) || '(No answer provided)'}
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        Descriptive answers require manual grading
                      </p>
                    </div>
                  )}

                  {/* Coding Question */}
                  {question.type === QuestionType.CODING && userAnswer && (
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold mb-2">Your Solution:</div>
                        <div className="bg-muted p-4 rounded-md">
                          <div className="text-xs text-muted-foreground mb-2">
                            Language: {(userAnswer.answer as CodingAnswer).language}
                          </div>
                          <pre className="text-sm overflow-x-auto">
                            <code>{(userAnswer.answer as CodingAnswer).code || '(No code submitted)'}</code>
                          </pre>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        Coding questions are evaluated based on test case execution
                      </p>
                    </div>
                  )}

                  {!wasAnswered && (
                    <p className="text-sm text-muted-foreground italic">
                      This question was not answered
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/assessments">
            <Button size="lg">Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
