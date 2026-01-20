'use client';

import { DescriptiveQuestion as DescriptiveQuestionType, DescriptiveAnswer } from '@/lib/types/question';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface DescriptiveQuestionProps {
  question: DescriptiveQuestionType;
  answer: DescriptiveAnswer;
  onChange: (answer: DescriptiveAnswer) => void;
}

export default function DescriptiveQuestion({ question, answer, onChange }: DescriptiveQuestionProps) {
  const currentLength = answer.length;
  const maxLength = question.maxLength;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-semibold">{question.text}</h3>

        <div className="space-y-2">
          <Textarea
            value={answer}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[200px]"
            maxLength={maxLength}
          />
          {maxLength && (
            <div className="text-sm text-muted-foreground text-right">
              {currentLength} / {maxLength} characters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
