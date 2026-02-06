import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { QuestionType } from '@/lib/types/question';

interface QuestionTypeSelectorProps {
  currentType: QuestionType;
  setCurrentType?: (type: QuestionType) => void;
  isEditing?: boolean;
}

export default function QuestionTypeSelector({
  currentType,
  setCurrentType,
  isEditing = false
}: QuestionTypeSelectorProps) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label>Question Type</Label>
        <Input
          value={currentType.replace('_', ' ').toUpperCase()}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Question type cannot be changed after creation
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Question Type *</Label>
      <Select
        value={currentType}
        onValueChange={(value) => setCurrentType?.(value as QuestionType)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={QuestionType.MCQ}>Multiple Choice</SelectItem>
          <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
          <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
          <SelectItem value={QuestionType.CODING}>Coding</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
