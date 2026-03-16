import { ROOM_WIDTH, ROOM_DEPTH, ROOM_HEIGHT, PAINTINGS_PER_WALL } from './constants';
import type { WallSlot } from '@/types';

export function getWallSlots(): WallSlot[] {
  const slots: WallSlot[] = [];
  const paintingSpacing = ROOM_DEPTH / (PAINTINGS_PER_WALL + 1);
  const paintingHeight = ROOM_HEIGHT * 0.55;

  // Left wall paintings
  for (let i = 0; i < PAINTINGS_PER_WALL; i++) {
    slots.push({
      position: [-ROOM_WIDTH / 2 + 0.05, paintingHeight, -ROOM_DEPTH / 2 + paintingSpacing * (i + 1)],
      rotation: [0, Math.PI / 2, 0],
      wall: 'left',
    });
  }

  // Right wall paintings
  for (let i = 0; i < PAINTINGS_PER_WALL; i++) {
    slots.push({
      position: [ROOM_WIDTH / 2 - 0.05, paintingHeight, -ROOM_DEPTH / 2 + paintingSpacing * (i + 1)],
      rotation: [0, -Math.PI / 2, 0],
      wall: 'right',
    });
  }

  return slots;
}

export function getRoomOffset(roomIndex: number): [number, number, number] {
  // Rooms are laid out in a line along Z axis
  return [0, 0, roomIndex * ROOM_DEPTH];
}

export function getDoorwayPosition(roomIndex: number): [number, number, number] {
  const offset = getRoomOffset(roomIndex);
  return [offset[0], ROOM_HEIGHT / 2, offset[2] + ROOM_DEPTH / 2];
}
