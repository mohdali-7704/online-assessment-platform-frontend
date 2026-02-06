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
import { UserAnswer, SectionProgress } from '@/lib/types/assessment';
import { Answer } from '@/lib/types/question';
import { QuestionType } from '@/lib/types/question';
import { ChevronLeft, ChevronRight, Flag, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const assessment = getAssessmentById(id);

  // All hooks must be called before any conditional returns
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [startTime] = useState(Date.now());
  const [sectionStartTime, setSectionStartTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSectionCompleteDialog, setShowSectionCompleteDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!assessment) return;

    console.log('[Assessment] Initializing answers for assessment:', assessment.id);

    // Use sections if available, otherwise fall back to flat questions
    const useSections = assessment.sections && assessment.sections.length > 0;

    if (useSections && assessment.sections) {
      console.log('[Assessment] Using sections structure');

      // Initialize section progress
      const initialProgress: SectionProgress[] = assessment.sections.map(section => ({
        sectionId: section.id,
        isCompleted: false,
        startTime: undefined,
        endTime: undefined,
        timeSpent: 0
      }));
      setSectionProgress(initialProgress);

      // Mark first section as started
      initialProgress[0].startTime = Date.now();

      // Initialize user answers from all sections
      const allQuestions = assessment.sections.flatMap(section => section.questions);
      const initialAnswers: UserAnswer[] = allQuestions.map(q => {
        const answer = q.type === 'mcq' ? [] : q.type === 'coding' ? { code: q.starterCode[q.allowedLanguages[0]] || '', language: q.allowedLanguages[0] } : q.type === 'descriptive' ? '' : undefined;
        return {
          questionId: q.id,
          answer,
          isAnswered: false
        };
      });

      console.log('[Assessment] Initial answers from sections:', initialAnswers);
      setUserAnswers(initialAnswers);
    } else {
      console.log('[Assessment] Using flat questions structure');

      // Initialize user answers from flat questions
      const initialAnswers: UserAnswer[] = assessment.questions.map(q => {
        const answer = q.type === 'mcq' ? [] : q.type === 'coding' ? { code: q.starterCode[q.allowedLanguages[0]] || '', language: q.allowedLanguages[0] } : q.type === 'descriptive' ? '' : undefined;
        return {
          questionId: q.id,
          answer,
          isAnswered: false
        };
      });

      console.log('[Assessment] Initial answers:', initialAnswers);
      setUserAnswers(initialAnswers);
    }
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

  // Use sections if available
  const useSections = assessment.sections && assessment.sections.length > 0;
  const currentSection = useSections ? assessment.sections![currentSectionIndex] : null;
  const currentQuestions = useSections ? currentSection!.questions : assessment.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(ua => ua.questionId === currentQuestion.id);
  const currentSectionProgress = useSections ? sectionProgress[currentSectionIndex] : null;

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
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (useSections && currentSectionIndex < assessment.sections!.length - 1) {
      // Last question in section, show completion dialog
      setShowSectionCompleteDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
    // Cannot go back to previous section once completed
  };

  const handleQuestionSelect = (index: number) => {
    // Only allow selecting questions in current section
    setCurrentQuestionIndex(index);
  };

  const handleSectionComplete = () => {
    if (!useSections || !currentSection) return;

    // Mark current section as completed
    const updatedProgress = [...sectionProgress];
    updatedProgress[currentSectionIndex].isCompleted = true;
    updatedProgress[currentSectionIndex].endTime = Date.now();
    updatedProgress[currentSectionIndex].timeSpent = Math.floor(
      (Date.now() - (updatedProgress[currentSectionIndex].startTime || Date.now())) / 1000
    );

    // Move to next section
    const nextSectionIndex = currentSectionIndex + 1;
    if (nextSectionIndex < assessment.sections!.length) {
      updatedProgress[nextSectionIndex].startTime = Date.now();
      setSectionProgress(updatedProgress);
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
      setSectionStartTime(Date.now());
      setShowSectionCompleteDialog(false);
    }
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Mark current section as completed if using sections
    let finalSectionProgress = sectionProgress;
    if (useSections && currentSection) {
      const updatedProgress = [...sectionProgress];
      updatedProgress[currentSectionIndex].isCompleted = true;
      updatedProgress[currentSectionIndex].endTime = Date.now();
      updatedProgress[currentSectionIndex].timeSpent = Math.floor(
        (Date.now() - (updatedProgress[currentSectionIndex].startTime || Date.now())) / 1000
      );
      finalSectionProgress = updatedProgress;
    }

    // Filter coding answers and extract scores
    const codingScores: { [key: string]: number } = {};
    const allQuestions = useSections
      ? assessment.sections!.flatMap(s => s.questions)
      : assessment.questions;

    userAnswers.forEach(ua => {
      const question = allQuestions.find(q => q.id === ua.questionId);
      if (question?.type === QuestionType.CODING && (ua.answer as any)._score !== undefined) {
        codingScores[ua.questionId] = (ua.answer as any)._score;
      }
    });

    // Store results in sessionStorage for the results page
    sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify({
      assessmentId: id,
      userAnswers,
      timeTaken,
      codingScores,  // Include coding scores
      sectionProgress: finalSectionProgress  // Include section progress
    }));

    router.push(`/results/${id}`);
  };

  const handleTimeUp = () => {
    if (useSections && currentSectionIndex < assessment.sections!.length - 1) {
      // Time's up for current section, force move to next section
      handleSectionComplete();
    } else {
      // Time's up for entire assessment or last section
      handleSubmit();
    }
  };

  // Calculate progress for current section
  const currentSectionQuestionIds = currentQuestions.map(q => q.id);
  const currentSectionAnswers = userAnswers.filter(ua => currentSectionQuestionIds.includes(ua.questionId));
  const answeredCount = currentSectionAnswers.filter(ua => ua.isAnswered).length;
  const progress = (answeredCount / currentQuestions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            {useSections && currentSection ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary">
                  Section {currentSectionIndex + 1} of {assessment.sections!.length}: {currentSection.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {useSections && currentSection && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Section Time Remaining</div>
                <Timer
                  key={`section-${currentSectionIndex}`}
                  initialSeconds={currentSection.duration * 60}
                  onTimeUp={handleTimeUp}
                />
              </div>
            )}
            {!useSections && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <Timer
                  initialSeconds={assessment.duration * 60}
                  onTimeUp={handleTimeUp}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {useSections ? 'Section Progress' : 'Progress'}
            </span>
            <span className="font-medium">
              {answeredCount} / {currentQuestions.length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {useSections && assessment.sections && (
          <div className="mt-4 flex gap-2">
            {assessment.sections.map((section, idx) => {
              const isCompleted = sectionProgress[idx]?.isCompleted;
              const isCurrent = idx === currentSectionIndex;
              return (
                <div
                  key={section.id}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-medium text-center ${
                    isCompleted
                      ? 'bg-green-100 text-green-800'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {section.name}
                </div>
              );
            })}
          </div>
        )}
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
              {/* Check if it's the last question in the last section or in flat structure */}
              {(useSections && currentSectionIndex === assessment.sections!.length - 1 && currentQuestionIndex === currentQuestions.length - 1) ||
               (!useSections && currentQuestionIndex === currentQuestions.length - 1) ? (
                <Button onClick={() => setShowSubmitDialog(true)} className="gap-2">
                  <Flag className="w-4 h-4" />
                  Submit Assessment
                </Button>
              ) : currentQuestionIndex === currentQuestions.length - 1 ? (
                <Button onClick={handleNext} className="gap-2">
                  Complete Section
                  <ChevronRight className="w-4 h-4" />
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
            questions={currentQuestions}
            userAnswers={currentSectionAnswers}
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
              You have answered {answeredCount} out of {currentQuestions.length} questions in this {useSections ? 'section' : 'assessment'}.
              {answeredCount < currentQuestions.length && (
                <span className="block mt-2 text-yellow-600">
                  {currentQuestions.length - answeredCount} question(s) are still unanswered.
                </span>
              )}
              {useSections && (
                <span className="block mt-2 font-semibold">
                  Once submitted, you cannot return to review your answers.
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

      {/* Section Complete Dialog */}
      {useSections && currentSection && (
        <Dialog open={showSectionCompleteDialog} onOpenChange={setShowSectionCompleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Section Complete!</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
                  <p>
                    You have completed <strong>{currentSection.name}</strong>.
                  </p>
                  <p>
                    You answered {answeredCount} out of {currentQuestions.length} questions in this section.
                  </p>
                  {currentSectionIndex < assessment.sections!.length - 1 && (
                    <div className="p-4 bg-muted rounded-md space-y-2">
                      <p className="font-semibold">Next Section:</p>
                      <p className="text-lg">{assessment.sections![currentSectionIndex + 1].name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {assessment.sections![currentSectionIndex + 1].duration} minutes</span>
                      </div>
                      <p className="text-sm">{assessment.sections![currentSectionIndex + 1].questions.length} questions</p>
                    </div>
                  )}
                  <p className="text-destructive font-semibold">
                    ⚠️ Once you proceed, you cannot return to this section.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSectionComplete} className="w-full">
                {currentSectionIndex < assessment.sections!.length - 1 ? 'Start Next Section' : 'Complete Assessment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
