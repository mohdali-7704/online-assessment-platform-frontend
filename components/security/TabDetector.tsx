'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Camera } from 'lucide-react';

interface TabDetectorProps {
  children: React.ReactNode;
  onViolation: (type: 'tab_switch' | 'window_blur', data: any) => void;
  maxViolations?: number;
  onMaxViolationsReached?: () => void;
  screenStream: MediaStream; // Required: Active screen capture stream
}

export function TabDetector({
  children,
  onViolation,
  maxViolations = 3,
  onMaxViolationsReached,
  screenStream
}: TabDetectorProps) {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningType, setWarningType] = useState<'tab_switch' | 'window_blur'>('tab_switch');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [maxReached, setMaxReached] = useState(false);

  // Function to capture screenshot from screen share stream
  const captureScreenshot = async (): Promise<string | null> => {
    try {
      console.log('[TabDetector] Starting screenshot capture from screen stream...');
      setIsCapturingScreenshot(true);

      // Create video element to draw stream
      const video = document.createElement('video');
      video.srcObject = screenStream;
      video.muted = true;

      // Start playing the video
      await video.play();

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          resolve();
        };
        // Fallback timeout in case metadata doesn't load
        setTimeout(resolve, 1000);
      });

      // Small delay to ensure first frame is available
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to JPEG with 50% quality for smaller file size
      const screenshot = canvas.toDataURL('image/jpeg', 0.5);

      console.log('[TabDetector] Screenshot captured successfully from stream. Size:', Math.round(screenshot.length / 1024), 'KB');

      // Cleanup
      video.pause();
      video.srcObject = null;
      video.remove();

      setIsCapturingScreenshot(false);
      return screenshot;
    } catch (error) {
      console.error('[TabDetector] Failed to capture screenshot from stream:', error);
      setIsCapturingScreenshot(false);
      return null;
    }
  };

  useEffect(() => {
    let tabSwitchStartTime: number | null = null;
    let captureTimeout: NodeJS.Timeout | null = null;

    // Tab switching detection
    const handleVisibilityChange = () => {
      if (maxReached) return; // Stop processing if max already reached

      if (document.hidden) {
        // User switched away from tab
        tabSwitchStartTime = Date.now();
        setShowWarning(true);
        setWarningMessage('Tab switching detected! Please return to the assessment.');
        setWarningType('tab_switch');

        // Wait 500ms for the new tab to fully load, then capture what they're viewing
        captureTimeout = setTimeout(() => {
          console.log('[TabDetector] User switched away. Capturing screenshot after delay...');

          captureScreenshot().then(screenshot => {
            console.log('[TabDetector] Tab switch screenshot captured. Has screenshot:', !!screenshot);

            // Store the screenshot temporarily to use when they return
            if (tabSwitchStartTime) {
              const duration = Math.floor((Date.now() - tabSwitchStartTime) / 1000);

              setViolations(prev => {
                const newCount = prev + 1;

                // Call onViolation after state update completes
                setTimeout(() => {
                  const violationData = {
                    duration,
                    timestamp: new Date().toISOString(),
                    violationNumber: newCount,
                    screenshot: screenshot || undefined,
                    screenshotSize: screenshot ? Math.round(screenshot.length / 1024) : 0,
                  };

                  console.log('[TabDetector] Calling onViolation with data:', {
                    ...violationData,
                    screenshot: violationData.screenshot ? violationData.screenshot.substring(0, 50) + '...' : 'NO SCREENSHOT'
                  });

                  onViolation('tab_switch', violationData);

                  if (newCount >= maxViolations && onMaxViolationsReached && !maxReached) {
                    setMaxReached(true);
                    onMaxViolationsReached();
                  }
                }, 0);

                return newCount;
              });
            }
          });
        }, 500); // 500ms delay to let new tab load
      } else {
        // User returned to tab
        if (tabSwitchStartTime) {
          console.log('[TabDetector] User returned to tab.');

          // Clear any pending capture timeout
          if (captureTimeout) {
            clearTimeout(captureTimeout);
            captureTimeout = null;
          }

          tabSwitchStartTime = null;

          // Trigger shake animation
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);

          // Hide warning after 5 seconds
          setTimeout(() => setShowWarning(false), 5000);
        }
      }
    };

    // Window blur detection (Alt+Tab)
    const handleBlur = () => {
      if (maxReached) return; // Stop processing if max already reached

      console.log('[TabDetector] Window blur detected. Capturing screenshot after delay...');

      setShowWarning(true);
      setWarningMessage('Window focus lost! Please stay in the assessment.');
      setWarningType('window_blur');

      // Trigger shake animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);

      setTimeout(() => setShowWarning(false), 5000);

      // Wait 500ms for the new window/app to be visible, then capture
      setTimeout(() => {
        captureScreenshot().then(screenshot => {
          console.log('[TabDetector] Window blur screenshot capture promise resolved. Has screenshot:', !!screenshot);

          setViolations(prev => {
            const newCount = prev + 1;

            // Call onViolation after state update completes
            setTimeout(() => {
              const violationData = {
                timestamp: new Date().toISOString(),
                violationNumber: newCount,
                screenshot: screenshot || undefined, // Include screenshot if captured
                screenshotSize: screenshot ? Math.round(screenshot.length / 1024) : 0, // Size in KB
              };

              console.log('[TabDetector] Calling onViolation (window_blur) with data:', {
                ...violationData,
                screenshot: violationData.screenshot ? violationData.screenshot.substring(0, 50) + '...' : 'NO SCREENSHOT'
              });

              onViolation('window_blur', violationData);

              if (newCount >= maxViolations && onMaxViolationsReached && !maxReached) {
                setMaxReached(true);
                onMaxViolationsReached();
              }
            }, 0);

            return newCount;
          });
        });
      }, 500); // 500ms delay to let new window appear
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      // Clean up timeout if component unmounts
      if (captureTimeout) {
        clearTimeout(captureTimeout);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onViolation, maxViolations, onMaxViolationsReached, maxReached, screenStream]);

  // Calculate violation percentage for color coding
  const violationPercentage = (violations / maxViolations) * 100;
  const getSeverityColor = () => {
    if (violationPercentage >= 80) return 'bg-red-500';
    if (violationPercentage >= 50) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getSeverityBorderColor = () => {
    if (violationPercentage >= 80) return 'border-red-500';
    if (violationPercentage >= 50) return 'border-orange-500';
    return 'border-yellow-500';
  };

  const getSeverityBgColor = () => {
    if (violationPercentage >= 80) return 'bg-red-50 dark:bg-red-950';
    if (violationPercentage >= 50) return 'bg-orange-50 dark:bg-orange-950';
    return 'bg-yellow-50 dark:bg-yellow-950';
  };

  const getSeverityTextColor = () => {
    if (violationPercentage >= 80) return 'text-red-800 dark:text-red-200';
    if (violationPercentage >= 50) return 'text-orange-800 dark:text-orange-200';
    return 'text-yellow-800 dark:text-yellow-200';
  };

  return (
    <div className="relative">
      {/* Warning Alert */}
      {showWarning && (
        <div
          className={`
            fixed top-6 left-1/2 -translate-x-1/2 z-[100]
            w-full max-w-md mx-4
            ${isAnimating ? 'animate-shake' : ''}
            transition-all duration-300 ease-out
            ${showWarning ? 'animate-slide-down opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className={`
              ${getSeverityBgColor()}
              ${getSeverityBorderColor()}
              border-2 rounded-lg shadow-2xl
              backdrop-blur-sm
              overflow-hidden
            `}
          >
            {/* Top accent bar */}
            <div className={`h-1 ${getSeverityColor()}`} />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`
                  ${getSeverityColor()}
                  p-2 rounded-full
                  flex-shrink-0
                  animate-pulse
                `}>
                  {warningType === 'tab_switch' ? (
                    <EyeOff className="h-5 w-5 text-white" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold text-base ${getSeverityTextColor()}`}>
                      Security Alert
                    </h3>
                    <button
                      onClick={() => setShowWarning(false)}
                      className={`
                        ${getSeverityTextColor()}
                        hover:opacity-70 transition-opacity
                        text-xl leading-none
                        px-2 py-1 rounded
                      `}
                    >
                      ×
                    </button>
                  </div>

                  <p className={`text-sm ${getSeverityTextColor()} mb-3`}>
                    {warningMessage}
                  </p>

                  {/* Violation Counter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className={getSeverityTextColor()}>
                        Violations
                      </span>
                      <span className={`${getSeverityTextColor()} font-bold`}>
                        {violations} / {maxViolations}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                      <div
                        className={`
                          ${getSeverityColor()}
                          h-full rounded-full
                          transition-all duration-500 ease-out
                        `}
                        style={{ width: `${Math.min(violationPercentage, 100)}%` }}
                      />
                    </div>

                    {/* Warning Message */}
                    {violations >= maxViolations * 0.7 && (
                      <p className={`text-xs ${getSeverityTextColor()} font-semibold animate-pulse`}>
                        ⚠️ Warning: Approaching maximum violations!
                      </p>
                    )}

                    {/* Screenshot Capture Indicator */}
                    {isCapturingScreenshot && (
                      <div className="flex items-center gap-2 text-xs mt-2">
                        <Camera className={`h-3 w-3 ${getSeverityTextColor()} animate-pulse`} />
                        <span className={getSeverityTextColor()}>
                          Capturing screenshot...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Violation Counter (bottom right) */}
      {violations > 0 && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            ${getSeverityBgColor()}
            ${getSeverityBorderColor()}
            border-2 rounded-lg shadow-lg
            px-4 py-2
            transition-all duration-300
          `}
        >
          <div className="flex items-center gap-2">
            <Eye className={`h-4 w-4 ${getSeverityTextColor()}`} />
            <div className={`text-xs font-medium ${getSeverityTextColor()}`}>
              <span className="font-bold">{violations}</span>
              <span className="opacity-70"> / {maxViolations}</span>
            </div>
          </div>
        </div>
      )}

      {children}

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes slide-down {
          from {
            transform: translate(-50%, -120%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translate(-50%, 0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-50%, 0) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translate(-50%, 0) rotate(1deg); }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
