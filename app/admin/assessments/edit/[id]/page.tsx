'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { getAssessmentById } from '@/data/mock-assessments';
import type { Assessment } from '@/lib/types/question';

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;

    // Load assessment
    const loadedAssessment = getAssessmentById(assessmentId);

    if (!loadedAssessment) {
      alert('Assessment not found');
      router.push('/admin/assessments');
      return;
    }

    // Check if this is a custom assessment
    const customAssessments = JSON.parse(localStorage.getItem('custom_assessments') || '[]');
    const isCustomAssessment = customAssessments.some((a: Assessment) => a.id === assessmentId);

    if (!isCustomAssessment) {
      alert('Only custom assessments can be edited. Default assessments are read-only.');
      router.push('/admin/assessments');
      return;
    }

    setAssessment(loadedAssessment);
    setTitle(loadedAssessment.title);
    setDescription(loadedAssessment.description);
    setDuration(loadedAssessment.duration);
    setIsCustom(true);
    setLoading(false);
  }, [assessmentId, router]);

  const handleSave = () => {
    if (!assessment || !isCustom) return;

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    // Update the assessment
    const updatedAssessment: Assessment = {
      ...assessment,
      title: title.trim(),
      description: description.trim(),
      duration,
    };

    // Update in localStorage
    const customAssessments = JSON.parse(localStorage.getItem('custom_assessments') || '[]');
    const index = customAssessments.findIndex((a: Assessment) => a.id === assessmentId);

    if (index !== -1) {
      customAssessments[index] = updatedAssessment;
      localStorage.setItem('custom_assessments', JSON.stringify(customAssessments));
      alert('Assessment updated successfully!');
      router.push('/admin/assessments');
    } else {
      alert('Error updating assessment');
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/assessments')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Edit Assessment</h2>
              <p className="text-muted-foreground">Update assessment details</p>
            </div>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assessment title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter assessment description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This assessment has {assessment.questions.length} question(s) totaling {assessment.totalPoints} points.
                </p>
                <p className="text-sm text-muted-foreground">
                  Note: Question editing is not currently supported. To modify questions, please create a new assessment.
                </p>
                <div className="space-y-2 mt-4">
                  {assessment.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">Question {idx + 1}:</span> {q.text.substring(0, 80)}
                          {q.text.length > 80 && '...'}
                        </div>
                        <span className="text-sm text-muted-foreground">{q.points} pts</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Type: {q.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/assessments')}>
              Cancel
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
