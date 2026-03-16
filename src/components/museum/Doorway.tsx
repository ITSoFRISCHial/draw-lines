'use client';

import { ROOM_HEIGHT } from '@/lib/constants';

interface DoorwayProps {
  position: [number, number, number];
  locked: boolean;
}

const FRAME_COLOR = '#3E2723';
const ROPE_COLOR = '#8B0000';
const DOOR_WIDTH = 2.4;
const DOOR_HEIGHT = ROOM_HEIGHT * 0.7;
const FRAME_THICKNESS = 0.15;
const FRAME_DEPTH = 0.3;

export default function Doorway({ position, locked }: DoorwayProps) {
  return (
    <group position={position}>
      {/* Left post */}
      <mesh position={[-DOOR_WIDTH / 2 - FRAME_THICKNESS / 2, -ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>

      {/* Right post */}
      <mesh position={[DOOR_WIDTH / 2 + FRAME_THICKNESS / 2, -ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, -ROOM_HEIGHT / 2 + DOOR_HEIGHT + FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[DOOR_WIDTH + FRAME_THICKNESS * 2, FRAME_THICKNESS, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>

      {/* Velvet rope when locked */}
      {locked && (
        <group>
          {/* Left rope post */}
          <mesh position={[-DOOR_WIDTH / 2 + 0.15, -ROOM_HEIGHT / 2 + 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial color={FRAME_COLOR} metalness={0.3} />
          </mesh>
          {/* Left post top ball */}
          <mesh position={[-DOOR_WIDTH / 2 + 0.15, -ROOM_HEIGHT / 2 + 1.05, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#C5A000" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Right rope post */}
          <mesh position={[DOOR_WIDTH / 2 - 0.15, -ROOM_HEIGHT / 2 + 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial color={FRAME_COLOR} metalness={0.3} />
          </mesh>
          {/* Right post top ball */}
          <mesh position={[DOOR_WIDTH / 2 - 0.15, -ROOM_HEIGHT / 2 + 1.05, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#C5A000" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Rope (horizontal cylinder) */}
          <mesh
            position={[0, -ROOM_HEIGHT / 2 + 0.9, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.03, 0.03, DOOR_WIDTH - 0.3, 8]} />
            <meshStandardMaterial color={ROPE_COLOR} roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}
