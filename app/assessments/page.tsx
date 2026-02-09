'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentCard from "@/components/AssessmentCard";
import { assessmentService } from "@/lib/services/assessmentService";
import type { Assessment } from "@/lib/services/assessmentService";
import { useAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from 'lucide-react';

export default function AssessmentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadAssessments();
    }
  }, [isAuthenticated, router]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentService.getAllAssessments();
      setAssessments(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load assessments');
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Available Assessments</h1>
          <p className="text-muted-foreground">
            Choose an assessment to test your knowledge and skills
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading assessments...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Error: {error}</p>
            <button onClick={loadAssessments} className="mt-4 text-primary underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>

            {assessments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No assessments available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
