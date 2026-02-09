'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { assessmentService } from '@/lib/services/assessmentService';
import type { Assessment } from '@/lib/services/assessmentService';

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assessments on mount and when returning from other pages
  useEffect(() => {
    loadAssessments();
  }, []);

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

  const handleView = (id: string) => {
    router.push(`/assessment/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/assessments/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await assessmentService.deleteAssessment(id);
      await loadAssessments();
      setDeleteConfirm(null);
      alert('Assessment deleted successfully!');
    } catch (err: any) {
      alert(`Failed to delete assessment: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Assessments</h2>
              <p className="text-muted-foreground">Manage all assessments</p>
            </div>
            <Button onClick={() => router.push('/admin/assessments/create')} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Assessment
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading assessments...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">Error: {error}</p>
                <Button onClick={loadAssessments} className="mt-4">
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assessments List */}
          {!loading && !error && (
            <div className="grid gap-4">
              {assessments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No assessments found. Create one to get started!</p>
                    <Button onClick={() => router.push('/admin/assessments/create')} className="mt-4 gap-2">
                      <Plus className="w-4 h-4" />
                      Create Assessment
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                assessments.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle>{assessment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{assessment.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleView(assessment.id)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleEdit(assessment.id)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive"
                            onClick={() => setDeleteConfirm(assessment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm">
                        <Badge variant="secondary">{assessment.duration} mins</Badge>
                        <Badge variant="secondary">{assessment.totalPoints} points</Badge>
                        <Badge variant="outline">{assessment.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Confirm Deletion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Are you sure you want to delete this assessment? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(deleteConfirm)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
