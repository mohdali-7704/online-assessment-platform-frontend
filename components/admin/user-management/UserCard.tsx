'use client';

import { User } from '@/lib/types/user';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, UserCheck, UserX, Shield } from 'lucide-react';

interface UserCardProps {
  user: Omit<User, 'password'>;
  onEdit: (user: Omit<User, 'password'>) => void;
  onDelete: (user: Omit<User, 'password'>) => void;
  onToggleStatus: (user: Omit<User, 'password'>) => void;
  onChangeRole: (user: Omit<User, 'password'>) => void;
}

export function UserCard({ user, onEdit, onDelete, onToggleStatus, onChangeRole }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'suspended':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleColor = (role: User['role']) => {
    return role === 'admin'
      ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      : 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header with name and badges */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{fullName}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <Badge className={getRoleColor(user.role)}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
              <Badge className={getStatusColor(user.status)}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.department && (
              <p className="text-sm text-muted-foreground">
                Department: {user.department}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-2 space-y-1 text-xs text-muted-foreground border-t">
            <p>Created: {formatDate(user.createdAt)}</p>
            <p>Last Login: {formatDate(user.lastLogin)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(user)}
          title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
        >
          {user.status === 'active' ? (
            <UserX className="h-4 w-4" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
        </Button>

        {user.role === 'user' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangeRole(user)}
            title="Promote to admin"
          >
            <Shield className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(user)}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
