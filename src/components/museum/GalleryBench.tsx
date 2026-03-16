'use client';

interface GalleryBenchProps {
  position: [number, number, number];
}

const WOOD = '#5C3A1E';
const SEAT_W = 2.4;
const SEAT_D = 0.8;
const SEAT_H = 0.1;
const LEG_W = 0.15;
const LEG_H = 0.5;

export default function GalleryBench({ position }: GalleryBenchProps) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, LEG_H + SEAT_H / 2, 0]}>
        <boxGeometry args={[SEAT_W, SEAT_H, SEAT_D]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-SEAT_W / 2 + LEG_W, LEG_H / 2, 0]}>
        <boxGeometry args={[LEG_W, LEG_H, SEAT_D * 0.8]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>

      {/* Right leg */}
      <mesh position={[SEAT_W / 2 - LEG_W, LEG_H / 2, 0]}>
        <boxGeometry args={[LEG_W, LEG_H, SEAT_D * 0.8]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
    </group>
  );
}
