'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { BRUSH_THICK } from '@/lib/constants';
import type { Tool } from '@/types';
import { usePlayerName } from '@/hooks/usePlayerName';
import { useDrawings } from '@/hooks/useDrawings';
import { useTouchPrevention } from '@/hooks/useTouchPrevention';
import NameEntryModal from '@/components/shared/NameEntryModal';
import Toolbar from '@/components/canvas/Toolbar';
import SaveAnimation from '@/components/canvas/SaveAnimation';

const DrawingCanvas = dynamic(() => import('@/components/canvas/DrawingCanvas'), {
  ssr: false,
});

interface CanvasHandle {
  getDataUrl: () => string;
  clear: () => void;
  getCanvas: () => unknown | null;
}

function randomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 55%)`;
}

export default function DrawPage() {
  const { name, loaded, setName } = usePlayerName();
  const { saveDrawing } = useDrawings();
  useTouchPrevention();

  const canvasRef = useRef<CanvasHandle>(null);

  const [color, setColor] = useState(randomColor);
  const [brushSize, setBrushSize] = useState(BRUSH_THICK);
  const [sparkleEnabled, setSparkleEnabled] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('draw');
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [saveDataUrl, setSaveDataUrl] = useState<string | null>(null);

  const handleKeep = useCallback(async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.getDataUrl();
    setSaveDataUrl(dataUrl);

    await saveDrawing({
      name: name || 'Untitled',
      dataUrl,
      width: window.innerWidth,
      height: window.innerHeight,
      createdAt: Date.now(),
    });
  }, [name, saveDrawing]);

  const handleErase = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  const handleSaveComplete = useCallback(() => {
    setSaveDataUrl(null);
    canvasRef.current?.clear();
  }, []);

  const handleStampPlaced = useCallback(() => {
    // Keep stamp tool active for multiple placements
  }, []);

  const handleEmojiPlaced = useCallback(() => {
    // Keep emoji tool active for multiple placements
  }, []);

  if (!loaded) return null;

  if (!name) {
    return <NameEntryModal onSubmit={setName} />;
  }

  return (
    <div className="relative w-full h-full bg-white">
      <DrawingCanvas
        ref={canvasRef}
        color={color}
        brushSize={brushSize}
        sparkleEnabled={sparkleEnabled}
        activeTool={activeTool}
        activeStamp={activeStamp}
        activeEmoji={activeEmoji}
        onStampPlaced={handleStampPlaced}
        onEmojiPlaced={handleEmojiPlaced}
      />
      <Toolbar
        color={color}
        brushSize={brushSize}
        sparkleEnabled={sparkleEnabled}
        activeTool={activeTool}
        activeStamp={activeStamp}
        activeEmoji={activeEmoji}
        onColorChange={setColor}
        onBrushSizeChange={setBrushSize}
        onSparkleToggle={() => setSparkleEnabled(prev => !prev)}
        onToolChange={setActiveTool}
        onStampSelect={setActiveStamp}
        onEmojiSelect={setActiveEmoji}
        onKeep={handleKeep}
        onErase={handleErase}
      />
      {saveDataUrl && (
        <SaveAnimation dataUrl={saveDataUrl} onComplete={handleSaveComplete} />
      )}
    </div>
  );
}
