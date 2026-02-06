'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Eye, AlertTriangle, Clock, Image as ImageIcon } from 'lucide-react';

interface Violation {
  type: 'tab_switch' | 'window_blur';
  data: {
    duration?: number;
    timestamp: string;
    violationNumber: number;
    screenshot?: string;
    screenshotSize?: number;
  };
}

interface ViolationReviewProps {
  assessmentId: string;
}

export function ViolationReview({ assessmentId }: ViolationReviewProps) {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load violations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`violations_${assessmentId}`);
      console.log('Loading violations for assessment:', assessmentId);
      console.log('Stored data:', stored);

      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Parsed violations:', parsed);
        setViolations(parsed);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load violations:', error);
      setIsLoading(false);
    }
  }, [assessmentId]);

  // Download single screenshot
  const downloadScreenshot = (screenshot: string, violationNumber: number) => {
    try {
      // Convert base64 to blob for more reliable downloads
      const base64Data = screenshot.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `violation-${violationNumber}-screenshot.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download screenshot:', error);
      alert('Failed to download screenshot. Please try again.');
    }
  };

  // Download all screenshots as separate files
  const downloadAllScreenshots = () => {
    const screenshotsToDownload = violations.filter(v => v.data.screenshot);

    if (screenshotsToDownload.length === 0) {
      alert('No screenshots available to download.');
      return;
    }

    console.log(`Starting download of ${screenshotsToDownload.length} screenshots...`);

    screenshotsToDownload.forEach((violation, index) => {
      setTimeout(() => {
        console.log(`Downloading screenshot ${index + 1}/${screenshotsToDownload.length}`);
        downloadScreenshot(violation.data.screenshot!, violation.data.violationNumber);
      }, index * 300); // Stagger downloads by 300ms
    });
  };

  // Download violations data as JSON
  const downloadViolationsData = () => {
    const dataStr = JSON.stringify(violations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `violations-${assessmentId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const screenshotsCount = violations.filter(v => v.data.screenshot).length;
  const tabSwitchCount = violations.filter(v => v.type === 'tab_switch').length;
  const windowBlurCount = violations.filter(v => v.type === 'window_blur').length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading violations...</p>
        </CardContent>
      </Card>
    );
  }

  if (violations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            No Security Violations Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This assessment was completed without any detected tab switches or focus changes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Security Violations Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Violations</p>
              <p className="text-2xl font-bold">{violations.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tab Switches</p>
              <p className="text-2xl font-bold text-orange-600">{tabSwitchCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Window Blur</p>
              <p className="text-2xl font-bold text-yellow-600">{windowBlurCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Screenshots</p>
              <p className="text-2xl font-bold text-blue-600">{screenshotsCount}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={downloadAllScreenshots}
              disabled={screenshotsCount === 0}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All Screenshots ({screenshotsCount})
            </Button>
            <Button onClick={downloadViolationsData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Data (JSON)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Violations Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {violations.map((violation, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Violation Number */}
                <div className="flex-shrink-0">
                  <Badge variant={violation.type === 'tab_switch' ? 'destructive' : 'secondary'}>
                    #{violation.data.violationNumber}
                  </Badge>
                </div>

                {/* Violation Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">
                      {violation.type === 'tab_switch' ? 'Tab Switch' : 'Window Blur'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(violation.data.timestamp)}
                    </span>
                    {violation.type === 'tab_switch' && violation.data.duration && (
                      <span>Duration: {formatDuration(violation.data.duration)}</span>
                    )}
                    {violation.data.screenshotSize && (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        {violation.data.screenshotSize} KB
                      </span>
                    )}
                  </div>
                </div>

                {/* Screenshot Preview/Actions */}
                {violation.data.screenshot && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedScreenshot(violation.data.screenshot!)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadScreenshot(violation.data.screenshot!, violation.data.violationNumber)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Viewer Dialog */}
      <Dialog open={selectedScreenshot !== null} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Violation Screenshot</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {selectedScreenshot && (
              <img
                src={selectedScreenshot}
                alt="Violation screenshot"
                className="w-full h-auto rounded-lg border"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedScreenshot(null)}>
              Close
            </Button>
            {selectedScreenshot && (
              <Button
                onClick={() => {
                  const violation = violations.find(v => v.data.screenshot === selectedScreenshot);
                  if (violation) {
                    downloadScreenshot(selectedScreenshot, violation.data.violationNumber);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
