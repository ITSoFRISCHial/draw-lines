'use client';

import { useEffect } from 'react';

export function useTouchPrevention() {
  useEffect(() => {
    // Prevent pinch zoom on the whole page
    const handler = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handler, { passive: false });
    return () => document.removeEventListener('touchmove', handler);
  }, []);
}
