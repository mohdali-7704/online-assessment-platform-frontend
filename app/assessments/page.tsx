'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentCard from "@/components/AssessmentCard";
import { getAllAssessments } from "@/data/mock-assessments";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AssessmentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const assessments = getAllAssessments();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
      </div>
    </div>
  );
}
