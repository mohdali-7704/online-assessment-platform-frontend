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
import { assessmentService } from '@/lib/services/assessmentService';
import { testTakingService, type SectionTest, type Submission, type AnswerSubmit } from '@/app/services/testTaking.service';
import { UserAnswer, SectionProgress } from '@/lib/types/assessment';
import { Answer, Question } from '@/lib/types/question';
import { QuestionType } from '@/lib/types/question';
import { ChevronLeft, ChevronRight, Flag, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { TabDetector } from '@/components/security/TabDetector';
import { ScreenCapturePermissionDialog } from '@/components/security/ScreenCapturePermissionDialog';
import { ScreenCaptureRequiredDialog } from '@/components/security/ScreenCaptureRequiredDialog';

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All hooks must be called before any conditional returns
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [allSectionAnswers, setAllSectionAnswers] = useState<Array<{ section_id: string; answers: any[] }>>([]);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [startTime] = useState(Date.now());
  const [sectionStartTime, setSectionStartTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [tabViolations, setTabViolations] = useState<any[]>([]);

  // Screen capture state
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [showRequiredDialog, setShowRequiredDialog] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [showSectionCompleteDialog, setShowSectionCompleteDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadAssessment();
    }
  }, [isAuthenticated, router, id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get assessment details
      const data = await assessmentService.getAssessmentById(id);
      if (!data) {
        setError('Assessment not found');
        return;
      }
      setAssessment(data);

      // Start the test and get submission ID
      const userId = localStorage.getItem('userEmail') || 'test-user@example.com';
      const submissionData = await testTakingService.startAssessment(id, userId);
      setSubmission(submissionData);

      // Load first section (section_order = 0)
      const sectionData = await testTakingService.getSectionQuestions(submissionData.id, 0);
      setCurrentSection(sectionData);

    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load assessment');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check browser support for screen capture
  useEffect(() => {
    const checkBrowserSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        console.error('[ScreenCapture] Browser does not support screen capture');
        setBrowserSupported(false);
        return false;
      }
      return true;
    };

    checkBrowserSupport();
  }, []);

  // Request screen capture permission
  const requestScreenCapture = async () => {
    try {
      console.log('[ScreenCapture] Requesting screen share permission...');

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor' as DisplayCaptureSurfaceType,
          cursor: 'always' as const,
        },
        audio: false,
        preferCurrentTab: false,
      } as MediaStreamConstraints);

      console.log('[ScreenCapture] Screen share permission granted');

      // Listen for screen sharing being stopped by user
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        console.warn('[ScreenCapture] Screen sharing stopped by user');
        alert('Screen sharing stopped. Assessment will be auto-submitted.');

        // Record violation
        handleViolation('tab_switch', {
          timestamp: new Date().toISOString(),
          violationNumber: tabViolations.length + 1,
          reason: 'screen_share_stopped'
        });

        handleSubmit();
      };

      setScreenStream(stream);
      setShowPermissionDialog(false);
    } catch (error) {
      console.error('[ScreenCapture] Permission denied or error:', error);
      setShowPermissionDialog(false);
      setShowRequiredDialog(true);
    }
  };

  // Cleanup screen stream on unmount
  useEffect(() => {
    return () => {
      if (screenStream) {
        console.log('[ScreenCapture] Cleaning up screen stream');
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenStream]);

  useEffect(() => {
    if (!currentSection) return;

    console.log('[Assessment] Initializing answers for section:', currentSection.section_id);

    // Initialize answers for current section's questions
    const initialAnswers: UserAnswer[] = currentSection.questions.map(q => {
      let answer: any;
      if (q.question_type === 'mcq') {
        answer = q.question_data.multipleAnswers ? [] : '';
      } else if (q.question_type === 'coding') {
        const firstLang = q.question_data.allowedLanguages?.[0] || 'python';
        answer = { code: q.question_data.starterCode?.[firstLang] || '', language: firstLang };
      } else if (q.question_type === 'descriptive') {
        answer = '';
      } else if (q.question_type === 'true_false') {
        answer = undefined;
      }

      return {
        questionId: q.id,
        answer,
        isAnswered: false
      };
    });

    console.log('[Assessment] Initial answers:', initialAnswers);
    setUserAnswers(initialAnswers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection?.section_id])

  // Conditional returns after all hooks
  if (!isAuthenticated) {
    return null;
  }

  // Check browser support
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading assessment...</p>
      </div>
    );
  }

  // Error state
  if (error || !assessment) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Assessment not found</h1>
        <p className="text-muted-foreground mt-2">{error || 'The assessment you are looking for does not exist.'}</p>
        <Button onClick={() => router.push('/assessments')} className="mt-4">
          Back to Assessments
        </Button>
      </div>
    );
  }

  if (!browserSupported) {
    return (
      <div className="container mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Browser Not Supported</h1>
        <p className="text-muted-foreground">
          Your browser doesn't support the required security features for this assessment.
        </p>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Please use one of these browsers:</p>
          <ul className="space-y-1">
            <li>• Google Chrome (recommended)</li>
            <li>• Microsoft Edge</li>
            <li>• Mozilla Firefox</li>
            <li>• Safari 13 or later</li>
          </ul>
        </div>
        <Button onClick={() => router.push('/assessments')} className="mt-4">
          Back to Assessments
        </Button>
      </div>
    );
  }

  // Wait for currentSection and userAnswers to be initialized
  if (!currentSection || !submission || userAnswers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading test...</p>
      </div>
    );
  }

// Show permission dialog before assessment starts
  if (showPermissionDialog) {
    return (
      <ScreenCapturePermissionDialog
        open={showPermissionDialog}
        onContinue={requestScreenCapture}
      />
    );
  }

  // Show error dialog if permission was denied
  if (showRequiredDialog) {
    return (
      <ScreenCaptureRequiredDialog
        open={showRequiredDialog}
        onRetry={requestScreenCapture}
        onCancel={() => router.push('/assessments')}
      />
    );
  }

  // Wait for screen capture to be initialized
  if (!screenStream) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Initializing screen capture...</p>
      </div>
    );
  }

  // Transform API questions to frontend format
  const transformQuestion = (q: any): Question => ({
    id: q.id,
    type: q.question_type,
    text: q.question_text,
    points: q.points,
    difficulty: q.difficulty,
    ...q.question_data
  });

  const currentQuestions = currentSection.questions.map(transformQuestion);
  const currentQuestion = currentQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
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

  const handleSectionComplete = async () => {
    if (!submission || !currentSection) return;

    // Save current section's answers before moving to next section
    const sectionAnswers = userAnswers.map(ua => ({
      question_id: ua.questionId,
      answer_data: ua.answer
    }));

    try {
      // Load next section
      const nextSectionOrder = currentSection.section_order + 1;
      const nextSectionData = await testTakingService.getSectionQuestions(
        submission.id,
        nextSectionOrder
      );

      // Only add to allSectionAnswers if successfully loaded next section
      setAllSectionAnswers(prev => [...prev, {
        section_id: currentSection.section_id,
        answers: sectionAnswers
      }]);

      setCurrentSection(nextSectionData);
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setSectionStartTime(Date.now());
      setShowSectionCompleteDialog(false);
    } catch (error: any) {
      // No more sections, this was the last one
      // Don't add to allSectionAnswers here - will be added in handleSubmit
      console.log('No more sections, submitting assessment');
      setShowSectionCompleteDialog(false);
      setShowSubmitDialog(true);
    }
  };

  const handleSubmit = async () => {
    if (!submission || !currentSection) return;

    try {
      // Prepare current (final) section's answers
      const currentSectionAnswers: AnswerSubmit[] = userAnswers.map(ua => ({
        question_id: ua.questionId,
        answer_data: ua.answer
      }));

      // Combine all previous sections' answers with current section
      const submissionData = [
        ...allSectionAnswers, // All previously completed sections
        {
          section_id: currentSection.section_id,
          answers: currentSectionAnswers
        }
      ];

      console.log('[Assessment] Submitting all sections:', submissionData);

      // Submit to backend for grading
      const result = await testTakingService.submitAssessment(submission.id, submissionData);

      // Store results for results page
      sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify({
        submissionId: submission.id,
        gradingResult: result,
        assessmentId: id
      }));

      router.push(`/results/${id}`);
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    }
  };

  const handleTimeUp = () => {
    // Time's up for current section, force move to next or submit
    handleSectionComplete();
  };

  const handleViolation = (type: string, data: any) => {
    console.log('[Assessment] Security violation received:', type, {
      ...data,
      screenshot: data.screenshot ? `${data.screenshot.substring(0, 50)}... (${data.screenshotSize} KB)` : 'NO SCREENSHOT',
      hasScreenshot: !!data.screenshot
    });

    const newViolations = [...tabViolations, { type, data }];
    setTabViolations(newViolations);

    // Store violations in localStorage for now (or send to backend later)
    localStorage.setItem(
      `violations_${id}`,
      JSON.stringify(newViolations)
    );

    console.log('[Assessment] Stored violations in localStorage. Total violations:', newViolations.length);
  };

  const handleMaxViolations = () => {
    alert('Maximum tab switch violations reached! Assessment will be auto-submitted.');
    handleSubmit();
  };

  // Calculate progress for current section
  const currentSectionQuestionIds = currentQuestions.map(q => q.id);
  const currentSectionAnswers = userAnswers.filter(ua => currentSectionQuestionIds.includes(ua.questionId));
  const answeredCount = currentSectionAnswers.filter(ua => ua.isAnswered).length;
  const progress = (answeredCount / currentQuestions.length) * 100;

  return (
    <TabDetector
      onViolation={handleViolation}
      maxViolations={3}
      onMaxViolationsReached={handleMaxViolations}
      screenStream={screenStream}
    >
      <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">
                Section {currentSectionIndex + 1}: {currentSection.section_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Section Time Remaining</div>
              <Timer
                key={`section-${currentSectionIndex}`}
                initialSeconds={currentSection.duration * 60}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Section Progress</span>
            <span className="font-medium">
              {answeredCount} / {currentQuestions.length} answered
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
              {currentQuestionIndex === currentQuestions.length - 1 ? (
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
              You have answered {answeredCount} out of {currentQuestions.length} questions in this section.
              {answeredCount < currentQuestions.length && (
                <span className="block mt-2 text-yellow-600">
                  {currentQuestions.length - answeredCount} question(s) are still unanswered.
                </span>
              )}
              <span className="block mt-2 font-semibold">
                Once submitted, you cannot return to review your answers.
              </span>
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
      <Dialog open={showSectionCompleteDialog} onOpenChange={setShowSectionCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Section Complete!</DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <p>
                  You have completed <strong>{currentSection.section_name}</strong>.
                </p>
                <p>
                  You answered {answeredCount} out of {currentQuestions.length} questions in this section.
                </p>
                <p className="text-destructive font-semibold">
                  ⚠️ Once you proceed, you cannot return to this section.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSectionComplete} className="w-full">
              Continue to Next Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </TabDetector>
  );
}
