'use client';

import { useState } from 'react';

interface NameEntryModalProps {
  onSubmit: (name: string) => void;
}

export default function NameEntryModal({ onSubmit }: NameEntryModalProps) {
  const [value, setValue] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-purple-500 to-pink-500">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="text-6xl">🎨</div>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Your name"
          autoFocus
          maxLength={20}
          className="w-64 rounded-2xl border-4 border-white/50 bg-white/20 px-6 py-4 text-center text-3xl font-bold text-white placeholder-white/60 outline-none focus:border-white"
        />
        <button
          onClick={() => value.trim() && onSubmit(value.trim())}
          disabled={!value.trim()}
          className="rounded-2xl bg-yellow-400 px-12 py-4 text-3xl font-bold text-purple-800 shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          Go!
        </button>
      </div>
    </div>
  );
}
