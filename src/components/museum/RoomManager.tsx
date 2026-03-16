'use client';

import { useMemo } from 'react';
import { PAINTINGS_PER_ROOM } from '@/lib/constants';
import { getWallSlots, getDoorwayPosition, getRoomOffset } from '@/lib/museumLayout';
import { useRoomState } from '@/hooks/useRoomState';
import MuseumRoom from './MuseumRoom';
import MuseumEntrance from './MuseumEntrance';
import Doorway from './Doorway';
import GalleryBench from './GalleryBench';
import type { Drawing } from '@/types';

interface RoomManagerProps {
  drawings: Drawing[];
  playerName: string;
}

export default function RoomManager({ drawings, playerName }: RoomManagerProps) {
  const { unlockedRooms } = useRoomState(drawings.length);
  const wallSlots = useMemo(() => getWallSlots(), []);

  const roomChunks = useMemo(() => {
    const chunks: Drawing[][] = [];
    for (let i = 0; i < drawings.length; i += PAINTINGS_PER_ROOM) {
      chunks.push(drawings.slice(i, i + PAINTINGS_PER_ROOM));
    }
    // Always have at least one room
    if (chunks.length === 0) chunks.push([]);
    return chunks;
  }, [drawings]);

  // Entrance position: in front of room 0
  const entrancePos = getDoorwayPosition(-1);
  // Shift entrance to front of first room (negative Z)
  const entrancePosition: [number, number, number] = [entrancePos[0], entrancePos[1], -8];

  return (
    <group>
      {/* Museum entrance arch */}
      <MuseumEntrance playerName={playerName} position={entrancePosition} />

      {/* Rooms */}
      {roomChunks.map((chunk, i) => (
        <group key={i}>
          <MuseumRoom
            roomIndex={i}
            drawings={chunk}
            wallSlots={wallSlots}
            isLast={i === roomChunks.length - 1}
          />

          {/* Gallery bench in center of each room */}
          <GalleryBench
            position={[
              getRoomOffset(i)[0],
              getRoomOffset(i)[1],
              getRoomOffset(i)[2],
            ]}
          />

          {/* Doorway between this room and the next */}
          {i < roomChunks.length - 1 && (
            <Doorway
              position={getDoorwayPosition(i)}
              locked={i + 1 >= unlockedRooms}
            />
          )}
        </group>
      ))}
    </group>
  );
}
