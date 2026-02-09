'use client';

import { useState } from 'react';
import { CandidateCredentials } from '@/lib/types/candidate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Mail, Eye, EyeOff } from 'lucide-react';

interface CredentialsModalProps {
  credentials: CandidateCredentials | null;
  candidateName: string;
  open: boolean;
  onClose: () => void;
}

export function CredentialsModal({ credentials, candidateName, open, onClose }: CredentialsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(true);

  if (!credentials) return null;

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendCredentials = () => {
    // Placeholder for future email functionality
    alert('Email functionality will be implemented in backend integration');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Candidate Credentials Created</DialogTitle>
          <DialogDescription>
            Login credentials for {candidateName}. Make sure to save these - they won't be shown again.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription>
            Important: Copy these credentials now. The password cannot be retrieved later.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="flex gap-2">
              <Input value={credentials.username} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.username, 'username')}
              >
                {copiedField === 'username' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.password, 'password')}
              >
                {copiedField === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleSendCredentials}
            >
              <Mail className="h-4 w-4" />
              Send via Email (Coming Soon)
            </Button>
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
