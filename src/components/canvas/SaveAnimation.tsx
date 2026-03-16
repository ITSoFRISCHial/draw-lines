'use client';

import { useEffect, useState } from 'react';

interface SaveAnimationProps {
  dataUrl: string | null;
  onComplete: () => void;
}

const CONFETTI_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6fb5',
  '#c06cf0', '#ff922b', '#20c997', '#339af0', '#f06595',
  '#fcc419', '#69db7c', '#748ffc', '#e599f7', '#63e6be',
  '#ffa94d', '#74c0fc', '#da77f2', '#a9e34b', '#ff8787',
];

export default function SaveAnimation({ dataUrl, onComplete }: SaveAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!dataUrl) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [dataUrl, onComplete]);

  if (!dataUrl || !visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti */}
      {CONFETTI_COLORS.map((confettiColor, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 md:w-4 md:h-4 rounded-sm"
          style={{
            backgroundColor: confettiColor,
            left: '50%',
            top: '50%',
            animation: `confetti-burst-${i % 4} 1.2s ease-out forwards`,
          }}
        />
      ))}

      {/* Drawing shrinking to corner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="Saved drawing"
        className="absolute rounded-md"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '3px solid #fbbf24',
          animation: 'shrink-to-corner 1.2s ease-in forwards',
        }}
      />

      <style>{`
        @keyframes shrink-to-corner {
          0% {
            left: 50%;
            top: 50%;
            width: 60vw;
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          100% {
            left: 95%;
            top: 5%;
            width: 10vw;
            opacity: 0;
            transform: translate(-100%, 0);
          }
        }

        @keyframes confetti-burst-0 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${randomOffset()}px), calc(-50% + ${randomOffset()}px)) scale(0); opacity: 0; }
        }
        @keyframes confetti-burst-1 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${randomOffset()}px), calc(-50% + ${randomOffset()}px)) scale(0); opacity: 0; }
        }
        @keyframes confetti-burst-2 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${randomOffset()}px), calc(-50% + ${randomOffset()}px)) scale(0); opacity: 0; }
        }
        @keyframes confetti-burst-3 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${randomOffset()}px), calc(-50% + ${randomOffset()}px)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function randomOffset(): number {
  return Math.round((Math.random() - 0.5) * 300);
}
