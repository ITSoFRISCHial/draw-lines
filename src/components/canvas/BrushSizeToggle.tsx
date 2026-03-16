'use client';

import IconButton from '@/components/shared/IconButton';
import type { BrushSize } from '@/types';

interface BrushSizeToggleProps {
  size: BrushSize;
  onToggle: () => void;
}

export default function BrushSizeToggle({ size, onToggle }: BrushSizeToggleProps) {
  return (
    <IconButton onClick={onToggle} label="Toggle brush size" active={false}>
      <div className="flex items-center justify-center gap-1">
        <div
          className={`rounded-full bg-white transition-all ${
            size === 'thick'
              ? 'w-6 h-6 md:w-7 md:h-7 ring-2 ring-yellow-300'
              : 'w-6 h-6 md:w-7 md:h-7 opacity-40'
          }`}
        />
        <div
          className={`rounded-full bg-white transition-all ${
            size === 'thin'
              ? 'w-3 h-3 md:w-4 md:h-4 ring-2 ring-yellow-300'
              : 'w-3 h-3 md:w-4 md:h-4 opacity-40'
          }`}
        />
      </div>
    </IconButton>
  );
}
