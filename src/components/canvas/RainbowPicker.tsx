'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

interface RainbowPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export default function RainbowPicker({ onColorSelect, onClose }: RainbowPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastColor = useRef<string | null>(null);
  const [previewColor, setPreviewColor] = useState<string | null>(null);

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

  const sampleColor = useCallback((clientX: number, clientY: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width - 1, ((clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(0, Math.min(canvas.height - 1, ((clientY - rect.top) / rect.height) * canvas.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return (
      '#' +
      [pixel[0], pixel[1], pixel[2]]
        .map((c) => c.toString(16).padStart(2, '0'))
        .join('')
    );
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const color = sampleColor(e.clientX, e.clientY);
    if (color) {
      setPreviewColor(color);
      lastColor.current = color;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const color = sampleColor(e.clientX, e.clientY);
    if (color) {
      setPreviewColor(color);
      lastColor.current = color;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (lastColor.current) {
      onColorSelect(lastColor.current);
    }
    setPreviewColor(null);
    lastColor.current = null;
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

        {/* Color preview rectangle */}
        <div
          className="w-full rounded-lg mb-2 transition-colors duration-75"
          style={{
            height: '2.5rem',
            backgroundColor: previewColor ?? 'transparent',
            border: previewColor ? 'none' : '2px dashed #4b5563',
          }}
        />

        <canvas
          ref={canvasRef}
          width={360}
          height={200}
          className="w-full rounded-lg cursor-crosshair touch-none"
          style={{ height: 'calc(100% - 24px - 2.5rem - 0.5rem)' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
}
