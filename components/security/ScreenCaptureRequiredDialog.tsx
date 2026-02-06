'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface ScreenCaptureRequiredDialogProps {
  open: boolean;
  onRetry: () => void;
  onCancel: () => void;
}

export function ScreenCaptureRequiredDialog({
  open,
  onRetry,
  onCancel
}: ScreenCaptureRequiredDialogProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl">Screen Sharing Required</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            You must grant screen sharing permission to take this assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              Screen monitoring is a mandatory security requirement for this assessment. Without it, we cannot ensure test integrity and fair evaluation for all students.
            </p>
          </div>

          {!showHelp ? (
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <HelpCircle className="h-4 w-4" />
              Why is this required?
            </button>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Why Screen Sharing is Required:
              </p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Prevents cheating by monitoring for unauthorized resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Ensures fair evaluation for all test takers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Captures evidence only when security violations occur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Maintains assessment credibility and integrity</span>
                </li>
              </ul>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Having trouble?</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)</li>
              <li>• Check that browser permissions are not blocked</li>
              <li>• Close any VPN or security software that might interfere</li>
              <li>• Try refreshing the page and starting again</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="sm:flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
          <Button
            onClick={onRetry}
            className="sm:flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
