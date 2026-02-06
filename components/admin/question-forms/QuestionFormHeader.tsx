import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuestionFormHeaderProps {
  title: string;
  description: string;
}

export default function QuestionFormHeader({ title, description }: QuestionFormHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
