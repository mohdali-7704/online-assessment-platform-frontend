import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptiveQuestionFormProps {
  text: string;
  setText: (value: string) => void;
  points: number;
  setPoints: (value: number) => void;
  maxLength: number | undefined;
  setMaxLength: (value: number | undefined) => void;
}

export default function DescriptiveQuestionForm({
  text,
  setText,
  points,
  setPoints,
  maxLength,
  setMaxLength
}: DescriptiveQuestionFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your question"
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
        <Label>Max Length (optional)</Label>
        <Input
          type="number"
          value={maxLength || ''}
          onChange={(e) => setMaxLength(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Leave empty for no limit"
        />
      </div>
    </div>
  );
}
