'use client';

import { MCQQuestion as MCQQuestionType, MCQAnswer } from '@/lib/types/question';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MCQQuestionProps {
  question: MCQQuestionType;
  answer: MCQAnswer;
  onChange: (answer: MCQAnswer) => void;
}

export default function MCQQuestion({ question, answer, onChange }: MCQQuestionProps) {
  console.log('[MCQQuestion] Render:', {
    questionId: question.id,
    questionText: question.text,
    multipleAnswers: question.multipleAnswers,
    answer: answer,
    answerType: typeof answer,
    isArray: Array.isArray(answer)
  });

  const handleSingleChoiceChange = (value: string) => {
    console.log('[MCQQuestion] Single choice changed:', value);
    onChange([value]);
  };

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    console.log('[MCQQuestion] Multiple choice changed:', { optionId, checked });
    if (checked) {
      onChange([...answer, optionId]);
    } else {
      onChange(answer.filter(id => id !== optionId));
    }
  };

  const handleClear = () => {
    console.log('[MCQQuestion] Clear clicked');
    onChange([]);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{question.text}</h3>
          {question.multipleAnswers && (
            <p className="text-sm text-muted-foreground">
              Select all that apply
            </p>
          )}
        </div>

        {question.multipleAnswers ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option.id}`}
                  checked={answer.includes(option.id)}
                  onCheckedChange={(checked) =>
                    handleMultipleChoiceChange(option.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={answer[0] || ''} onValueChange={handleSingleChoiceChange}>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
