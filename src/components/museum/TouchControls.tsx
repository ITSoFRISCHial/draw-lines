'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface TouchControlsProps {
  onMove: (x: number, z: number) => void;
  onLook: (dx: number, dy: number) => void;
}

const JOYSTICK_SIZE = 80;
const KNOB_SIZE = 36;
const MAX_OFFSET = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export default function TouchControls({ onMove, onLook }: TouchControlsProps) {
  const [isTouch, setIsTouch] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const joystickTouchId = useRef<number | null>(null);
  const lookTouchId = useRef<number | null>(null);
  const lookLastPos = useRef<{ x: number; y: number } | null>(null);
  const joystickCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const moveInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentDir = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  // Continuously send move while joystick is held
  useEffect(() => {
    if (!isTouch) return;
    moveInterval.current = setInterval(() => {
      const { x, z } = currentDir.current;
      if (x !== 0 || z !== 0) {
        onMove(x, z);
      }
    }, 1000 / 60);
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [isTouch, onMove]);

  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    if (joystickTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    joystickTouchId.current = touch.identifier;
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      joystickCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchId.current) {
        const dx = touch.clientX - joystickCenter.current.x;
        const dy = touch.clientY - joystickCenter.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clampedDist = Math.min(dist, MAX_OFFSET);
        const angle = Math.atan2(dy, dx);
        const normX = clampedDist / MAX_OFFSET;

        const knobX = Math.cos(angle) * clampedDist;
        const knobY = Math.sin(angle) * clampedDist;

        if (knobRef.current) {
          knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
        }

        // Map joystick: X is strafe (left/right), Y is forward/back (mapped to Z)
        currentDir.current = {
          x: (Math.cos(angle) * normX),
          z: (Math.sin(angle) * normX),
        };
      }
    }
  }, []);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        currentDir.current = { x: 0, z: 0 };
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(0px, 0px)';
        }
      }
    }
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
        const dy = touch.clientY - lookLastPos.current.y;
        lookLastPos.current = { x: touch.clientX, y: touch.clientY };
        onLook(dx * 0.005, dy * 0.005);
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
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Left side: virtual joystick */}
      <div
        className="absolute bottom-8 left-8 pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <div
          ref={joystickRef}
          className="relative rounded-full border-2 border-white/40 bg-black/20 flex items-center justify-center"
          style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
        >
          <div
            ref={knobRef}
            className="rounded-full bg-white/60 shadow-md"
            style={{
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              transition: 'none',
              willChange: 'transform',
            }}
          />
        </div>
      </div>

      {/* Right side: look/camera drag area */}
      <div
        className="absolute bottom-0 right-0 pointer-events-auto"
        style={{
          width: '50%',
          height: '40%',
          touchAction: 'none',
        }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      >
        <div className="w-full h-full flex items-center justify-center opacity-20">
          <div className="w-16 h-16 border-2 border-white/40 rounded-lg flex items-center justify-center text-white/40 text-xs select-none">
            Look
          </div>
        </div>
      </div>
    </div>
  );
}
