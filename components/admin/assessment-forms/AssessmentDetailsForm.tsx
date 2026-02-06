import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AssessmentDetailsFormProps {
  title: string;
  description: string;
  totalSections: number;
  totalQuestions: number;
  totalDuration: number;
  totalPoints: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export default function AssessmentDetailsForm({
  title,
  description,
  totalSections,
  totalQuestions,
  totalDuration,
  totalPoints,
  onTitleChange,
  onDescriptionChange
}: AssessmentDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g., Full Stack Developer Assessment"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Brief description of the assessment"
            rows={3}
          />
        </div>

        <div className="p-4 bg-muted rounded-md">
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Total Sections:</span> {totalSections}</div>
            <div><span className="font-medium">Total Questions:</span> {totalQuestions}</div>
            <div><span className="font-medium">Total Duration:</span> {totalDuration} minutes</div>
            <div><span className="font-medium">Total Points:</span> {totalPoints}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
