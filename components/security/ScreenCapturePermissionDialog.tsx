'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monitor, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScreenCapturePermissionDialogProps {
  open: boolean;
  onContinue: () => void;
}

export function ScreenCapturePermissionDialog({
  open,
  onContinue
}: ScreenCapturePermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl">Screen Sharing Required</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            For assessment integrity, we need to monitor your screen during this test.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-3">
              When prompted, please select:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Entire Screen</strong> (Recommended)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Application Window</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Browser Tab</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Important
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Screen monitoring helps ensure fair testing for all students. Your screen will be captured only when security violations are detected.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you consent to screen monitoring during this assessment.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue to Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
