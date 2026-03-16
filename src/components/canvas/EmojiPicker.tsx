'use client';

import { EMOJIS } from '@/lib/constants';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="relative bg-gray-900 rounded-t-2xl p-4 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-500" />
        </div>

        <div className="grid grid-cols-5 gap-3 md:gap-4 max-w-sm mx-auto pb-6">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onEmojiSelect(emoji)}
              className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16
                rounded-xl bg-white/10 hover:bg-white/20
                active:scale-90 transition-all text-3xl md:text-4xl"
              aria-label={`Emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
