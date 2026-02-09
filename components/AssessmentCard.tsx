import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, FileCheck } from 'lucide-react';

interface AssessmentCardProps {
  assessment: {
    id: string;
    title: string;
    description?: string | null;
    duration: number;
    totalPoints: number;
    status: string;
    sections?: any[];
    questions?: any[];
  };
}

export default function AssessmentCard({ assessment }: AssessmentCardProps) {
  // Calculate question count from sections if available, otherwise use questions array
  const questionCount = assessment.sections
    ? assessment.sections.reduce((sum, section) => sum + (section.questions?.length || 0), 0)
    : (assessment.questions?.length || 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{assessment.title}</CardTitle>
        <CardDescription>{assessment.description || 'No description available'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileCheck className="w-4 h-4" />
            <span>{questionCount > 0 ? `${questionCount} Questions` : 'Questions TBA'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{assessment.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{assessment.totalPoints} points</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{assessment.status || 'draft'}</Badge>
          {assessment.sections && assessment.sections.length > 0 && (
            <Badge variant="secondary">{assessment.sections.length} Sections</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/assessment/${assessment.id}`} className="w-full">
          <Button className="w-full">Start Assessment</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
