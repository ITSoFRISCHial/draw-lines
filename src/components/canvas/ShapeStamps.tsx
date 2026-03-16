'use client';

import Image from 'next/image';
import { STAMPS } from '@/lib/constants';

interface ShapeStampsProps {
  onStampSelect: (stampPath: string) => void;
  activeStamp: string | null;
  onClose: () => void;
}

export default function ShapeStamps({ onStampSelect, activeStamp, onClose }: ShapeStampsProps) {
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

        <div className="grid grid-cols-4 gap-4 md:gap-6 max-w-sm mx-auto pb-6">
          {STAMPS.map((stamp) => (
            <button
              key={stamp.name}
              onClick={() => onStampSelect(stamp.path)}
              className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20
                rounded-xl transition-all active:scale-90
                ${activeStamp === stamp.path
                  ? 'bg-white/30 ring-2 ring-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
                }`}
              aria-label={`${stamp.name} stamp`}
            >
              <Image
                src={stamp.path}
                alt={stamp.name}
                width={40}
                height={40}
                className="w-10 h-10 md:w-12 md:h-12 invert"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
