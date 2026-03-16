'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { mixColorsRYB } from '@/lib/colorMixer';

interface PotionMixerProps {
  onColorMixed: (color: string) => void;
  onClose: () => void;
}

function InlineColorPicker({ onPick }: { onPick: (color: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const hue = (x / width) * 360;
        const lightness = 10 + (y / height) * 80;
        ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  const sampleColor = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(canvas.width - 1, ((clientX - rect.left) / rect.width) * canvas.width));
      const y = Math.max(0, Math.min(canvas.height - 1, ((clientY - rect.top) / rect.height) * canvas.height));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const hex =
        '#' +
        [pixel[0], pixel[1], pixel[2]]
          .map((c) => c.toString(16).padStart(2, '0'))
          .join('');
      onPick(hex);
    },
    [onPick],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    sampleColor(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    sampleColor(e.clientX, e.clientY);
  };
  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={120}
      className="w-full h-24 rounded-lg cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}

export default function PotionMixer({ onColorMixed, onClose }: PotionMixerProps) {
  const [bottle1, setBottle1] = useState<string | null>(null);
  const [bottle2, setBottle2] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState<string | null>(null);
  const [isMixing, setIsMixing] = useState(false);
  const [pickingBottle, setPickingBottle] = useState<1 | 2 | null>(null);

  const handleBottleTap = useCallback((which: 1 | 2) => {
    setPickingBottle(which);
    setResultColor(null);
  }, []);

  const handleColorPicked = useCallback(
    (color: string) => {
      if (pickingBottle === 1) setBottle1(color);
      else if (pickingBottle === 2) setBottle2(color);
      setPickingBottle(null);
    },
    [pickingBottle],
  );

  const mixColors = useCallback(() => {
    if (!bottle1 || !bottle2) return;
    setIsMixing(true);
    setTimeout(() => {
      const mixed = mixColorsRYB(bottle1, bottle2);
      setResultColor(mixed);
      setIsMixing(false);
    }, 600);
  }, [bottle1, bottle2]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="relative bg-gray-900 rounded-t-2xl p-6 pt-2 h-[50vh] md:h-[40vh] lg:h-[35vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-500" />
        </div>

        {/* Inline color picker when selecting a bottle color */}
        {pickingBottle !== null && (
          <div className="mb-3">
            <p className="text-xs text-white/60 text-center mb-1">
              Pick a color for bottle {pickingBottle}
            </p>
            <InlineColorPicker onPick={handleColorPicked} />
          </div>
        )}

        <div className="flex items-end justify-center gap-4 md:gap-8 h-[calc(100%-40px)]">
          {/* Bottle 1 */}
          <button
            onClick={() => handleBottleTap(1)}
            className={`flex flex-col items-center gap-2 transition-transform duration-500 ${
              isMixing ? 'translate-x-4 rotate-12' : ''
            } ${pickingBottle === 1 ? 'ring-2 ring-yellow-400 rounded-xl' : ''}`}
            aria-label="Fill potion bottle 1"
          >
            <span className="text-xs text-white/60">
              {bottle1 ? 'Tap to change' : 'Tap to pick'}
            </span>
            <div
              className="w-14 h-24 md:w-16 md:h-28 rounded-lg rounded-t-sm border-2 border-white/30 relative overflow-hidden"
              style={{ backgroundColor: bottle1 ?? '#333' }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-md border-2 border-b-0 border-white/30 bg-inherit" />
            </div>
          </button>

          {/* Cauldron */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <button
              onClick={mixColors}
              disabled={!bottle1 || !bottle2 || isMixing}
              className="w-20 h-16 md:w-24 md:h-20 rounded-b-full bg-gray-700 border-2 border-white/20
                flex items-center justify-center text-2xl
                disabled:opacity-40 active:scale-95 transition-all"
              aria-label="Mix potions"
            >
              <span className="text-3xl">🍯</span>
            </button>

            {/* Result */}
            {resultColor && (
              <button
                onClick={() => onColorMixed(resultColor)}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-yellow-400
                  shadow-lg shadow-yellow-400/30 animate-bounce"
                style={{ backgroundColor: resultColor }}
                aria-label="Use mixed color"
              />
            )}
          </div>

          {/* Bottle 2 */}
          <button
            onClick={() => handleBottleTap(2)}
            className={`flex flex-col items-center gap-2 transition-transform duration-500 ${
              isMixing ? '-translate-x-4 -rotate-12' : ''
            } ${pickingBottle === 2 ? 'ring-2 ring-yellow-400 rounded-xl' : ''}`}
            aria-label="Fill potion bottle 2"
          >
            <span className="text-xs text-white/60">
              {bottle2 ? 'Tap to change' : 'Tap to pick'}
            </span>
            <div
              className="w-14 h-24 md:w-16 md:h-28 rounded-lg rounded-t-sm border-2 border-white/30 relative overflow-hidden"
              style={{ backgroundColor: bottle2 ?? '#333' }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-md border-2 border-b-0 border-white/30 bg-inherit" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
