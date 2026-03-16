'use client';

import IconButton from '@/components/shared/IconButton';

interface SparkleToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SparkleToggle({ enabled, onToggle }: SparkleToggleProps) {
  return (
    <IconButton onClick={onToggle} active={enabled} label="Toggle sparkle trail">
      <span className={`text-2xl md:text-3xl transition-transform ${enabled ? 'scale-110' : 'opacity-50'}`}>
        ✨
      </span>
    </IconButton>
  );
}
