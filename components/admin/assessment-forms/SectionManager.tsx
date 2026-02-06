import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Database, GripVertical, MoveUp, MoveDown } from 'lucide-react';
import { QuestionType } from '@/lib/types/question';
import type { AssessmentSection } from '@/lib/types/assessment';

interface SectionManagerProps {
  sections: AssessmentSection[];
  currentSectionId: string;
  onSectionAdd: () => void;
  onSectionRemove: (sectionId: string) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<AssessmentSection>) => void;
  onSectionSelect: (sectionId: string) => void;
  onSectionMoveUp: (index: number) => void;
  onSectionMoveDown: (index: number) => void;
  onQuestionRemove: (sectionId: string, questionId: string) => void;
  onAddNewQuestion: (sectionId: string) => void;
  onSelectFromBank: (sectionId: string) => void;
}

export default function SectionManager({
  sections,
  currentSectionId,
  onSectionAdd,
  onSectionRemove,
  onSectionUpdate,
  onSectionSelect,
  onSectionMoveUp,
  onSectionMoveDown,
  onQuestionRemove,
  onAddNewQuestion,
  onSelectFromBank
}: SectionManagerProps) {
  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ: return 'MCQ';
      case QuestionType.TRUE_FALSE: return 'True/False';
      case QuestionType.DESCRIPTIVE: return 'Descriptive';
      case QuestionType.CODING: return 'Coding';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sections ({sections.length})</CardTitle>
          <Button onClick={onSectionAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`p-4 border-2 rounded-lg transition-colors ${
              currentSectionId === section.id ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Drag Handle & Move Buttons */}
              <div className="flex flex-col gap-1 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onSectionMoveUp(index)}
                  disabled={index === 0}
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onSectionMoveDown(index)}
                  disabled={index === sections.length - 1}
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Section Details */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Section Name</Label>
                    <Input
                      value={section.name}
                      onChange={(e) => onSectionUpdate(section.id, { name: e.target.value })}
                      placeholder="Section name"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Question Type</Label>
                    <Select
                      value={section.questionType}
                      onValueChange={(value) => onSectionUpdate(section.id, {
                        questionType: value as QuestionType,
                        questions: [] // Clear questions when type changes
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={QuestionType.MCQ}>MCQ</SelectItem>
                        <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                        <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
                        <SelectItem value={QuestionType.CODING}>Coding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={section.duration}
                      onChange={(e) => onSectionUpdate(section.id, { duration: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>

                {/* Section Questions */}
                <div>
                  <div className="text-sm font-medium mb-2">
                    Questions ({section.questions.length}) • {section.questions.reduce((sum, q) => sum + q.points, 0)} points
                  </div>
                  {section.questions.length > 0 && (
                    <div className="space-y-2">
                      {section.questions.map((q, qIndex) => (
                        <div key={q.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm">
                          <div className="flex-1">
                            <div className="font-medium">Q{qIndex + 1}. {q.text}</div>
                            <div className="text-xs text-muted-foreground">
                              {getQuestionTypeLabel(q.type)} • {q.points} points
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onQuestionRemove(section.id, q.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Actions */}
                {currentSectionId === section.id && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddNewQuestion(section.id)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Question
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectFromBank(section.id)}
                      className="gap-2"
                    >
                      <Database className="w-4 h-4" />
                      Select from Bank
                    </Button>
                  </div>
                )}
              </div>

              {/* Section Actions */}
              <div className="flex flex-col gap-2">
                {currentSectionId !== section.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSectionSelect(section.id)}
                  >
                    Select
                  </Button>
                )}
                {sections.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSectionRemove(section.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
