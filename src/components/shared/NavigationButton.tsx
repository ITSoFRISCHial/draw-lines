'use client';

import Link from 'next/link';
import { ICON_SIZE_CLASS } from '@/lib/constants';

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  label: string;
}

export default function NavigationButton({ href, children, label }: NavigationButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`
        ${ICON_SIZE_CLASS}
        flex items-center justify-center rounded-xl
        bg-white/10 hover:bg-white/20
        transition-all duration-150 active:scale-90
      `}
    >
      {children}
    </Link>
  );
}
