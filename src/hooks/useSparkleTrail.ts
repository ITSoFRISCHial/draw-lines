'use client';

import { useCallback, useRef } from 'react';
import { SPARKLE_INTERVAL } from '@/lib/constants';
import type { Canvas as FabricCanvas } from 'fabric';

interface Point {
  x: number;
  y: number;
}

export function useSparkleTrail(canvasRef: React.RefObject<FabricCanvas | null>, color: string) {
  const lastPoint = useRef<Point | null>(null);
  const distAccum = useRef(0);

  const addSparkle = useCallback((canvas: FabricCanvas, x: number, y: number, brushColor: string) => {
    // Dynamic import fabric to avoid SSR issues
    import('fabric').then(({ FabricObject, Path }) => {
      const size = 4 + Math.random() * 6;
      const angle = Math.random() * 360;

      // Simple 4-point star path
      const s = size;
      const inner = s * 0.3;
      const d = `M 0 ${-s} L ${inner} ${-inner} L ${s} 0 L ${inner} ${inner} L 0 ${s} L ${-inner} ${inner} L ${-s} 0 L ${-inner} ${-inner} Z`;

      const star = new Path(d, {
        left: x,
        top: y,
        fill: brushColor,
        opacity: 0.6 + Math.random() * 0.4,
        angle: angle,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });

      (star as typeof star & { isSparkle: boolean }).isSparkle = true;
      canvas.add(star);
    });
  }, []);

  const onMouseMove = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (lastPoint.current) {
      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distAccum.current += dist;

      while (distAccum.current >= SPARKLE_INTERVAL) {
        distAccum.current -= SPARKLE_INTERVAL;
        const t = 1 - distAccum.current / dist;
        const sx = lastPoint.current.x + dx * t + (Math.random() - 0.5) * 10;
        const sy = lastPoint.current.y + dy * t + (Math.random() - 0.5) * 10;
        addSparkle(canvas, sx, sy, color);
      }
    }

    lastPoint.current = { x, y };
  }, [canvasRef, color, addSparkle]);

  const reset = useCallback(() => {
    lastPoint.current = null;
    distAccum.current = 0;
  }, []);

  return { onMouseMove, reset };
}
