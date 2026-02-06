import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface QuestionFormActionsProps {
  onSave: () => void;
  saveLabel?: string;
}

export default function QuestionFormActions({
  onSave,
  saveLabel = 'Save Question'
}: QuestionFormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() => router.back()}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        {saveLabel}
      </Button>
    </div>
  );
}
