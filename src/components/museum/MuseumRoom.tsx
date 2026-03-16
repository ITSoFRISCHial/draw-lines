'use client';

import { ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH } from '@/lib/constants';
import { getRoomOffset } from '@/lib/museumLayout';
import PictureFrame from './PictureFrame';
import type { Drawing, WallSlot } from '@/types';

interface MuseumRoomProps {
  roomIndex: number;
  drawings: Drawing[];
  wallSlots: WallSlot[];
  isLast: boolean;
}

const FLOOR_COLOR = '#8B6914';
const WALL_COLOR = '#FFF8E7';
const CEILING_COLOR = '#F0E6D0';
const WALL_THICKNESS = 0.1;
const DOORWAY_WIDTH = 2.4;
const DOORWAY_HEIGHT = ROOM_HEIGHT * 0.7;

export default function MuseumRoom({ roomIndex, drawings, wallSlots, isLast }: MuseumRoomProps) {
  const offset = getRoomOffset(roomIndex);

  return (
    <group position={offset}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Front wall (negative Z end) */}
      {roomIndex === 0 ? (
        <>
          {/* Room 0: front wall with entrance arch opening */}
          {/* Left section */}
          <mesh position={[-(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Right section */}
          <mesh position={[(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Top section above doorway */}
          <mesh position={[0, DOORWAY_HEIGHT + (ROOM_HEIGHT - DOORWAY_HEIGHT) / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[DOORWAY_WIDTH, ROOM_HEIGHT - DOORWAY_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
        </>
      ) : (
        <>
          {/* Non-first rooms: front wall with doorway from previous room */}
          {/* Left section */}
          <mesh position={[-(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Right section */}
          <mesh position={[(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Top section above doorway */}
          <mesh position={[0, DOORWAY_HEIGHT + (ROOM_HEIGHT - DOORWAY_HEIGHT) / 2, -ROOM_DEPTH / 2]}>
            <boxGeometry args={[DOORWAY_WIDTH, ROOM_HEIGHT - DOORWAY_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Back wall (positive Z end) */}
      {isLast ? (
        /* Last room: solid back wall */
        <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
          <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
        </mesh>
      ) : (
        <>
          {/* Back wall with doorway opening */}
          {/* Left section */}
          <mesh position={[-(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Right section */}
          <mesh position={[(ROOM_WIDTH / 4 + DOORWAY_WIDTH / 4), ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
            <boxGeometry args={[ROOM_WIDTH / 2 - DOORWAY_WIDTH / 2, ROOM_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
          {/* Top section above doorway */}
          <mesh position={[0, DOORWAY_HEIGHT + (ROOM_HEIGHT - DOORWAY_HEIGHT) / 2, ROOM_DEPTH / 2]}>
            <boxGeometry args={[DOORWAY_WIDTH, ROOM_HEIGHT - DOORWAY_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Picture frames */}
      {drawings.map((drawing, i) => {
        const slot = wallSlots[i];
        if (!slot) return null;
        return (
          <PictureFrame
            key={drawing.id ?? i}
            drawing={drawing}
            position={slot.position}
            rotation={slot.rotation}
          />
        );
      })}

      {/* Room ambient light */}
      <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={0.5} distance={ROOM_DEPTH} color="#FFF8E7" />
    </group>
  );
}
