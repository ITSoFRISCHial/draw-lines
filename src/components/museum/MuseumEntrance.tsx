'use client';

import { Text, Center } from '@react-three/drei';
import { ROOM_HEIGHT } from '@/lib/constants';

interface MuseumEntranceProps {
  playerName: string;
  position: [number, number, number];
}

const FRAME_COLOR = '#3E2723';
const GOLD_TEXT = '#DAA520';
const DOOR_WIDTH = 3;
const DOOR_HEIGHT = ROOM_HEIGHT * 0.75;
const FRAME_THICKNESS = 0.18;
const FRAME_DEPTH = 0.35;

export default function MuseumEntrance({ playerName, position }: MuseumEntranceProps) {
  return (
    <group position={position}>
      {/* Left post */}
      <mesh position={[-DOOR_WIDTH / 2 - FRAME_THICKNESS / 2, -ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>

      {/* Right post */}
      <mesh position={[DOOR_WIDTH / 2 + FRAME_THICKNESS / 2, -ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[FRAME_THICKNESS, DOOR_HEIGHT, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, -ROOM_HEIGHT / 2 + DOOR_HEIGHT + FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[DOOR_WIDTH + FRAME_THICKNESS * 2, FRAME_THICKNESS, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>

      {/* Museum name text */}
      <Center position={[0, -ROOM_HEIGHT / 2 + DOOR_HEIGHT + 0.6, 0]}>
        <Text
          fontSize={0.35}
          color={GOLD_TEXT}
          anchorX="center"
          anchorY="middle"
          maxWidth={DOOR_WIDTH + 2}
          textAlign="center"
        >
          {`${playerName}'s Museum`}
          <meshStandardMaterial
            color={GOLD_TEXT}
            metalness={0.5}
            roughness={0.3}
          />
        </Text>
      </Center>
    </group>
  );
}
