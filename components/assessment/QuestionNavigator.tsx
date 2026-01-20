'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Question } from '@/lib/types/question';
import { UserAnswer } from '@/lib/types/assessment';
import { isAnswerProvided } from '@/lib/utils/helpers';

interface QuestionNavigatorProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  userAnswers,
  currentQuestionIndex,
  onQuestionSelect
}: QuestionNavigatorProps) {
  const isQuestionAnswered = (questionId: string): boolean => {
    const userAnswer = userAnswers.find(ua => ua.questionId === questionId);
    return userAnswer ? isAnswerProvided(userAnswer.answer) : false;
  };

  const getVariant = (index: number, questionId: string): 'default' | 'secondary' | 'outline' => {
    if (index === currentQuestionIndex) return 'default';
    if (isQuestionAnswered(questionId)) return 'secondary';
    return 'outline';
  };

  const answeredCount = questions.filter(q => isQuestionAnswered(q.id)).length;
  const totalCount = questions.length;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Questions</CardTitle>
        <div className="text-sm text-muted-foreground">
          {answeredCount} of {totalCount} answered
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            >
              <Badge
                variant={getVariant(index, question.id)}
                className="w-full h-10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                {index + 1}
              </Badge>
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="w-8 h-8 flex items-center justify-center">
              1
            </Badge>
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
              2
            </Badge>
            <span className="text-muted-foreground">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
              3
            </Badge>
            <span className="text-muted-foreground">Unanswered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
