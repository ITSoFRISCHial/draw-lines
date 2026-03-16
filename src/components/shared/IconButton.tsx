'use client';

import { ICON_SIZE_CLASS } from '@/lib/constants';

interface IconButtonProps {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
  className?: string;
}

export default function IconButton({ onClick, active, children, label, className = '' }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        ${ICON_SIZE_CLASS}
        flex items-center justify-center rounded-xl
        transition-all duration-150 active:scale-90
        ${active
          ? 'bg-white/30 ring-2 ring-white shadow-lg'
          : 'bg-white/10 hover:bg-white/20'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
