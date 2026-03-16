'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import type { Tool } from '@/types';
import { SPARKLE_INTERVAL } from '@/lib/constants';

interface DrawingCanvasProps {
  color: string;
  brushSize: number;
  sparkleEnabled: boolean;
  activeTool: Tool;
  activeStamp: string | null;
  activeEmoji: string | null;
  onStampPlaced: () => void;
  onEmojiPlaced: () => void;
}

export interface DrawingCanvasHandle {
  getDataUrl(): string;
  clear(): void;
  getCanvas(): unknown | null;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  function DrawingCanvas(
    {
      color,
      brushSize,
      sparkleEnabled,
      activeTool,
      activeStamp,
      activeEmoji,
      onStampPlaced,
      onEmojiPlaced,
    },
    ref,
  ) {
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<import('fabric').Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastSparklePos = useRef<{ x: number; y: number } | null>(null);
    const strokeSparkles = useRef<import('fabric').FabricObject[]>([]);
    const isDrawing = useRef(false);

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      getDataUrl() {
        const canvas = fabricRef.current;
        if (!canvas) return '';
        // Use the rendered canvas element directly to avoid DPR/zoom
        // scaling issues with Fabric's toDataURL
        canvas.renderAll();
        return canvas.getElement().toDataURL('image/png');
      },
      clear() {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.requestRenderAll();
      },
      getCanvas() {
        return fabricRef.current;
      },
    }));

    // Create a sparkle star at a given position
    const addSparkle = useCallback(
      async (x: number, y: number) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const fabric = await import('fabric');
        const size = 4 + Math.random() * 6;
        const angle = Math.random() * 360;
        const opacity = 0.5 + Math.random() * 0.5;

        // Simple 4-point star path
        const starPath = `M 0 -${size} L ${size * 0.3} -${size * 0.3} L ${size} 0 L ${size * 0.3} ${size * 0.3} L 0 ${size} L -${size * 0.3} ${size * 0.3} L -${size} 0 L -${size * 0.3} -${size * 0.3} Z`;

        const star = new fabric.Path(starPath, {
          left: x,
          top: y,
          fill: '#FFFFFF',
          stroke: '#FFD700',
          strokeWidth: 1,
          opacity,
          angle,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
        canvas.add(star);
        strokeSparkles.current.push(star);
      },
      [color],
    );

    // Initialize fabric canvas
    useEffect(() => {
      let disposed = false;

      async function init() {
        const fabric = await import('fabric');
        if (disposed || !canvasElRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const canvas = new fabric.Canvas(canvasElRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          isDrawingMode: true,
          selection: false,
        });

        const brush = new fabric.PencilBrush(canvas);
        brush.color = color;
        brush.width = brushSize;
        canvas.freeDrawingBrush = brush;

        // Lock every new path and bring sparkles above it
        canvas.on('path:created', (e: { path: import('fabric').FabricObject }) => {
          e.path.set({ selectable: false, evented: false });

          // Move sparkles from this stroke above the new path
          for (const sparkle of strokeSparkles.current) {
            canvas.bringObjectToFront(sparkle);
          }
          strokeSparkles.current = [];
          lastSparklePos.current = null;
          canvas.requestRenderAll();
        });

        canvas.on('mouse:down', () => {
          isDrawing.current = true;
        });
        canvas.on('mouse:up', () => {
          isDrawing.current = false;
        });

        fabricRef.current = canvas;
      }

      init();

      return () => {
        disposed = true;
        if (fabricRef.current) {
          fabricRef.current.dispose();
          fabricRef.current = null;
        }
      };
      // Only run on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync brush color and width
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !canvas.freeDrawingBrush) return;
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
    }, [color, brushSize]);

    // Sync drawing mode based on active tool
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      if (activeTool === 'draw') {
        canvas.isDrawingMode = true;
        canvas.defaultCursor = 'crosshair';
      } else {
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'pointer';
      }
    }, [activeTool]);

    // Stamp placement handler
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || activeTool !== 'stamp' || !activeStamp) return;

      const handler = async (opt: import('fabric').TPointerEventInfo) => {
        const pointer = canvas.getScenePoint(opt.e);
        const fabric = await import('fabric');

        try {
          const result = await fabric.loadSVGFromURL(activeStamp);
          const group = fabric.util.groupSVGElements(
            result.objects.filter(Boolean) as import('fabric').FabricObject[],
            result.options,
          );
          group.set({
            left: pointer.x,
            top: pointer.y,
            originX: 'center',
            originY: 'center',
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: false,
            evented: false,
          });

          // Recolor with current color
          if ('forEachObject' in group) {
            (group as import('fabric').Group).forEachObject((obj) => {
              obj.set({ fill: color });
            });
          } else {
            group.set({ fill: color });
          }

          canvas.add(group);
          canvas.requestRenderAll();
          onStampPlaced();
        } catch {
          // SVG load failed silently
        }
      };

      canvas.on('mouse:down', handler);
      return () => {
        canvas.off('mouse:down', handler);
      };
    }, [activeTool, activeStamp, color, onStampPlaced]);

    // Emoji placement handler
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || activeTool !== 'emoji' || !activeEmoji) return;

      const handler = async (opt: import('fabric').TPointerEventInfo) => {
        const pointer = canvas.getScenePoint(opt.e);
        const fabric = await import('fabric');

        const text = new fabric.FabricText(activeEmoji, {
          left: pointer.x,
          top: pointer.y,
          fontSize: 40,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });

        canvas.add(text);
        canvas.requestRenderAll();
        onEmojiPlaced();
      };

      canvas.on('mouse:down', handler);
      return () => {
        canvas.off('mouse:down', handler);
      };
    }, [activeTool, activeEmoji, onEmojiPlaced]);

    // Sparkle trail during drawing
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas || !sparkleEnabled) return;

      const onMouseMove = (opt: import('fabric').TPointerEventInfo) => {
        if (!canvas.isDrawingMode || !isDrawing.current) return;
        const pointer = canvas.getScenePoint(opt.e);
        const last = lastSparklePos.current;

        if (last) {
          const dx = pointer.x - last.x;
          const dy = pointer.y - last.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < SPARKLE_INTERVAL) return;
        }

        lastSparklePos.current = { x: pointer.x, y: pointer.y };
        addSparkle(pointer.x, pointer.y);
      };

      canvas.on('mouse:move', onMouseMove);
      return () => {
        canvas.off('mouse:move', onMouseMove);
      };
    }, [sparkleEnabled, addSparkle]);

    // Window resize handler
    useEffect(() => {
      const handleResize = () => {
        const canvas = fabricRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        canvas.setDimensions({ width, height });
        canvas.requestRenderAll();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <canvas ref={canvasElRef} className="touch-action-none" style={{ touchAction: 'none' }} />
      </div>
    );
  },
);

export default DrawingCanvas;
