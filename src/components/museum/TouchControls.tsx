'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface TouchControlsProps {
  onLook: (dx: number, dy: number) => void;
}

export default function TouchControls({ onLook }: TouchControlsProps) {
  const [isTouch, setIsTouch] = useState(false);
  const lookTouchId = useRef<number | null>(null);
  const lookLastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  const handleLookStart = useCallback((e: React.TouchEvent) => {
    if (lookTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lookLastPos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleLookMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId.current && lookLastPos.current) {
        const dx = touch.clientX - lookLastPos.current.x;
        lookLastPos.current = { x: touch.clientX, y: touch.clientY };
        onLook(dx * 0.005, 0);
      }
    }
  }, [onLook]);

  const handleLookEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId.current) {
        lookTouchId.current = null;
        lookLastPos.current = null;
      }
    }
  }, []);

  if (!isTouch) return null;

  return (
    <div className="fixed inset-0 z-5 pointer-events-none">
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{ touchAction: 'none' }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      />
    </div>
  );
}
