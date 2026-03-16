'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePlayerName } from '@/hooks/usePlayerName';
import { useDrawings } from '@/hooks/useDrawings';
import { useTouchPrevention } from '@/hooks/useTouchPrevention';
import NameEntryModal from '@/components/shared/NameEntryModal';
import { ICON_SIZE_CLASS } from '@/lib/constants';

const MuseumScene = dynamic(() => import('@/components/museum/MuseumScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#2C1810]">
      <div className="text-4xl animate-pulse">🏛️</div>
    </div>
  ),
});

export default function MuseumPage() {
  const { name, loaded, setName } = usePlayerName();
  const { drawings, loaded: drawingsLoaded } = useDrawings();
  useTouchPrevention();

  if (!loaded || !drawingsLoaded) return null;

  if (!name) {
    return <NameEntryModal onSubmit={setName} />;
  }

  return (
    <div className="relative w-full h-full bg-[#2C1810]">
      <MuseumScene drawings={drawings} playerName={name} />

      {/* Back to drawing button */}
      <Link
        href="/"
        aria-label="Back to drawing"
        className={`
          ${ICON_SIZE_CLASS}
          absolute top-4 left-4 z-10
          flex items-center justify-center rounded-xl
          bg-black/30 hover:bg-black/50
          transition-all duration-150 active:scale-90
        `}
      >
        <span className="text-2xl">🎨</span>
      </Link>

      {drawings.length === 0 && (
        <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none">
          <div className="rounded-2xl bg-black/50 px-8 py-6 text-center">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-white/80 text-lg">Draw something first!</p>
          </div>
        </div>
      )}
    </div>
  );
}
