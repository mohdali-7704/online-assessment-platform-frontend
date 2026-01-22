'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Timer from '@/components/Timer';
import QuestionNavigator from '@/components/assessment/QuestionNavigator';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import { getAssessmentById } from '@/data/mock-assessments';
import { UserAnswer } from '@/lib/types/assessment';
import { Answer } from '@/lib/types/question';
import { QuestionType } from '@/lib/types/question';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const assessment = getAssessmentById(id);

  // All hooks must be called before any conditional returns
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!assessment) return;

    console.log('[Assessment] Initializing answers for assessment:', assessment.id);
    console.log('[Assessment] Questions:', assessment.questions);

    // Initialize user answers
    const initialAnswers: UserAnswer[] = assessment.questions.map(q => {
      const answer = q.type === 'mcq' ? [] : q.type === 'coding' ? { code: q.starterCode[q.allowedLanguages[0]] || '', language: q.allowedLanguages[0] } : q.type === 'descriptive' ? '' : undefined;
      console.log(`[Assessment] Question ${q.id} (${q.type}):`, { answer, isArray: Array.isArray(answer) });
      return {
        questionId: q.id,
        answer,
        isAnswered: false
      };
    });

    console.log('[Assessment] Initial answers:', initialAnswers);
    setUserAnswers(initialAnswers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Use id instead of assessment to avoid infinite loop

  // Conditional returns after all hooks
  if (!isAuthenticated) {
    return null;
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Assessment not found</h1>
        <Button onClick={() => router.push('/assessments')} className="mt-4">
          Back to Assessments
        </Button>
      </div>
    );
  }

  // Wait for userAnswers to be initialized before rendering
  if (userAnswers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(ua => ua.questionId === currentQuestion.id);

  const handleAnswerChange = (answer: Answer) => {
    setUserAnswers(prev =>
      prev.map(ua =>
        ua.questionId === currentQuestion.id
          ? { ...ua, answer, isAnswered: true }
          : ua
      )
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Filter coding answers and extract scores
    const codingScores: { [key: string]: number } = {};
    userAnswers.forEach(ua => {
      const question = assessment.questions.find(q => q.id === ua.questionId);
      if (question?.type === QuestionType.CODING && (ua.answer as any)._score !== undefined) {
        codingScores[ua.questionId] = (ua.answer as any)._score;
      }
    });

    // Store results in sessionStorage for the results page
    sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify({
      assessmentId: id,
      userAnswers,
      timeTaken,
      codingScores  // Include coding scores
    }));

    router.push(`/results/${id}`);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const answeredCount = userAnswers.filter(ua => ua.isAnswered).length;
  const progress = (answeredCount / assessment.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Time Remaining</div>
              <Timer
                initialSeconds={assessment.duration * 60}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {answeredCount} / {assessment.questions.length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">
              {currentQuestion.type === 'mcq' ? 'Multiple Choice' :
               currentQuestion.type === 'true_false' ? 'True/False' :
               currentQuestion.type === 'descriptive' ? 'Descriptive' :
               'Coding'}
            </Badge>
            <Badge variant="secondary">{currentQuestion.points} points</Badge>
          </div>

          <QuestionRenderer
            question={currentQuestion}
            answer={currentAnswer?.answer}
            onChange={handleAnswerChange}
            assessmentId={id}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex === assessment.questions.length - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)} className="gap-2">
                  <Flag className="w-4 h-4" />
                  Submit Assessment
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={assessment.questions}
            userAnswers={userAnswers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} out of {assessment.questions.length} questions.
              {answeredCount < assessment.questions.length && (
                <span className="block mt-2 text-yellow-600">
                  {assessment.questions.length - answeredCount} question(s) are still unanswered.
                </span>
              )}
              Are you sure you want to submit?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
