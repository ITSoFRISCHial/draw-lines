'use client';

import { useState, useCallback } from 'react';
import type { BrushSize, Tool } from '@/types';
import { BRUSH_THICK, BRUSH_THIN } from '@/lib/constants';
import IconButton from '@/components/shared/IconButton';
import NavigationButton from '@/components/shared/NavigationButton';
import BrushSizeToggle from './BrushSizeToggle';
import ColorButton from './ColorButton';
import RainbowPicker from './RainbowPicker';
import PotionMixer from './PotionMixer';
import SparkleToggle from './SparkleToggle';
import ShapeStamps from './ShapeStamps';
import EmojiPicker from './EmojiPicker';
import CheckButton from './CheckButton';

interface ToolbarProps {
  color: string;
  brushSize: number;
  sparkleEnabled: boolean;
  activeTool: Tool;
  activeStamp: string | null;
  activeEmoji: string | null;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onSparkleToggle: () => void;
  onToolChange: (tool: Tool) => void;
  onStampSelect: (stamp: string | null) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onKeep: () => void;
  onErase: () => void;
}

export default function Toolbar({
  color,
  brushSize,
  sparkleEnabled,
  activeTool,
  activeStamp,
  activeEmoji,
  onColorChange,
  onBrushSizeChange,
  onSparkleToggle,
  onToolChange,
  onStampSelect,
  onEmojiSelect,
  onKeep,
  onErase,
}: ToolbarProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showPotion, setShowPotion] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const currentSize: BrushSize = brushSize === BRUSH_THICK ? 'thick' : 'thin';

  const handleBrushToggle = useCallback(() => {
    onBrushSizeChange(brushSize === BRUSH_THICK ? BRUSH_THIN : BRUSH_THICK);
    onToolChange('draw');
  }, [brushSize, onBrushSizeChange, onToolChange]);

  const handleColorSelect = useCallback((c: string) => {
    onColorChange(c);
    setShowPicker(false);
  }, [onColorChange]);

  const handleStampSelect = useCallback((stampPath: string) => {
    onStampSelect(stampPath);
    onToolChange('stamp');
    setShowStamps(false);
  }, [onStampSelect, onToolChange]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    onEmojiSelect(emoji);
    onToolChange('emoji');
    setShowEmojis(false);
  }, [onEmojiSelect, onToolChange]);

  const handlePotionMix = useCallback((c: string) => {
    onColorChange(c);
    setShowPotion(false);
  }, [onColorChange]);

  return (
    <>
      {/* Bottom toolbar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 safe-bottom">
        <div className="flex items-center justify-around gap-1 bg-gradient-to-t from-purple-600 to-purple-500 px-2 py-2 md:gap-2 md:px-4">
          {/* Brush size */}
          <BrushSizeToggle size={currentSize} onToggle={handleBrushToggle} />

          {/* Color */}
          <ColorButton color={color} onClick={() => setShowPicker(!showPicker)} />

          {/* Potion mixer */}
          <IconButton
            onClick={() => setShowPotion(!showPotion)}
            label="Mix colors"
            active={showPotion}
          >
            <span className="text-2xl">🧪</span>
          </IconButton>

          {/* Sparkle */}
          <SparkleToggle enabled={sparkleEnabled} onToggle={onSparkleToggle} />

          {/* Stamps */}
          <IconButton
            onClick={() => {
              if (activeTool === 'stamp') {
                onToolChange('draw');
                onStampSelect(null);
              } else {
                setShowStamps(!showStamps);
              }
            }}
            label="Stamps"
            active={activeTool === 'stamp'}
          >
            <span className="text-2xl">⭐</span>
          </IconButton>

          {/* Emoji */}
          <IconButton
            onClick={() => {
              if (activeTool === 'emoji') {
                onToolChange('draw');
                onEmojiSelect(null);
              } else {
                setShowEmojis(!showEmojis);
              }
            }}
            label="Emoji"
            active={activeTool === 'emoji'}
          >
            <span className="text-2xl">😀</span>
          </IconButton>

          {/* Check / save */}
          <CheckButton onKeep={onKeep} onErase={onErase} />

          {/* Museum nav */}
          <NavigationButton href="/museum" label="Go to museum">
            <span className="text-2xl">🏛️</span>
          </NavigationButton>
        </div>
      </div>

      {/* Overlays */}
      {showPicker && (
        <RainbowPicker
          onColorSelect={handleColorSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
      {showPotion && (
        <PotionMixer
          onColorMixed={handlePotionMix}
          onClose={() => setShowPotion(false)}
        />
      )}
      {showStamps && (
        <ShapeStamps
          onStampSelect={handleStampSelect}
          activeStamp={activeStamp}
          onClose={() => setShowStamps(false)}
        />
      )}
      {showEmojis && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojis(false)}
        />
      )}
    </>
  );
}
