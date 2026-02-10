"use client";

import { useState } from "react";
import AdminRoute from "@/components/auth/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCandidateManagement } from "@/lib/hooks/useCandidateManagement";
import { Candidate, CandidateCredentials } from "@/lib/types/candidate";
import { candidateService } from "@/lib/services/candidateService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CandidateForm } from "@/components/admin/candidate-management/CandidateForm";
import { CandidateDetailsModal } from "@/components/admin/candidate-management/CandidateDetailsModal";
import { CredentialsModal } from "@/components/admin/candidate-management/CredentialsModal";
import { CsvImport } from "@/components/admin/candidate-management/CsvImport";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Filter,
  Eye,
} from "lucide-react";

export default function CandidatesPage() {
  const {
    candidates,
    filters,
    stats,
    isLoading,
    updateFilters,
    clearFilters,
    loadCandidates,
    deleteCandidate,
    updateCandidateStatus,
    updateCandidateRole,
  } = useCandidateManagement();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingCandidate, setViewingCandidate] = useState<Omit<Candidate, "password"> | null>(
    null,
  );
  const [editingCandidate, setEditingCandidate] = useState<Omit<Candidate, "password"> | null>(
    null,
  );
  const [deletingCandidate, setDeletingCandidate] = useState<Omit<
    Candidate,
    "password"
  > | null>(null);
  const [togglingStatusCandidate, setTogglingStatusCandidate] = useState<Omit<
    Candidate,
    "password"
  > | null>(null);
  const [changingRoleCandidate, setChangingRoleCandidate] = useState<Omit<
    Candidate,
    "password"
  > | null>(null);

  // Credentials modal state
  const [showCredentials, setShowCredentials] = useState(false);
  const [currentCredentials, setCurrentCredentials] = useState<CandidateCredentials | null>(null);
  const [credentialsForName, setCredentialsForName] = useState("");

  const handleCreateCandidate = (credentials?: CandidateCredentials) => {
    setShowCreateForm(false);
    loadCandidates();

    // Show credentials modal if credentials were returned
    if (credentials) {
      setCurrentCredentials(credentials);
      setCredentialsForName(credentials.username);
      setShowCredentials(true);
    }
  };

  const handleViewCandidate = (candidate: Omit<Candidate, "password">) => {
    setViewingCandidate(candidate);
  };

  const handleEditCandidate = (candidate: Omit<Candidate, "password">) => {
    setEditingCandidate(candidate);
  };

  const handleUpdateCandidate = () => {
    setEditingCandidate(null);
    loadCandidates();
  };

  const handleDeleteCandidate = (candidate: Omit<Candidate, "password">) => {
    setDeletingCandidate(candidate);
  };

  const confirmDeleteCandidate = () => {
    if (deletingCandidate) {
      deleteCandidate(deletingCandidate.id);
      setDeletingCandidate(null);
    }
  };

  const handleToggleStatus = (candidate: Omit<Candidate, "password">) => {
    setTogglingStatusCandidate(candidate);
  };

  const confirmToggleStatus = () => {
    if (togglingStatusCandidate) {
      const newStatus =
        togglingStatusCandidate.status === "active" ? "inactive" : "active";
      updateCandidateStatus(togglingStatusCandidate.id, newStatus);
      setTogglingStatusCandidate(null);
    }
  };

  const handleChangeRole = (candidate: Omit<Candidate, "password">) => {
    setChangingRoleCandidate(candidate);
  };

  const confirmChangeRole = () => {
    if (changingRoleCandidate) {
      const newRole = changingRoleCandidate.role === "candidate" ? "admin" : "candidate";
      updateCandidateRole(changingRoleCandidate.id, newRole);
      setChangingRoleCandidate(null);
    }
  };


  const handleResendCredentials = async (candidateId: string) => {
    const credentials = await candidateService.resetPassword(candidateId);
    if (credentials) {
      setCurrentCredentials(credentials);
      const candidate = candidates.find((c) => c.id === candidateId);
      setCredentialsForName(
        candidate ? `${candidate.firstName} ${candidate.lastName}` : credentials.username
      );
      setShowCredentials(true);
      setViewingCandidate(null);
    }
  };

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: Candidate["role"]) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Candidates Management</h2>
              <p className="text-muted-foreground">
                Manage candidate accounts and permissions
              </p>
            </div>
            <div className="flex gap-2">
              <CsvImport onImportComplete={loadCandidates} />
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Candidate
              </Button>
            </div>
          </div>


          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">
                  Search by Name, Username, or Email
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    placeholder="Search candidates..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Filter */}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={filters.role}
                    onValueChange={(value) =>
                      updateFilters({ role: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="candidate">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      updateFilters({ status: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(filters.search ||
                filters.role !== "all" ||
                filters.status !== "all") && (
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear Filters
                  </Button>
                )}

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {candidates.length} of {stats.totalCandidates} candidates
              </div>
            </CardContent>
          </Card>

          {/* Candidates List */}
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading candidates...
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-12">
                  {stats.totalCandidates === 0 ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-lg">
                        No candidates in the system yet.
                      </p>
                      <Button
                        onClick={() => setShowCreateForm(true)}
                        className="gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Your First Candidate
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No candidates match your filters.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Candidate Name and Username */}
                          <div>
                            <div className="font-medium">
                              {candidate.firstName} {candidate.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @{candidate.username} • {candidate.email}
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getRoleColor(candidate.role)}>
                              {candidate.role === "admin" ? "Admin" : "Candidate"}
                            </Badge>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status.charAt(0).toUpperCase() +
                                candidate.status.slice(1)}
                            </Badge>
                            {candidate.department && (
                              <Badge variant="outline">
                                {candidate.department}
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              Created: {formatDate(candidate.createdAt)}
                            </Badge>
                            <Badge variant="secondary">
                              Last Login: {formatDate(candidate.lastLogin)}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCandidate(candidate)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCandidate(candidate)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(candidate)}
                            title={
                              candidate.status === "active"
                                ? "Deactivate candidate"
                                : "Activate candidate"
                            }
                          >
                            {candidate.status === "active" ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                          {candidate.role === "candidate" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeRole(candidate)}
                              title="Make Admin"
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCandidate(candidate)}
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credentials Modal */}
        <CredentialsModal
          credentials={currentCredentials}
          candidateName={credentialsForName}
          open={showCredentials}
          onClose={() => {
            setShowCredentials(false);
            setCurrentCredentials(null);
          }}
        />

        {/* View Candidate Details Modal */}
        <CandidateDetailsModal
          candidate={viewingCandidate}
          open={!!viewingCandidate}
          onClose={() => setViewingCandidate(null)}
          onResendCredentials={handleResendCredentials}
        />

        {/* Create Candidate Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CandidateForm
              onSubmit={handleCreateCandidate}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Candidate Dialog */}
        <Dialog
          open={!!editingCandidate}
          onOpenChange={(open) => !open && setEditingCandidate(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CandidateForm
              candidate={editingCandidate}
              onSubmit={handleUpdateCandidate}
              onCancel={() => setEditingCandidate(null)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingCandidate}
          onOpenChange={(open) => !open && setDeletingCandidate(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete candidate{" "}
                <strong>
                  {deletingCandidate?.firstName} {deletingCandidate?.lastName}
                </strong>
                ? This action cannot be undone and will remove all associated
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteCandidate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Candidate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toggle Status Confirmation Dialog */}
        <AlertDialog
          open={!!togglingStatusCandidate}
          onOpenChange={(open) => !open && setTogglingStatusCandidate(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {togglingStatusCandidate?.status === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                Candidate
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to{" "}
                {togglingStatusCandidate?.status === "active"
                  ? "deactivate"
                  : "activate"}{" "}
                candidate{" "}
                <strong>
                  {togglingStatusCandidate?.firstName} {togglingStatusCandidate?.lastName}
                </strong>
                ?
                {togglingStatusCandidate?.status === "active" &&
                  " This will prevent them from logging in."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmToggleStatus}>
                {togglingStatusCandidate?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Role Confirmation Dialog */}
        <AlertDialog
          open={!!changingRoleCandidate}
          onOpenChange={(open) => !open && setChangingRoleCandidate(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Make Admin</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to make candidate{" "}
                <strong>
                  {changingRoleCandidate?.firstName} {changingRoleCandidate?.lastName}
                </strong>{" "}
                an admin? This will grant them full administrative privileges.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmChangeRole}>
                Make Admin
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </AdminLayout>
    </AdminRoute>
  );
}
