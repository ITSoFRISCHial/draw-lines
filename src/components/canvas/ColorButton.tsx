'use client';

import IconButton from '@/components/shared/IconButton';

interface ColorButtonProps {
  color: string;
  onClick: () => void;
}

export default function ColorButton({ color, onClick }: ColorButtonProps) {
  return (
    <IconButton onClick={onClick} label="Pick color">
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/50 shadow-inner"
        style={{ backgroundColor: color }}
      />
    </IconButton>
  );
}
