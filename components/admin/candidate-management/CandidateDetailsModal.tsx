'use client';

import { Candidate } from '@/lib/types/candidate';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Clock, Shield, Building, Key } from 'lucide-react';

interface CandidateDetailsModalProps {
  candidate: Omit<Candidate, 'password'> | null;
  open: boolean;
  onClose: () => void;
  onResendCredentials?: (candidateId: string) => void;
}

export function CandidateDetailsModal({ candidate, open, onClose, onResendCredentials }: CandidateDetailsModalProps) {
  if (!candidate) return null;

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: Candidate['role']) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResendCredentials = () => {
    if (onResendCredentials) {
      onResendCredentials(candidate.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <p className="text-muted-foreground">@{candidate.username}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getRoleColor(candidate.role)}>
                {candidate.role === 'admin' ? 'Admin' : 'Candidate'}
              </Badge>
              <Badge className={getStatusColor(candidate.status)}>
                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              {candidate.department && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.department}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Credentials Management */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Credentials Management
            </h4>
            <div className="ml-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Username: <strong>{candidate.username}</strong>
              </p>
              {onResendCredentials && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendCredentials}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Reset & Send New Password
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account Information
            </h4>
            <div className="space-y-2 ml-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Created:</strong> {formatDate(candidate.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Last Login:</strong> {formatDate(candidate.lastLogin)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  <strong>Candidate ID:</strong> {candidate.id}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Summary - Placeholder for future implementation */}
          <Separator />
          <div>
            <h4 className="font-semibold mb-3">Activity Summary</h4>
            <div className="text-sm text-muted-foreground ml-6">
              <p>• Assessments Taken: 0</p>
              <p>• Average Score: N/A</p>
              <p>• Last Assessment: Never</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
