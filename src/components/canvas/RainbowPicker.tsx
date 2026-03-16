'use client';

import { useRef, useEffect, useCallback } from 'react';

interface RainbowPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export default function RainbowPicker({ onColorSelect, onClose }: RainbowPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  // Draw HSL gradient on mount
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
        const lightness = 10 + (y / height) * 80; // 10% to 90%
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
      onColorSelect(hex);
    },
    [onColorSelect],
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="relative bg-gray-900 rounded-t-2xl p-4 pt-2 h-[50vh] md:h-[40vh] lg:h-[35vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-500" />
        </div>

        <canvas
          ref={canvasRef}
          width={360}
          height={200}
          className="w-full h-[calc(100%-24px)] rounded-lg cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
}
