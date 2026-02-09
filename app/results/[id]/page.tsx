'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { assessmentService } from '@/lib/services/assessmentService';
import { testTakingService, type GradingResult } from '@/app/services/testTaking.service';
import { UserAnswer } from '@/lib/types/assessment';
import { formatTime } from '@/lib/utils/helpers';
import { CheckCircle2, XCircle, Award, Clock, FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadResults = async () => {
      try {
        // Load result from sessionStorage
        const resultData = sessionStorage.getItem(`assessment_result_${id}`);
        if (!resultData) {
          router.push('/assessments');
          return;
        }

        const parsed = JSON.parse(resultData);
        setGradingResult(parsed.gradingResult);

        // Load assessment details
        const assessmentData = await assessmentService.getAssessmentById(id);
        setAssessment(assessmentData);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id, isAuthenticated, router]);

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!assessment || !gradingResult) {
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

  const { total_score, max_score, percentage } = gradingResult;
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
                {total_score.toFixed(1)} / {max_score}
              </div>
              <div className="text-2xl text-muted-foreground">
                {percentage.toFixed(1)}%
              </div>
              <Badge variant={isPassed ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                {isPassed ? 'Passed' : 'Not Passed'}
              </Badge>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Correct Answers</span>
                </div>
                <div className="text-xl font-semibold">
                  {gradingResult.answers.filter(a => a.is_correct === 'correct').length} / {gradingResult.answers.length}
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Total Questions</span>
                </div>
                <div className="text-xl font-semibold">
                  {gradingResult.answers.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Answer Summary</h2>

          {gradingResult.answers.map((answer, index: number) => {
            const isCorrect = answer.is_correct === 'correct';
            const isPending = answer.is_correct === 'pending';

            return (
              <Card key={answer.question_id || index}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Question {index + 1}</span>
                        <Badge variant="secondary">{answer.max_points} points</Badge>
                      </div>
                      <p className="font-medium text-lg mt-1">{answer.question_text}</p>
                    </div>
                    <Badge variant={isCorrect ? 'default' : isPending ? 'secondary' : 'destructive'} className="gap-1 shrink-0">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Correct (+{answer.points_earned} pts)
                        </>
                      ) : isPending ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Pending Review
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Incorrect
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* MCQ Options */}
                  {answer.question_type === 'mcq' && answer.options && (
                    <div className="space-y-2">
                      {answer.options.map((opt) => {
                        const isSelected = Array.isArray(answer.user_answer)
                          ? answer.user_answer.includes(opt.id)
                          : answer.user_answer === opt.id;
                        const isCorrectOption = opt.is_correct;

                        let borderClass = "border-border";
                        let bgClass = "bg-card";
                        let icon = null;

                        if (isCorrectOption) {
                          borderClass = "border-green-500";
                          bgClass = "bg-green-500/10";
                          icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
                        } else if (isSelected && !isCorrectOption) {
                          borderClass = "border-red-500";
                          bgClass = "bg-red-500/10";
                          icon = <XCircle className="w-4 h-4 text-red-500" />;
                        } else if (isSelected) {
                          // Selected and correct (handled above generally, but explicit case for clarity)
                          borderClass = "border-green-500";
                          bgClass = "bg-green-500/10";
                          icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
                        }

                        return (
                          <div key={opt.id} className={`p-3 rounded-lg border flex items-center justify-between ${borderClass} ${bgClass}`}>
                            <span>{opt.text}</span>
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False */}
                  {answer.question_type === 'true_false' && (
                    <div className="flex gap-4">
                      {[true, false].map((val) => {
                        const isSelected = answer.user_answer === val;
                        const isCorrectAnswer = answer.correct_answer === val;

                        let classes = "border-border";
                        if (isCorrectAnswer) classes = "border-green-500 bg-green-500/10";
                        else if (isSelected && !isCorrectAnswer) classes = "border-red-500 bg-red-500/10";

                        return (
                          <div key={String(val)} className={`p-3 rounded-lg border flex-1 text-center font-medium ${classes}`}>
                            {val ? 'True' : 'False'} {isSelected && "(Your Answer)"}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground pt-2 border-t mt-2">
                    Points Earned: {answer.points_earned} / {answer.max_points}
                  </div>
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
