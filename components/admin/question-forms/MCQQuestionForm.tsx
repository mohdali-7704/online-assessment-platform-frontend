import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2 } from 'lucide-react';
import type { MCQOption } from '@/lib/types/question';

interface MCQQuestionFormProps {
  text: string;
  setText: (value: string) => void;
  points: number;
  setPoints: (value: number) => void;
  options: MCQOption[];
  setOptions: (value: MCQOption[]) => void;
  correctAnswers: string[];
  setCorrectAnswers: (value: string[]) => void;
  multipleAnswers: boolean;
  setMultipleAnswers: (value: boolean) => void;
}

export default function MCQQuestionForm({
  text,
  setText,
  points,
  setPoints,
  options,
  setOptions,
  correctAnswers,
  setCorrectAnswers,
  multipleAnswers,
  setMultipleAnswers
}: MCQQuestionFormProps) {
  const addOption = () => {
    const newId = String.fromCharCode(97 + options.length);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(opt => opt.id !== id));
    setCorrectAnswers(correctAnswers.filter(ans => ans !== id));
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const toggleCorrectAnswer = (id: string) => {
    if (multipleAnswers) {
      if (correctAnswers.includes(id)) {
        setCorrectAnswers(correctAnswers.filter(ans => ans !== id));
      } else {
        setCorrectAnswers([...correctAnswers, id]);
      }
    } else {
      setCorrectAnswers([id]);
    }
  };

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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="multiple"
          checked={multipleAnswers}
          onCheckedChange={(checked) => {
            setMultipleAnswers(!!checked);
            setCorrectAnswers([]);
          }}
        />
        <Label htmlFor="multiple">Allow multiple correct answers</Label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Options *</Label>
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="w-4 h-4 mr-1" />
            Add Option
          </Button>
        </div>

        {multipleAnswers ? (
          options.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                checked={correctAnswers.includes(option.id)}
                onCheckedChange={() => toggleCorrectAnswer(option.id)}
              />
              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Option ${option.id.toUpperCase()}`}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <RadioGroup
            value={correctAnswers[0] || ''}
            onValueChange={(value) => setCorrectAnswers([value])}
          >
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${option.id.toUpperCase()}`}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
