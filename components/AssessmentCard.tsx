import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types/assessment';
import { Clock, FileText, Award } from 'lucide-react';

interface AssessmentCardProps {
  assessment: Assessment;
}

export default function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{assessment.title}</CardTitle>
        <CardDescription>{assessment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{assessment.questions.length} Questions</span>
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
          {assessment.questions.some(q => q.type === 'mcq') && (
            <Badge variant="outline">MCQ</Badge>
          )}
          {assessment.questions.some(q => q.type === 'true_false') && (
            <Badge variant="outline">True/False</Badge>
          )}
          {assessment.questions.some(q => q.type === 'descriptive') && (
            <Badge variant="outline">Descriptive</Badge>
          )}
          {assessment.questions.some(q => q.type === 'coding') && (
            <Badge variant="outline">Coding</Badge>
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
