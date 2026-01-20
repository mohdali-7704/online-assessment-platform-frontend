'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/lib/utils/helpers';
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD } from '@/lib/utils/constants';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
}

export default function Timer({ initialSeconds, onTimeUp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp]);

  const getVariant = (): 'default' | 'destructive' | 'secondary' => {
    if (timeRemaining <= TIMER_CRITICAL_THRESHOLD) {
      return 'destructive';
    }
    if (timeRemaining <= TIMER_WARNING_THRESHOLD) {
      return 'secondary';
    }
    return 'default';
  };

  return (
    <Badge variant={getVariant()} className="text-lg px-4 py-2 font-mono">
      {formatTime(timeRemaining)}
    </Badge>
  );
}
