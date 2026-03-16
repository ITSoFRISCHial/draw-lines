export interface Drawing {
  id?: number;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  createdAt: number;
}

export interface RoomState {
  currentRoom: number;
  unlockedRooms: number;
}

export type BrushSize = 'thick' | 'thin';

export type Tool = 'draw' | 'stamp' | 'emoji';

export interface StampDef {
  name: string;
  path: string;
}

export interface WallSlot {
  position: [number, number, number];
  rotation: [number, number, number];
  wall: 'left' | 'right';
}

export interface RoomDef {
  index: number;
  drawings: Drawing[];
  wallSlots: WallSlot[];
}
