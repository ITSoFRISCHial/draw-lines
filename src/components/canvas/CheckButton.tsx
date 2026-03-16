'use client';

import { useState } from 'react';
import IconButton from '@/components/shared/IconButton';

interface CheckButtonProps {
  onKeep: () => void;
  onErase: () => void;
}

export default function CheckButton({ onKeep, onErase }: CheckButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <IconButton onClick={() => setShowModal(true)} label="Done drawing">
        <span className="text-2xl md:text-3xl text-green-400">&#10003;</span>
      </IconButton>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowModal(false)}
        >
          <div
            className="flex gap-8 md:gap-12 p-8 md:p-12 bg-gray-800 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Keep */}
            <button
              onClick={() => {
                setShowModal(false);
                onKeep();
              }}
              className="flex flex-col items-center gap-3 min-w-[80px] min-h-[80px]
                p-4 rounded-2xl bg-green-600/30 hover:bg-green-600/50
                active:scale-90 transition-all"
              aria-label="Keep drawing"
            >
              <span className="text-5xl md:text-6xl">🖼️</span>
              <span className="text-white text-sm font-medium">Keep</span>
            </button>

            {/* Erase */}
            <button
              onClick={() => {
                setShowModal(false);
                onErase();
              }}
              className="flex flex-col items-center gap-3 min-w-[80px] min-h-[80px]
                p-4 rounded-2xl bg-red-600/30 hover:bg-red-600/50
                active:scale-90 transition-all"
              aria-label="Erase drawing"
            >
              <span className="text-5xl md:text-6xl">🗑️</span>
              <span className="text-white text-sm font-medium">Erase</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
