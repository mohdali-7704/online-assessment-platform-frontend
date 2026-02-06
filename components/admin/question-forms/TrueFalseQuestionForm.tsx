import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TrueFalseQuestionFormProps {
  text: string;
  setText: (value: string) => void;
  points: number;
  setPoints: (value: number) => void;
  correctAnswer: boolean;
  setCorrectAnswer: (value: boolean) => void;
}

export default function TrueFalseQuestionForm({
  text,
  setText,
  points,
  setPoints,
  correctAnswer,
  setCorrectAnswer
}: TrueFalseQuestionFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your true/false question"
        />
      </div>

      <div className="space-y-2">
        <Label>Points *</Label>
        <Input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <RadioGroup
          value={correctAnswer.toString()}
          onValueChange={(value) => setCorrectAnswer(value === 'true')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false">False</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
