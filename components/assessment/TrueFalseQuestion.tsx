'use client';

import { TrueFalseQuestion as TrueFalseQuestionType, TrueFalseAnswer } from '@/lib/types/question';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  answer: TrueFalseAnswer | undefined;
  onChange: (answer: TrueFalseAnswer) => void;
}

export default function TrueFalseQuestion({ question, answer, onChange }: TrueFalseQuestionProps) {
  const handleChange = (value: string) => {
    onChange(value === 'true');
  };

  const selectedValue = answer === undefined ? '' : answer ? 'true' : 'false';

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-semibold">{question.text}</h3>

        <RadioGroup value={selectedValue} onValueChange={handleChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true" className="text-sm font-normal cursor-pointer">
              True
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false" className="text-sm font-normal cursor-pointer">
              False
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
