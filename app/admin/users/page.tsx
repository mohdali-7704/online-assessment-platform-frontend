"use client";

import { useState } from "react";
import AdminRoute from "@/components/auth/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useUserManagement } from "@/lib/hooks/useUserManagement";
import { User } from "@/lib/types/user";
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
import { UserForm } from "@/components/admin/user-management/UserForm";
import { UserDetailsModal } from "@/components/admin/user-management/UserDetailsModal";
import { CsvImport } from "@/components/admin/user-management/CsvImport";
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

export default function UsersPage() {
  const {
    users,
    filters,
    stats,
    isLoading,
    updateFilters,
    clearFilters,
    loadUsers,
    deleteUser,
    updateUserStatus,
    updateUserRole,
  } = useUserManagement();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingUser, setViewingUser] = useState<Omit<User, "password"> | null>(
    null,
  );
  const [editingUser, setEditingUser] = useState<Omit<User, "password"> | null>(
    null,
  );
  const [deletingUser, setDeletingUser] = useState<Omit<
    User,
    "password"
  > | null>(null);
  const [togglingStatusUser, setTogglingStatusUser] = useState<Omit<
    User,
    "password"
  > | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<Omit<
    User,
    "password"
  > | null>(null);

  const handleCreateUser = () => {
    setShowCreateForm(false);
    loadUsers();
  };

  const handleViewUser = (user: Omit<User, "password">) => {
    setViewingUser(user);
  };

  const handleEditUser = (user: Omit<User, "password">) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    setEditingUser(null);
    loadUsers();
  };

  const handleDeleteUser = (user: Omit<User, "password">) => {
    setDeletingUser(user);
  };

  const confirmDeleteUser = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const handleToggleStatus = (user: Omit<User, "password">) => {
    setTogglingStatusUser(user);
  };

  const confirmToggleStatus = () => {
    if (togglingStatusUser) {
      const newStatus =
        togglingStatusUser.status === "active" ? "inactive" : "active";
      updateUserStatus(togglingStatusUser.id, newStatus);
      setTogglingStatusUser(null);
    }
  };

  const handleChangeRole = (user: Omit<User, "password">) => {
    setChangingRoleUser(user);
  };

  const confirmChangeRole = () => {
    if (changingRoleUser) {
      const newRole = changingRoleUser.role === "user" ? "admin" : "user";
      updateUserRole(changingRoleUser.id, newRole);
      setChangingRoleUser(null);
    }
  };

  const getStatusColor = (status: User["status"]) => {
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

  const getRoleColor = (role: User["role"]) => {
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
              <CsvImport onImportComplete={loadUsers} />
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
                      <SelectItem value="user">User</SelectItem>
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
                Showing {users.length} of {stats.totalUsers} candidates
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
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  {stats.totalUsers === 0 ? (
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
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {/* User Name and Username */}
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{user.username} • {user.email}
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role === "admin" ? "Admin" : "Candidate"}
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status.charAt(0).toUpperCase() +
                                  user.status.slice(1)}
                              </Badge>
                              {user.department && (
                                <Badge variant="outline">
                                  {user.department}
                                </Badge>
                              )}
                              <Badge variant="secondary">
                                Created: {formatDate(user.createdAt)}
                              </Badge>
                              <Badge variant="secondary">
                                Last Login: {formatDate(user.lastLogin)}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUser(user)}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              title={
                                user.status === "active"
                                  ? "Deactivate user"
                                  : "Activate user"
                              }
                            >
                              {user.status === "active" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </Button>
                            {user.role === "user" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleChangeRole(user)}
                                title="Make Admin"
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
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

        {/* View User Details Modal */}
        <UserDetailsModal
          user={viewingUser}
          open={!!viewingUser}
          onClose={() => setViewingUser(null)}
        />

        {/* Create User Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <UserForm
              user={editingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete candidate{" "}
                <strong>
                  {deletingUser?.firstName} {deletingUser?.lastName}
                </strong>
                ? This action cannot be undone and will remove all associated
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Candidate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toggle Status Confirmation Dialog */}
        <AlertDialog
          open={!!togglingStatusUser}
          onOpenChange={(open) => !open && setTogglingStatusUser(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {togglingStatusUser?.status === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                Candidate
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to{" "}
                {togglingStatusUser?.status === "active"
                  ? "deactivate"
                  : "activate"}{" "}
                candidate{" "}
                <strong>
                  {togglingStatusUser?.firstName} {togglingStatusUser?.lastName}
                </strong>
                ?
                {togglingStatusUser?.status === "active" &&
                  " This will prevent them from logging in."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmToggleStatus}>
                {togglingStatusUser?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Role Confirmation Dialog */}
        <AlertDialog
          open={!!changingRoleUser}
          onOpenChange={(open) => !open && setChangingRoleUser(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Make Admin</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to make candidate{" "}
                <strong>
                  {changingRoleUser?.firstName} {changingRoleUser?.lastName}
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
